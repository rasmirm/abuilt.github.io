const { IncomingForm } = require('formidable');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const { Image } = require('image-js');
const mobilenet = require('@tensorflow-models/mobilenet');

exports.handler = async function(event, context) {
    const form = new IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(event, async (err, fields, files) => {
            if (err) {
                return reject({ statusCode: 500, body: JSON.stringify({ error: 'Error parsing form' }) });
            }

            const file = files.file[0];
            try {
                const fileContent = fs.readFileSync(file.filepath);
                const img = await Image.load(fileContent);
                const model = await mobilenet.load();

                // Convert image to Tensor
                const tensor = tf.browser.fromPixels(img.toCanvas());
                
                // Perform classification
                const predictions = await model.classify(tensor);

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ predictions })
                });
            } catch (error) {
                reject({ statusCode: 500, body: JSON.stringify({ error: 'Error processing file' }) });
            }
        });
    });
};
