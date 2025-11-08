import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import statsRouter from './routes/stats';
import invoicesRouter from './routes/invoices';
import vendorsRouter from './routes/vendors';
import trendsRouter from './routes/trends';
import categoryRouter from './routes/category';
import cashflowRouter from './routes/cashflow';
import chatRouter from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Invoice Analytics API',
    version: '1.0.0',
    endpoints: {
      stats: '/api/stats',
      invoices: '/api/invoices',
      vendors: '/api/vendors',
      trends: '/api/invoice-trends',
      categorySpend: '/api/category-spend',
      cashOutflow: '/api/cash-outflow',
      chat: '/api/chat-with-data'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/stats', statsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/invoice-trends', trendsRouter);
app.use('/api/category-spend', categoryRouter);
app.use('/api/cash-outflow', cashflowRouter);
app.use('/api/chat-with-data', chatRouter);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});
