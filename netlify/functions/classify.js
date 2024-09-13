const { IncomingForm } = require('formidable');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
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
                const filePath = file.filepath;
                const buffer = fs.readFileSync(filePath);
                const image = tf.node.decodeImage(buffer);

                const model = await mobilenet.load();
                const predictions = await model.classify(image);

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ predictions })
                });
            } catch (error) {
                reject({ statusCode: 500, body: JSON.stringify({ error: 'Error processing image' }) });
            }
        });
    });
};
