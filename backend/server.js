const express = require('express');
const cors = require('cors');

//Make variables inside .env file accessible as process.env.{VARIABLE_NAME}
require('dotenv').config();
const { PORT } = process.env;

const app = express();

//Open global connection to database and setup models
require('./src/config/db');
require('./src/models');

//For enabling usage of POST data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Required for allowing calls to be made from other sources ie React frontend
app.use(cors());

//Add routes
const routes = require('./src/routes');
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
