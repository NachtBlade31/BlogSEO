const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const blogRoutes = require('./routes/blog');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const formRoutes = require('./routes/form');

//app
const app = express()

//cors
// if (process.env.NODE_ENV == 'development') {
//     app.use(cors({ origin: `${process.env.CLIENT_URL}` }))
// }

app.use(cors())

//DB Connection
connectDB();

//Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())




//Routes Middleware
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', formRoutes);
//Port

const port = process.env.PORT || 5000
app.listen(port, () => { console.log(`Server is running on ${port}`) })