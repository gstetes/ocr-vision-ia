const path = require('path')
const { getReferenceImage } = require('./referenceImages')
const vision = require('@google-cloud/vision');

const { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } = process.env;

const productSearchClient = new vision.ProductSearchClient({
  projectId: GOOGLE_PROJECT_ID,
  keyFilename: path.join(__dirname, '../', '../', 'config', 'GCP', 'ocrtest-377712-efbacfd80a01.json')
});
const imageAnnotatorClient = new vision.ImageAnnotatorClient({
  projectId: GOOGLE_PROJECT_ID,
  keyFilename: path.join(__dirname, '../', '../', 'config', 'GCP', 'ocrtest-377712-efbacfd80a01.json')
});

const getSimilarProductsOnGC = async (file, productSet) => {
  const productSetPath = productSearchClient.productSetPath(GOOGLE_PROJECT_ID, GOOGLE_LOCATION, productSet)

  const request = {
    image: {
      content: file
    },
    features: [
      { type: 'PRODUCT_SEARCH' },
    ],
    imageContext: {
      productSearchParams: {
        productSet: productSetPath,
        productCategories: ['packagedgoods-v1'],
        filter: ''
      },
    }
  }

  const [response] = await imageAnnotatorClient.batchAnnotateImages({
    requests: [request]
  })

  const products = response?.['responses']?.[0]?.productSearchResults?.results?.map(product => {
    if (product?.score > 0.30) {
      return product
    }
  }).filter(p => p)

  let newData = []

  if (products?.length) {
    newData = await Promise.all(products?.map(async product => {
      const productName = String(product?.product?.name)?.split('/')
      const productId = productName[productName?.length - 1]
  
      const image = String(product?.image)?.split('/')
      const imageId = image[image?.length - 1]
  
      return {
        ...product,
        image: await getReferenceImage(productId, imageId)
      }
    }))
  }

  return newData || []
}

module.exports = {
  getSimilarProductsOnGC
}