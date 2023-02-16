const { Router } = require('express');
const multer = require('multer');
const routes = Router();
const fs = require('fs');
const path = require('path')
const {
  createProduct,
} = require('../services/GCP/products')
const {
 getSimilarProductsOnGC
} = require('../services/GCP/getSimilarProducts')

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file?.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: multerStorage
})

routes.post('/createProduct', upload.array('file'), async (req, res) => {
  const files = req.files;
  const {
    productId,
    productName,
    productSetId,
  } = req.body;

  const createdProduct = await createProduct(productId, productName, productSetId, files)

  return res.status(200).json(createdProduct)
});

routes.post('/getProducts', upload.single('file'), async (req, res) => {
  const file = req.file;
  const { productSet } = req.body

  const fileBase64String = fs.readFileSync(file?.path, 'base64')
  const products = await getSimilarProductsOnGC(fileBase64String, productSet)

  return res.status(200).json(products)
})

routes.get('/', (req, res) => res.sendStatus(200))

module.exports = routes;