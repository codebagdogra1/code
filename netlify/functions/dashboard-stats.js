// netlify/functions/dashboard-stats.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    if (event.httpMethod === 'GET') {
        try {
            const stats = await Promise.all([
                pool.query('SELECT COUNT(*) as total_registrations FROM registrations'),
                pool.query('SELECT COUNT(*) as total_students FROM students'),
                pool.query('SELECT SUM(paid_amount) as total_revenue FROM registrations'),
                pool.query('SELECT SUM(due_amount) as pending_payments FROM registrations WHERE due_amount > 0'),
                pool.query(`
                    SELECT COUNT(*) as registrations_this_month 
                    FROM registrations 
                    WHERE DATE_TRUNC('month', registration_date) = DATE_TRUNC('month', CURRENT_DATE)
                `),
                pool.query(`
                    SELECT c.name, COUNT(cr.id) as enrollment_count
                    FROM courses c
                    LEFT JOIN course_registrations cr ON c.id = cr.course_id
                    GROUP BY c.id, c.name
                    ORDER BY enrollment_count DESC
                    LIMIT 5
                `)
            ]);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    totalRegistrations: parseInt(stats[0].rows[0].total_registrations),
                    totalStudents: parseInt(stats[1].rows[0].total_students),
                    totalRevenue: parseInt(stats[2].rows[0].total_revenue) || 0,
                    pendingPayments: parseInt(stats[3].rows[0].pending_payments) || 0,
                    registrationsThisMonth: parseInt(stats[4].rows[0].registrations_this_month),
                    popularCourses: stats[5].rows
                })
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to fetch dashboard statistics' })
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};