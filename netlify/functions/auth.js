const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Generate JWT token (simple version)
function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        userType: user.user_type,
        loginTime: new Date().toISOString()
    };
    
    // In production, use proper JWT with secret key
    return Buffer.from(JSON.stringify(payload)).toString('base64');
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    if (event.httpMethod === 'POST') {
        const client = await pool.connect();
        
        try {
            const { username, password, action = 'login' } = JSON.parse(event.body);
            
            if (action === 'login') {
                // Check if user exists and is active
                const userResult = await client.query(
                    'SELECT id, username, password_hash, user_type, is_active, failed_attempts, locked_until FROM users WHERE username = $1',
                    [username]
                );
                
                if (userResult.rows.length === 0) {
                    return {
                        statusCode: 401,
                        headers,
                        body: JSON.stringify({ error: 'Invalid username or password' })
                    };
                }
                
                const user = userResult.rows[0];
                
                // Check if account is locked
                if (user.locked_until && new Date() < new Date(user.locked_until)) {
                    const lockTime = new Date(user.locked_until).toLocaleTimeString();
                    return {
                        statusCode: 423,
                        headers,
                        body: JSON.stringify({ 
                            error: `Account locked until ${lockTime}. Too many failed attempts.` 
                        })
                    };
                }
                
                // Check if user is active
                if (!user.is_active) {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ error: 'Account is disabled' })
                    };
                }
                
                // Verify password
                const isValidPassword = await bcrypt.compare(password, user.password_hash);
                
                if (!isValidPassword) {
                    // Increment failed attempts
                    const newFailedAttempts = user.failed_attempts + 1;
                    let lockUntil = null;
                    
                    // Lock account after 5 failed attempts for 15 minutes
                    if (newFailedAttempts >= 5) {
                        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                    }
                    
                    await client.query(
                        'UPDATE users SET failed_attempts = $1, locked_until = $2 WHERE id = $3',
                        [newFailedAttempts, lockUntil, user.id]
                    );
                    
                    return {
                        statusCode: 401,
                        headers,
                        body: JSON.stringify({ 
                            error: 'Invalid username or password',
                            attemptsRemaining: Math.max(0, 5 - newFailedAttempts)
                        })
                    };
                }
                
                // Successful login - reset failed attempts and update last login
                await client.query(
                    'UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP WHERE id = $1',
                    [user.id]
                );
                
                // Generate token
                const token = generateToken(user);
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        token: token,
                        user: {
                            id: user.id,
                            username: user.username,
                            userType: user.user_type
                        },
                        message: 'Login successful'
                    })
                };
            }
            
        } catch (error) {
            console.error('Auth error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Authentication service error' })
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
