import asyncHandler from 'express-async-handler'
import connectDB from '../config/db.js'


//@desc Fetch all products
//@route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
  const products = await connectDB
  .select('*')
  .from('product_schema')
  .where('name','like', `%${keyword}%`)
  res.json(products)
})


//@desc Fetch single products
//@route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await connectDB
    .select('*')
    .from('product_schema')
    .where({ _id: req.params.id })

  if (product[0]) {
    res.json(product[0])
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

//@desc Delete a product
//@route DELETE /api/products/:id
//@access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await connectDB
    .select('*')
    .from('product_schema')
    .where({ _id: req.params.id })

  if (product[0]) {
    await connectDB('product_schema')
      .where('_id', req.params.id)
      .del()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

//@desc Creat a product
//@route POST /api/products
//@access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  let newProduct = {
    name: 'name of product',
    price: 0,
    image: '/images/sample.jpg',
    brand: 'brand',
    category: 'category',
    description: 'description'
  }
  await connectDB('product_schema')
    .returning('*')
    .insert(newProduct)
  res.status(201).json(newProduct)

})

//@desc Update a product
//@route PUT /api/products/:id
//@access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await connectDB
    .select('*')
    .from('product_schema')
    .where({ _id: req.params.id })
  if (product[0]) {
    await connectDB('product_schema')
      .where('_id', req.params.id)
      .update({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        description: req.body.description
      })
      const updatedProduct = await connectDB
      .select('*')
      .from('product_schema')
      .where({ _id: req.params.id })
      console.log();
    res.json(updatedProduct[0])
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

export { getProducts, getProductById, deleteProduct, updateProduct, createProduct }
