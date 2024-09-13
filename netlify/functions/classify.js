const { IncomingForm } = require('formidable');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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
                // Process image with sharp
                const image = await sharp(filePath).metadata();
                
                // Placeholder prediction
                const prediction = `Image dimensions: ${image.width}x${image.height}`;

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ prediction })
                });
            } catch (error) {
                reject({ statusCode: 500, body: JSON.stringify({ error: 'Error processing image' }) });
            }
        });
    });
};
