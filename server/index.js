import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js'
import contactRoutes from './routes/ContactRoutes.js'
import setupSocket from './socket.js'
import messagesRoutes from './routes/MessagesRoutes.js'
import channelRoutes from './routes/ChannelRoutes.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5055;
const databaseUrl = process.env.DATABASE_URL

app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use('/uploads/files', express.static('uploads/files'));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/channels', channelRoutes);

const server = app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
})

setupSocket(server)

mongoose
  .connect(databaseUrl)
  .then(() => console.log(`Connected to database successfully!`))
  .catch(console.error);

