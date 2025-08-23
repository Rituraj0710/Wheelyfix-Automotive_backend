const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const connectDB = require('./config/db');
const { connect } = require('./config/db'); 
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const brandRoutes = require('./routes/brandRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const cmsRoutes = require('./routes/cmsRoutes');

dotenv.config();

// connectDB();
connect();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/cms', cmsRoutes);

// Serve static files from the public directory
app.use(express.static('public'));

// Handle 404 errors - Keep this before the error handler
app.use((req, res, next) => {
  res.status(404).json({
    title: "404 - Page Not Found",
    message: "Oops! The page you're looking for doesn't exist.",
    redirectUrl: "/",
    redirectText: "Return to Home"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please stop the other process or set PORT to a different value.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
