import Message from '../models/MessageModel.js'
import mongoose from 'mongoose'
import {renameSync, mkdirSync} from 'fs'

export const getMessages = async (req, res) => {
  try {
    const sender = new mongoose.Types.ObjectId(req.userId)
    const recipient = new mongoose.Types.ObjectId(req.query.recipient)

    if (!recipient) {
      return res.status(400).json({ message: 'Recipient is required' });
    }

    const messages = await Message.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({messages});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });
    const date = Date.now()
    let fileDir = 'uploads/files/' + date
    let fileName = 'uploads/files/' + date + req.file.originalname

    mkdirSync(fileDir, {recursive: true})
    renameSync(req.file.path, fileName)

    return res.status(200).json({filePath: fileName});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

