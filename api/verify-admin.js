// Vercel Serverless Function for Admin Authentication
export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { password } = req.body;
        
        // Get admin password from environment variables
        const adminPassword = process.env.ADMIN_PASSWORD || 'portfolio2024';
        
        // Verify password
        if (password === adminPassword) {
            // Generate a simple session token (in production, use JWT)
            const sessionToken = Buffer.from(`admin:${Date.now()}`).toString('base64');
            
            return res.status(200).json({ 
                success: true, 
                message: 'Authentication successful',
                token: sessionToken
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password' 
            });
        }
    } catch (error) {
        console.error('Admin auth error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
}
