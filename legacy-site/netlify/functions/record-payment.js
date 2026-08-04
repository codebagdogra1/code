// Enhanced netlify/functions/record-payment.js
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
                notes = '',
                monthly_payments = [] // Array of {course_id, month_ids[], amount}
            } = JSON.parse(event.body);

            if (!registration_receipt_no || !payment_amount || payment_amount <= 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid payment data' })
                };
            }

            // Get registration details
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
            const paymentReceiptNo = generatePaymentReceiptNo();

            // Validate monthly payments if provided
            if (monthly_payments && monthly_payments.length > 0) {
                let totalMonthlyAmount = 0;
                const warnings = [];

                // Validate each monthly payment
                for (const monthlyPayment of monthly_payments) {
                    const { course_id, month_ids, amount } = monthlyPayment;
                    totalMonthlyAmount += amount;

                    // Get installment details
                    const installmentResult = await client.query(`
                        SELECT mi.*, c.name as course_name
                        FROM monthly_installments mi
                        JOIN courses c ON mi.course_id = c.id
                        WHERE mi.registration_id = $1 AND mi.course_id = $2 AND mi.id = ANY($3::int[])
                        ORDER BY mi.month_number
                    `, [registration.id, course_id, month_ids]);

                    // Check for skipped months
                    const installments = installmentResult.rows;
                    const monthNumbers = installments.map(i => i.month_number).sort();
                    
                    // Check if there are unpaid previous months
                    const unpaidPreviousMonths = await client.query(`
                        SELECT month_number, month_name
                        FROM monthly_installments
                        WHERE registration_id = $1 AND course_id = $2 
                        AND month_number < $3 AND payment_status = 'PENDING'
                        ORDER BY month_number
                    `, [registration.id, course_id, Math.min(...monthNumbers)]);

                    if (unpaidPreviousMonths.rows.length > 0) {
                        const courseName = installments[0]?.course_name || 'Unknown Course';
                        const unpaidMonths = unpaidPreviousMonths.rows.map(m => m.month_name).join(', ');
                        warnings.push(`WARNING: ${courseName} has unpaid previous months: ${unpaidMonths}`);
                    }
                }

                if (Math.abs(totalMonthlyAmount - payment_amount) > 0.01) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ 
                            error: `Monthly payment breakdown (₹${totalMonthlyAmount}) doesn't match total payment (₹${payment_amount})`
                        })
                    };
                }

                // Record the main payment
                const paymentResult = await client.query(`
                    INSERT INTO payment_history (registration_id, payment_amount, payment_method, payment_type, receipt_no, notes)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
                `, [registration.id, payment_amount, payment_method, 'installment', paymentReceiptNo, notes]);

                const paymentHistoryId = paymentResult.rows[0].id;

                // Apply payments to specific monthly installments
                for (const monthlyPayment of monthly_payments) {
                    const { course_id, month_ids, amount } = monthlyPayment;
                    const amountPerMonth = amount / month_ids.length;

                    for (const monthId of month_ids) {
                        // Update the monthly installment
                        await client.query(`
                            UPDATE monthly_installments 
                            SET 
                                paid_amount = paid_amount + $1,
                                payment_status = CASE 
                                    WHEN (paid_amount + $1) >= installment_amount THEN 'PAID'
                                    ELSE 'PARTIAL'
                                END,
                                payment_date = CASE 
                                    WHEN (paid_amount + $1) >= installment_amount THEN CURRENT_DATE
                                    ELSE payment_date
                                END,
                                updated_at = CURRENT_TIMESTAMP
                            WHERE id = $2
                        `, [amountPerMonth, monthId]);

                        // Create payment mapping
                        await client.query(`
                            INSERT INTO payment_installment_mapping (payment_history_id, monthly_installment_id, amount_applied)
                            VALUES ($1, $2, $3)
                        `, [paymentHistoryId, monthId, amountPerMonth]);
                    }
                }

                // Update registration totals
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
                        payment_receipt_no: paymentReceiptNo,
                        warnings: warnings.length > 0 ? warnings : null
                    })
                };

            } else {
                // Legacy payment recording (for backward compatibility)
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
        }

        if (event.httpMethod === 'GET') {
            const receiptNo = event.queryStringParameters?.receipt_no;
            const action = event.queryStringParameters?.action;
            
            if (action === 'monthly_installments') {
                // Get monthly installment status
                const result = await client.query(`
                    SELECT 
                        mi.*,
                        c.name as course_name,
                        c.duration,
                        CASE 
                            WHEN mi.due_date < CURRENT_DATE AND mi.payment_status = 'PENDING' THEN 'OVERDUE'
                            ELSE mi.payment_status
                        END as current_status,
                        CASE 
                            WHEN mi.due_date < CURRENT_DATE AND mi.payment_status = 'PENDING' THEN CURRENT_DATE - mi.due_date
                            ELSE 0
                        END as days_overdue
                    FROM monthly_installments mi
                    JOIN courses c ON mi.course_id = c.id
                    JOIN registrations r ON mi.registration_id = r.id
                    WHERE r.receipt_no = $1
                    ORDER BY c.name, mi.month_number
                `, [receiptNo]);

                // Group by course
                const courseData = {};
                result.rows.forEach(installment => {
                    if (!courseData[installment.course_name]) {
                        courseData[installment.course_name] = {
                            course_id: installment.course_id,
                            course_name: installment.course_name,
                            duration: installment.duration,
                            installments: []
                        };
                    }
                    courseData[installment.course_name].installments.push(installment);
                });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        courses: Object.values(courseData)
                    })
                };
            } else {
                // Get regular payment history
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