import { query } from "../../utils/postgres";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const result = await query(`
                SELECT 
                    gs.store_id, 
                    gs.location_x as store_location_x, 
                    gs.location_y as store_location_y,
                    fb.bank_id, 
                    fb.location_x as bank_location_x, 
                    fb.location_y as bank_location_y,
                    p.predicted_weight
                FROM predictions p
                JOIN grocery_stores gs ON p.store_id = gs.store_id
                JOIN food_banks fb ON p.bank_id = fb.bank_id
                ORDER BY p.predicted_weight DESC
            `);
            
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
} 