const { createCanvas, loadImage } = require('canvas'); // Make sure to use 'canvas' for image handling

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const formData = new URLSearchParams(event.body);
    const imageFile = formData.get('file');

    if (!imageFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file uploaded' })
      };
    }

    const imageBuffer = Buffer.from(imageFile.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const image = await loadImage(imageBuffer);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Perform prediction here
    // const prediction = await predict(canvas); // Add your prediction logic here

    return {
      statusCode: 200,
      body: JSON.stringify({ prediction: 'example prediction' }) // Replace with actual prediction
    };
  } catch (error) {
    console.error('Error during prediction:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
