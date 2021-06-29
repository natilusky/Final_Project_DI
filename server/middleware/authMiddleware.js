import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import connectDB from '../config/db.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await connectDB
        .select('*')
        //   .except('password')
        .from('userschema')
        .where('user_id', decoded.id)

      next()
    } catch (err) {
      console.error(err)
      res.status(401)
      throw new Error('Not authorized, token faild')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user[0].is_admin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not autorized as an admin')
  }
}

export { protect, admin }
