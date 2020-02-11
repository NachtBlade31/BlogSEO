const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const blogRoutes = require('./routes/blog');


//app
const app = express()

//DB Connection
connectDB();

//Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())



//cors
if (process.env.NODE_ENV == 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }))
}

//Routes Middleware
app.use('/api', blogRoutes);

//Port

const port = process.env.PORT || 5000
app.listen(port, () => { console.log(`Server is running on ${port}`) })