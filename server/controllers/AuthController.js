import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import {compare} from 'bcrypt'
import {getUserData} from '../utils/getUserData.js'
import {renameSync, unlinkSync} from 'fs'

const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (email, userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return jwt.sign({email, userId}, secret);
};

export const signup = async function (req, res, next) {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and Password are required');
    }
    const user = await User.create({email, password})
    res.cookie('jwt', createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: 'none',
    })

    console.log('User Created!')

    return res.status(201).json({
      user: {
        email: user.email,
        id: user.id,
        profileSetup: user.profileSetup,
      }
    })
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}

export const login = async function (req, res, next) {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and Password are required');
    }

    const user = await User.findOne({email})
    if (!user) return res.status(404).send('User not found');

    const auth = await compare(password, user.password)
    if (!auth) return res.status(400).send('Invalid credentials');

    res.cookie('jwt', createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: 'none',
    })

    res.status(200).json({ user: getUserData(user) })
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}

export const getUserInfo = async function (req, res, next) {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({message: 'User not found'});
    res.status(200).json({ user: getUserData(user) })
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}

const colors = [0,1,2,3]

export const updateProfile = async function (req, res, next) {
  try {
    const {firstName, color} = req.body
    if (!firstName || !colors.includes(color)) return res.status(400).send('First name and color are required');

    const user = await User.findByIdAndUpdate(
      req.userId,
      {firstName, color, profileSetup: true},
      {new: true, runValidators: true}
    )

    res.status(200).json({ user: getUserData(user) })
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }

}

export const addProfileImage = async function (req, res, next) {
  try {
    if (!req.file) return res.status(400).send('Image is required');
    let fileName = 'uploads/profiles/' + Date.now() + req.file.originalname

    renameSync(req.file.path, fileName)

    const user = await User.findByIdAndUpdate(
      req.userId,
      {image: fileName},
    {new: true, runValidators: true}
    )

    res.status(200).json({ user: getUserData(user) })
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}

export const removeProfileImage = async function (req, res, next) {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({message: 'User not found'});
    console.log({user})

    if (user.image) unlinkSync(user.image)

    user.image = null
    await user.save()


    return res.status(200).send('Image removed successfully!')
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}

export const logout = async function (req, res, next) {
  try {
    res.clearCookie('jwt', {
      secure: true,
      sameSite: 'none',
    });
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).send('Bad Internal Server Error');
  }
}
