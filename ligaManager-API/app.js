const express = require('express');
const cors = require('cors');
const ligaManagerRoutes = require('./src/routes/ligaManager.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', ligaManagerRoutes);

module.exports = app;