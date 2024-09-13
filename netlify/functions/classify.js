const { IncomingForm } = require('formidable');

exports.handler = async function(event, context) {
    const form = new IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(event, (err, fields, files) => {
            if (err) {
                return reject({ statusCode: 500, body: JSON.stringify({ error: 'Error parsing form' }) });
            }

            // File processing is minimal for this example
            const file = files.file[0];
            const message = file ? `File uploaded: ${file.originalFilename}` : 'No file uploaded';

            resolve({
                statusCode: 200,
                body: JSON.stringify({ message })
            });
        });
    });
};
