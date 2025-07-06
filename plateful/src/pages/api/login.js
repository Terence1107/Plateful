import { query } from "../../utils/postgres";

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { username, password } = req.body;
  
      try {
        const result = await query(
          'SELECT * FROM userdata WHERE username = $1 AND password = $2',
            [username, password]
        );

        // Check if a match is found
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
      }
        
        res.status(200).json({ user: result.rows[0] });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
}