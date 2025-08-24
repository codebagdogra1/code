// netlify/functions/registrations.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Generate receipt number
function generateReceiptNo() {
    const now = new Date();
    const year = now.getFullYear();
    const timestamp = now.getTime().toString().slice(-6);
    return `CODE-${year}-${timestamp}`;
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    const client = await pool.connect();

    try {
        if (event.httpMethod === 'POST') {
            await client.query('BEGIN');
            
            const { studentData, selectedCourses, paymentDetails } = JSON.parse(event.body);
            
            // Insert or get student
            let studentId;
            const existingStudent = await client.query(
                'SELECT id FROM students WHERE phone_number = $1',
                [studentData.phone_number]
            );
            
            if (existingStudent.rows.length > 0) {
                studentId = existingStudent.rows[0].id;
                await client.query(
                    `UPDATE students SET 
                    full_name = $1, email = $2, date_of_birth = $3, 
                    address = $4, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = $5`,
                    [studentData.full_name, studentData.email, studentData.date_of_birth, 
                     studentData.address, studentId]
                );
            } else {
                const studentResult = await client.query(
                    `INSERT INTO students (full_name, phone_number, email, date_of_birth, address) 
                    VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                    [studentData.full_name, studentData.phone_number, studentData.email,
                     studentData.date_of_birth, studentData.address]
                );
                studentId = studentResult.rows[0].id;
            }
            
            // Create registration
            const receiptNo = generateReceiptNo();
            const registrationResult = await client.query(
                `INSERT INTO registrations 
                (receipt_no, student_id, total_amount, discount_amount, paid_amount, due_amount, payment_method) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [receiptNo, studentId, paymentDetails.total_amount, paymentDetails.discount_amount,
                 paymentDetails.paid_amount, paymentDetails.due_amount, paymentDetails.payment_method]
            );
            const registrationId = registrationResult.rows[0].id;
            
            // Insert course registrations
            for (const courseSelection of selectedCourses) {
                await client.query(
                    `INSERT INTO course_registrations (registration_id, course_id, payment_plan, course_fee) 
                    VALUES ($1, $2, $3, $4)`,
                    [registrationId, courseSelection.course_id, courseSelection.payment_plan, courseSelection.course_fee]
                );
            }
            
            await client.query('COMMIT');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    receipt_no: receiptNo,
                    registration_id: registrationId,
                    message: 'Registration created successfully' 
                })
            };
        }

        if (event.httpMethod === 'GET') {
            const pathParts = event.path.split('/');
            const receiptNo = pathParts[pathParts.length - 1];
            
            if (receiptNo && receiptNo !== 'registrations') {
                // Get specific registration
                const result = await client.query(`
                    SELECT 
                        r.*,
                        s.full_name, s.phone_number, s.email, s.address, s.date_of_birth,
                        json_agg(
                            json_build_object(
                                'course_name', c.name,
                                'payment_plan', cr.payment_plan,
                                'course_fee', cr.course_fee,
                                'duration', c.duration
                            )
                        ) as courses
                    FROM registrations r
                    JOIN students s ON r.student_id = s.id
                    JOIN course_registrations cr ON r.id = cr.registration_id
                    JOIN courses c ON cr.course_id = c.id
                    WHERE r.receipt_no = $1
                    GROUP BY r.id, s.id
                `, [receiptNo]);
                
                if (result.rows.length === 0) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Registration not found' })
                    };
                }
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(result.rows[0])
                };
            } else {
                // Get all registrations with pagination
                const page = parseInt(event.queryStringParameters?.page) || 1;
                const limit = parseInt(event.queryStringParameters?.limit) || 10;
                const offset = (page - 1) * limit;
                
                const result = await client.query(`
                    SELECT 
                        r.id, r.receipt_no, r.registration_date, r.total_amount, 
                        r.paid_amount, r.due_amount, r.payment_method, r.payment_status,
                        s.full_name, s.phone_number, s.email
                    FROM registrations r
                    JOIN students s ON r.student_id = s.id
                    ORDER BY r.registration_date DESC
                    LIMIT $1 OFFSET $2
                `, [limit, offset]);
                
                const countResult = await client.query('SELECT COUNT(*) FROM registrations');
                const totalRecords = parseInt(countResult.rows[0].count);
                const totalPages = Math.ceil(totalRecords / limit);
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        registrations: result.rows,
                        pagination: {
                            currentPage: page,
                            totalPages,
                            totalRecords,
                            hasNext: page < totalPages,
                            hasPrev: page > 1
                        }
                    })
                };
            }
        }
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Server error' })
        };
    } finally {
        client.release();
    }
};