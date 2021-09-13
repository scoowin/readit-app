const mongoose = require('mongoose');

require('dotenv').config();

const connectionURL = process.env.DB_URL;

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log(connectionURL);
});
