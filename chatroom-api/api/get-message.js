const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const messagesPath = path.join(process.cwd(), 'api', 'messages.json');
    
    if (!fs.existsSync(messagesPath)) {
      return res.status(200).json([]);
    }

    const data = fs.readFileSync(messagesPath, 'utf8');
    const messages = JSON.parse(data);

    res.status(200).json(messages);

  } catch (error) {
    console.error('Error reading messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
