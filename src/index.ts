import express from 'express';
import connectDb from './config/db';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import connectionRoutes from './routes/connections';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import notificationRoutes from './routes/notifications';
import dotenv from 'dotenv';

dotenv.config();
connectDb();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
// app.use('/api/notifications', notificationRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;
// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');

// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});