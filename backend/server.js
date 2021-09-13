const express = require('express');
const cors = require('cors');
const { application } = require('express');

require('dotenv').config();
const { PORT } = process.env;

const app = express();

app.use(express.json);
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
