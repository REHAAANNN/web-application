import express from 'express';

const app = express();
const PORT = 3001;

app.get('/test', (req, res) => {
  res.json({ message: 'Simple test works!' });
});

const server = app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep process alive
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close();
  process.exit(0);
});
