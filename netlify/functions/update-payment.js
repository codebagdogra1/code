const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    if (event.httpMethod === 'PUT') {
        const client = await pool.connect();
        
        try {
            const { receipt_no, additional_payment, payment_method } = JSON.parse(event.body);
            
            // Validate input
            if (!receipt_no || !additional_payment || additional_payment <= 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid payment data' })
                };
            }
            
            // Update the payment in database
            const result = await client.query(`
                UPDATE registrations 
                SET 
                    paid_amount = paid_amount + $1,
                    due_amount = GREATEST(0, total_amount - discount_amount - (paid_amount + $1)),
                    payment_method = COALESCE($2, payment_method),
                    payment_status = CASE 
                        WHEN (total_amount - discount_amount - (paid_amount + $1)) <= 0 THEN 'COMPLETED'
                        ELSE 'PARTIAL'
                    END
                WHERE receipt_no = $3
                RETURNING *
            `, [additional_payment, payment_method, receipt_no]);
            
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
                body: JSON.stringify({ 
                    success: true, 
                    message: `Payment of ₹${additional_payment} added successfully`,
                    registration: result.rows[0]
                })
            };
            
        } catch (error) {
            console.error('Error updating payment:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to update payment' })
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
