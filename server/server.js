import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/errorMiddlware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'))
// }

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)


const getUsers = () => {
  return connectDB.select('*').from('userschema')
}
app.get('/getUsers', (req, res) => {
  getUsers()
    .then((users) => {
      res.send(users)
    })
    .catch((e) => {
      res.send({ message: e })
    })
})

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
