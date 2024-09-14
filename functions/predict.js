const { createCanvas, loadImage } = require('canvas'); // Ensure 'canvas' is properly installed

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse form data
    const formData = new URLSearchParams(event.body);
    const imageFile = formData.get('file');
    
    if (!imageFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file uploaded' })
      };
    }

    // Decode base64 image data
    const imageBuffer = Buffer.from(imageFile.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const image = await loadImage(imageBuffer);

    // Create a canvas and draw the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Placeholder for your prediction logic
    const prediction = 'example prediction'; // Replace with actual prediction logic

    return {
      statusCode: 200,
      body: JSON.stringify({ prediction })
    };
  } catch (error) {
    console.error('Error during prediction:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
