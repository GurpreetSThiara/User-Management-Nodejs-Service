import express from 'express';
import connectDb from './config/db';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';
import connectionRoutes from './routes/connections';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import notificationRoutes from './routes/notifications';
import dotenv from 'dotenv';
import modelRoutes from './routes/modelRoutes';
import crudModelRecordRoutes from './routes/crudModelRecordRoutes'

dotenv.config();
connectDb();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/connections', connectionRoutes);


app.use('/api/v1/models', modelRoutes);
app.use('/api/v1/records', crudModelRecordRoutes);

// app.use('/api/notifications', notificationRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT ?? 3000;
// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');

// });

app.use('/',(req,res)=>{
  res.status(200).send({"success":true,"message":"Server is working"})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});