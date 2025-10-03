// Vercel Serverless Function for Saving Portfolio Data
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
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
        // Verify admin session (simplified token check)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized - No token provided' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        // In production, you'd verify JWT token properly
        // For now, just check if token exists and is valid format
        try {
            const decoded = Buffer.from(token, 'base64').toString();
            if (!decoded.startsWith('admin:')) {
                throw new Error('Invalid token format');
            }
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        const { portfolioData } = req.body;
        
        if (!portfolioData) {
            return res.status(400).json({ 
                success: false, 
                message: 'Portfolio data is required' 
            });
        }
        
        // In a real application, you'd save to a database
        // For now, we'll use environment variables or a simple storage solution
        // Since Vercel functions are stateless, we'll use a simple file approach
        // Note: In production, use a proper database like MongoDB, PostgreSQL, etc.
        
        const dataToSave = {
            timestamp: Date.now(),
            data: portfolioData,
            lastModified: new Date().toISOString()
        };
        
        // Store in Vercel KV or simple JSON approach
        // For now, we'll return the data so frontend can handle persistence
        return res.status(200).json({ 
            success: true, 
            message: 'Portfolio data processed successfully',
            timestamp: dataToSave.timestamp,
            savedData: dataToSave
        });
        
    } catch (error) {
        console.error('Save portfolio error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while saving data' 
        });
    }
}
