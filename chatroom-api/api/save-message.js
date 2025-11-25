const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, username = 'Anonymous' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messagesPath = path.join(process.cwd(), 'api', 'messages.json');
    
    // Read existing messages
    let messages = [];
    if (fs.existsSync(messagesPath)) {
      const data = fs.readFileSync(messagesPath, 'utf8');
      messages = JSON.parse(data);
    }

    // Add new message
    const newMessage = {
      id: Date.now().toString(),
      username,
      message,
      timestamp: new Date().toISOString()
    };

    messages.push(newMessage);

    // Save to file
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

    res.status(200).json({ 
      success: true, 
      message: 'Message saved successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
