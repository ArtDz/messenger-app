import User from '../models/UserModel.js'
import Channel from '../models/ChannelModel.js'
import mongoose from 'mongoose'

export const createChannel = async function (req, res, next) {
  try {
    const {name, members} = req.body
    const userId = req.userId

    const admin = await User.findById(userId)
    if (!admin) return res.status(404).json({message: 'User not found'});

    const validMembers = await User.find({_id: {$in: members}})
    if (validMembers.length !== members.length) return res.status(400).json({message: 'Some users are not valid'})

    const newChannel = await Channel.create({name, members, admin: userId})

    return res.status(201).json({ channel: newChannel })
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}

export const getUserChannels = async function (req, res, next) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId)

    const channels = await Channel.find({
      $or: [{admin: userId}, {members: userId}],
    }).sort({updatedAt: -1})

    return res.status(201).json({ channels })
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}

export const getChannelMessages = async function (req, res, next) {
  try {
    const channelId = req.query.channelId
    const channel = await Channel.findById(channelId).populate({
      path:'messages',
      populate: {path: 'sender', select: 'firstName email _id image color'}
    })

    if (!channel) return res.status(400).json({message: 'Channel not found'})

    const messages = channel.messages
    return res.status(200).json({messages})
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}

