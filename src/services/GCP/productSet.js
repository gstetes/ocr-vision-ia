const vision = require('@google-cloud/vision')

const client = new vision.ProductSearchClient();

const { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } = process.env

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