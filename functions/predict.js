const tf = require('@tensorflow/tfjs-node');
const jpeg = require('jpeg-js');

async function loadModel() {
  // Load a pre-trained model (for example, a MobileNet model)
  const model = await tf.loadLayersModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
  );
  return model;
}

function decodeImage(base64Image) {
  const imageBuffer = Buffer.from(base64Image, 'base64');
  const pixels = jpeg.decode(imageBuffer, true);
  const { width, height, data } = pixels;
  const numChannels = 3; // RGB
  const numPixels = width * height;
  const values = new Float32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let c = 0; c < numChannels; c++) {
      values[i * numChannels + c] = data[i * 4 + c] / 255;
    }
  }
  return tf.tensor3d(values, [height, width, numChannels]);
}

exports.handler = async function (event, context) {
  const { image } = JSON.parse(event.body);

  try {
    const base64Image = image.split(';base64,').pop();
    const imgTensor = decodeImage(base64Image);

    const model = await loadModel();

    const prediction = model.predict(imgTensor.expandDims(0));
    const predictionData = prediction.dataSync();

    return {
      statusCode: 200,
      body: JSON.stringify({ prediction: predictionData }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Prediction failed', details: error.message }),
    };
  }
};
