const vision = require('@google-cloud/vision')

const { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } = process.env

const client = new vision.ProductSearchClient({
  projectId: GOOGLE_PROJECT_ID,
  keyFilename: '/src/config/GCP/ocrtest-377712-efbacfd80a01.json'
});


const createProductSet = async (setId, setName) => {
  const locationPath = client.locationPath(GOOGLE_PROJECT_ID, GOOGLE_LOCATION)

  const [createdProductSet] = await client.createProductSet({
    parent: locationPath,
    productSet: {
      displayName: setName
    },  
    productSetId: setId
  });
  console.log('Conjunto de produtos criado.')
  return createdProductSet
}

module.exports = {
  createProductSet,
  listProductSets,
  deleteProductSet
}