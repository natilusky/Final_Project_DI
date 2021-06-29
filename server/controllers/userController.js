import asyncHandler from 'express-async-handler'
import connectDB from '../config/db.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

//@desc Auto user & get token
//@route POST /api/users/login
const authUser = asyncHandler(async (req, res) => {
  console.log('Login page');
  const user = await connectDB
    .select('user_id', 'username', 'email', 'is_admin', 'password')
    .from('userschema')
    .where({ email: req.body.email })
  const userLogin = { user }.user[0]
  if (userLogin && bcrypt.compareSync(req.body.password, userLogin.password)) {
    userLogin['token'] = generateToken(userLogin.user_id)
    res.send(userLogin)
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@desc Get user profile
//@route GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user[0]
  if (user) {
    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


//@desc Update user profile
//@route PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = req.user[0]
  if (user) {
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updateUser = await connectDB('userschema')
      .returning('*')
      .insert(user)
    //ypdate to database
    res.json({
      user_id: updateUser.user_id,
      username: updateUser.username,
      email: updateUser.email,
      is_admin: updateUser.is_admin,
      token: generateToken(updateUser.user_id)
    })


  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc Update all users
//@route GET /api/users
//@access Privat/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await connectDB
    .select('*')
    .from('userschema')
  res.json(users)
})

//@desc Delete user
//@route DELETE /api/users/:id
//@access Privat/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await connectDB
    .select('*')
    .from('userschema')
    .where('user_id', req.params.id)
  if (user) {
    await connectDB('userschema')
      .where('user_id', req.params.id)
      .del()
    res.json({ message: 'User removed' })


  } else {
    throw new Error('User not found')
  }
})

//@desc Register a new user
//@route POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  console.log('-> Register attempt: ' + req.body.username)
  await connectDB
    .select('username')
    .from('userschema')
    .where('username', req.body.username)
    .then((data) => {
      if (data.length == 0) {
        let newuser = {
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 10),
          email: req.body.email,
          is_admin: req.body.admin,
        }
        connectDB('userschema')
          .returning('*')
          .insert(newuser)
          .then((data) => {
            res.status(201).json({
              user_id: newuser.username,
              email: newuser.email,
              is_admin: newuser.is_admin,
            })
          })
      } else {
        res.status(400)
        throw new Error(`${req.body.username} already registered`)
      }
    })
})


//@desc Get user by ID
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await connectDB
    .select('*')
    .from('userschema')
    .where('user_id', req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const [user] = await connectDB
    .select('*')
    .from('userschema')
    .where('user_id', req.params.id)
  if (user) {
    await connectDB('userschema')
      .where('user_id', req.params.id)
      .update({
        username: req.body.username || user.username,
        email: req.body.email || user.email,
        is_admin: req.body.is_admin || user.is_admin
      })
    const [userAfterUpdate] = await connectDB
      .select('*')
      .from('userschema')
      .where('user_id', req.params.id)
    res.json({
      user_id: userAfterUpdate.user_id,
      username: userAfterUpdate.username,
      email: userAfterUpdate.email,
      is_admin: userAfterUpdate.is_admin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }
