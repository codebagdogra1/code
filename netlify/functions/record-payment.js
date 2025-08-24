const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

function generatePaymentReceiptNo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    return `PMT-${year}${month}-${timestamp}`;
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    const client = await pool.connect();

    try {
        if (event.httpMethod === 'POST') {
            await client.query('BEGIN');
            
            const { 
                registration_receipt_no, 
                payment_amount, 
                payment_method, 
                notes = ''
            } = JSON.parse(event.body);

            if (!registration_receipt_no || !payment_amount || payment_amount <= 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid payment data' })
                };
            }

            const registrationResult = await client.query(
                'SELECT id, total_amount, discount_amount, paid_amount, due_amount FROM registrations WHERE receipt_no = $1',
                [registration_receipt_no]
            );

            if (registrationResult.rows.length === 0) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Registration not found' })
                };
            }

            const registration = registrationResult.rows[0];
            
            if (payment_amount > registration.due_amount) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        error: `Payment amount (₹${payment_amount}) exceeds due amount (₹${registration.due_amount})`
                    })
                };
            }

            const paymentReceiptNo = generatePaymentReceiptNo();

            await client.query(`
                INSERT INTO payment_history (registration_id, payment_amount, payment_method, payment_type, receipt_no, notes)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [registration.id, payment_amount, payment_method, 'installment', paymentReceiptNo, notes]);

            await client.query(`
                UPDATE registrations 
                SET 
                    paid_amount = paid_amount + $1,
                    due_amount = GREATEST(0, total_amount - discount_amount - (paid_amount + $1)),
                    payment_status = CASE 
                        WHEN (total_amount - discount_amount - (paid_amount + $1)) <= 0 THEN 'COMPLETED'
                        ELSE 'PARTIAL'
                    END
                WHERE id = $2
            `, [payment_amount, registration.id]);

            await client.query('COMMIT');

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: `Payment of ₹${payment_amount} recorded successfully`,
                    payment_receipt_no: paymentReceiptNo
                })
            };
        }

        if (event.httpMethod === 'GET') {
            const receiptNo = event.queryStringParameters?.receipt_no;
            
            const result = await client.query(`
                SELECT ph.*, r.receipt_no as registration_receipt_no, s.full_name, s.phone_number
                FROM payment_history ph
                JOIN registrations r ON ph.registration_id = r.id
                JOIN students s ON r.student_id = s.id
                WHERE r.receipt_no = $1
                ORDER BY ph.payment_date DESC
            `, [receiptNo]);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ payments: result.rows })
            };
        }

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing payment:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Payment processing failed' })
        };
    } finally {
        client.release();
    }
};
