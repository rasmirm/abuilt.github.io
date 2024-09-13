const { IncomingForm } = require('formidable');
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

exports.handler = async function(event, context) {
    const form = new IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(event, async (err, fields, files) => {
            if (err) {
                return reject({ statusCode: 500, body: JSON.stringify({ error: 'Error parsing form' }) });
            }

            const file = files.file[0];
            try {
                const fileContent = await readFile(file.filepath);
                // Process the PDF content here
                resolve({ statusCode: 200, body: JSON.stringify({ message: 'File processed successfully' }) });
            } catch (error) {
                reject({ statusCode: 500, body: JSON.stringify({ error: 'Error reading file' }) });
            }
        });
    });
};
