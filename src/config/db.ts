// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { loadAllModels } from '../utils/loadModels';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI?? '', {
      dbName: 'peoples',
    });
    console.log('MongoDB connected to database "peoples"');
  await loadAllModels();

    console.log("models loaded")


    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to the database.');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from the database.');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};


// const gracefulShutdown = () => {
//   mongoose.connection.close(() => {
//     console.log('Mongoose disconnected through app termination.');
//     process.exit(0);
//   });
// };

// process.on('SIGINT', gracefulShutdown).on('SIGTERM', gracefulShutdown);

export default connectDB;
