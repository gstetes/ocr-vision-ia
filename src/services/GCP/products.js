const vision = require('@google-cloud/vision')
const { Storage } = require('@google-cloud/storage')
const { createReferenceImage } = require('./referenceImages')

const client = new vision.ProductSearchClient({
  keyFilename: '../../config/GCP/ocrtest-377712-ab1969f71f37.json'
});
const storage = new Storage();

const { GOOGLE_LOCATION, GOOGLE_PROJECT_ID } = process.env;

const createProduct = async (productId, productName, productSetId, files) => {
  const locationPath = client.locationPath(GOOGLE_PROJECT_ID, GOOGLE_LOCATION);

  try {
    const [createdProduct] = await client.createProduct({
      parent: locationPath,
      product: {
        displayName: productName,
        productCategory: 'packagedgoods-v1'
      },
      productId: productId
    });
    console.log('Produto criado.')

    await addProductToProductSet(productId, productSetId)

    let uploadedImages = []
    let imageReferences = []

    for (const file of files) {
      const [uploadedImage] = await uploadImageToGC(file)
      const createdImageReference = await createReferenceImage(productId, uploadedImage)

      uploadedImages.push(uploadedImage)
      imageReferences.push(createdImageReference)
    }

    return {
      product: createdProduct,
      image: uploadedImages,
      referenceImage: imageReferences
    }
  } catch (error) {
    console.log(error)
    throw new Error('Erro ao criar produto')
  }
}


const addProductToProductSet = async (productId, productSetId) => {
  const productPath = client.productPath(GOOGLE_PROJECT_ID, GOOGLE_LOCATION, productId);
  const productSetPath = client.productSetPath(GOOGLE_PROJECT_ID, GOOGLE_LOCATION, productSetId)

  const request = {
    name: productSetPath,
    product: productPath,
  }

  try {
    await client.addProductToProductSet(request);
    console.log('Produto adicionado ao conjunto.')
    return
  } catch (error) {
    console.log(error)
  }
}

const uploadImageToGC = async (file) => {
  const uploadedFile = await storage.bucket('orc-test').upload(file?.path)
  console.log('Upload de imagem concluido.')
  return uploadedFile
}

module.exports = {
  createProduct,
}