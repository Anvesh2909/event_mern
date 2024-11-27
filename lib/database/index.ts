import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGO_URL;
if (!MONGODB_URL) {
  throw new Error('MONGO_URL is missing from environment variables');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log('Reusing cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    // @ts-ignore
    cached.promise = mongoose.connect(process.env.MONGO_URL, {
      dbName: 'evently', // Ensure the correct database name
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
