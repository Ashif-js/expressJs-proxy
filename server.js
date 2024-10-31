// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
require('dotenv').config();

const app = express();

// SAP BTP Mobile Services API URL
const btpMobileServicesUrl = "https://ibg-bi-subaccount-cf-dev-com-plt-bi-farms-manager.cfapps.ap11.hana.ondemand.com/SALES_LOGIN";

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Send OK for preflight requests
  }
  next();
});

// Middleware to add authentication token for SAP BTP Mobile Service

// Use the proxy middleware to forward requests to SAP BTP Mobile Services
app.use(
  '/mobile-services-api',  // Add authentication token middleware
  createProxyMiddleware({
    target: btpMobileServicesUrl, // Forward requests to SAP BTP Mobile Services
    changeOrigin: true, // Ensure origin is modified to avoid CORS
    pathRewrite: { '^/mobile-services-api': '' }, // Optionally rewrite the path
    onProxyReq: (proxyReq, req, res) => {
      // Optional logging or request manipulation
      console.log(proxyReq);
    },
  })
);

// Start the server
app.listen(3000, () => {
  console.log('Proxy server running on http://localhost:3000');
});
