const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser")
const PORT = 5000 || process.env.PORT;
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
connectDB();

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', require('./routes/users'));
app.use('/api/docs', require('./routes/docs'));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}...`);
})