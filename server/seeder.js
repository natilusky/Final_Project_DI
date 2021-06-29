import products from './data/products.js'
import connectDB from './config/db.js'
import users from './data/users.js'

async function DeleteAllAndInsert() {
  try {
    await connectDB('product_schema')
      .del()
      .then(function () {
        return connectDB('product_schema').insert(products)
      })
      await connectDB('userschema')
      .del()
      .then(function () {
        return connectDB('userschema').insert(users)
      })
      console.log('Data Imported!!!');
    connectDB.destroy()
    process.exit()
  } catch (err) {
    console.log(`${err}`)
    process.exit(1)
  }
}


async function DeleteTables() {
  await connectDB('userschema').del()
  await connectDB('product_schema').del()
  console.log('Data Delete!!!');
  connectDB.destroy()
  process.exit()
}

if (process.argv[2] === '-d') {
  DeleteTables()
} else {
  DeleteAllAndInsert()
}
