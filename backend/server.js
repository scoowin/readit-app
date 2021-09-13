const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { PORT } = process.env;

const app = express();

require('./src/config/db');
require('./src/models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const routes = require('./src/routes');
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
