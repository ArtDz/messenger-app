import User from '../models/UserModel.js'
import mongoose from 'mongoose'
import Message from '../models/MessageModel.js'

export const searchContacts = async (req, res) => {
  try {
    const {searchTerm} = req.query;
    if (!searchTerm || typeof searchTerm !== 'string') {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const regex = new RegExp(searchTerm, 'i');

    const contacts = await User.find({
      _id: { $ne: req.userId }, // исключаем текущего пользователя
      $or: [
        { firstName: regex },
        { email: regex },
      ],
    }).select('-password'); // не возвращаем пароль

    return res.status(200).json({contacts});
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getContactsForDMList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId)
    console.log({userId})

    /*
    * Функция возвращает список пользователей, с которыми у текущего пользователя (req.userId) был чат,
    *, отсортированный по времени последнего сообщения (как список «личных чатов» в мессенджере).
    * */

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId },
          ],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', userId] },
              then: '$recipient',
              else: '$sender',
            },
          },
          lastMessageTime: {
            $first: '$timestamp',
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contactInfo',
        }
      },
      {
        $unwind: '$contactInfo'
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: '$contactInfo.email',
          firstName: '$contactInfo.firstName',
          image: '$contactInfo.image',
          color: '$contactInfo.color',
        }
      },
      {
        $sort: { lastMessageTime: -1 },
      }
    ])

    return res.status(200).json({contacts});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


export const getAllContacts = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }, 'firstName email _id')
    const contacts = users.map(user => ({
      label: user.firstName ? user.firstName : user.email,
      value: user._id,
    }))

    return res.status(200).json({contacts});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
