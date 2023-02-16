const vision = require('@google-cloud/vision');
const moment = require('moment/moment');

const { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } = process.env

const client = new vision.ProductSearchClient({
  projectId: GOOGLE_PROJECT_ID,
  keyFilename: '../../config/GCP/ocrtest-377712-efbacfd80a01.json'
})

const createReferenceImage = async (productId, productImage) => {
  const formattedParent = client.productPath(GOOGLE_PROJECT_ID, GOOGLE_LOCATION, productId);

  const referenceImage = {
    uri: `gs://orc-test/${productImage?.metadata?.name}`
  };

  const request = {
    parent: formattedParent,
    referenceImage: referenceImage,
    referenceImageId: moment.now()
  };

  const [createdReferenceImage] = await client.createReferenceImage(request);
  console.log('Referência de imagem criada.')
  return createdReferenceImage
}

const deleteReferenceImage = async (productId, imageId) => {
  const formattedName = client.referenceImagePath(GOOGLE_PROJECT_ID, GOOGLE_LOCATION, productId, imageId)

  const request = {
    name: formattedName,
  }

  await client.deleteReferenceImage(request)
  return
};

const getReferenceImage = async (productId, referenceImageId) => {
  const formattedName = client.referenceImagePath(GOOGLE_PROJECT_ID, GOOGLE_LOCATION, productId, referenceImageId)

  const response = await client.getReferenceImage({
    name: formattedName
  });
  const uri = response?.[0]?.uri?.split('//')
  return `https://storage.cloud.google.com/${uri[1]}`
}

module.exports = {
  createReferenceImage,
  deleteReferenceImage,
  getReferenceImage
};