// Create a new file: netlify/functions/delete-registration.js

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    if (event.httpMethod === 'DELETE') {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const { registration_id, receipt_no } = JSON.parse(event.body);
            
            if (!registration_id && !receipt_no) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Registration ID or receipt number required' })
                };
            }
            
            let whereClause, whereValue;
            if (registration_id) {
                whereClause = 'id = $1';
                whereValue = registration_id;
            } else {
                whereClause = 'receipt_no = $1';
                whereValue = receipt_no;
            }
            
            // First, get the registration to verify it exists
            const registrationResult = await client.query(
                `SELECT r.id, r.receipt_no, r.student_id, s.full_name 
                 FROM registrations r 
                 JOIN students s ON r.student_id = s.id 
                 WHERE ${whereClause}`,
                [whereValue]
            );
            
            if (registrationResult.rows.length === 0) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Registration not found' })
                };
            }
            
            const registration = registrationResult.rows[0];
            const regId = registration.id;
            const studentId = registration.student_id;
            
            // Delete in correct order to respect foreign key constraints
            
            // 1. Delete payment history
            await client.query('DELETE FROM payment_history WHERE registration_id = $1', [regId]);
            
            // 2. Delete course registrations
            await client.query('DELETE FROM course_registrations WHERE registration_id = $1', [regId]);
            
            // 3. Delete the registration
            await client.query('DELETE FROM registrations WHERE id = $1', [regId]);
            
            // 4. Check if student has other registrations
            const otherRegistrations = await client.query(
                'SELECT COUNT(*) as count FROM registrations WHERE student_id = $1',
                [studentId]
            );
            
            // 5. If no other registrations, delete the student record too
            if (parseInt(otherRegistrations.rows[0].count) === 0) {
                await client.query('DELETE FROM students WHERE id = $1', [studentId]);
            }
            
            await client.query('COMMIT');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: `Registration ${registration.receipt_no} and all related data deleted successfully`,
                    deleted_student: parseInt(otherRegistrations.rows[0].count) === 0 ? true : false
                })
            };
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error deleting registration:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to delete registration' })
            };
        } finally {
            client.release();
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};
