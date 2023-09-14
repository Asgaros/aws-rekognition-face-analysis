// The settings.
const settings = {
    AWSAccessKeyID: 'YOURAWSACCESSKEYID',
    AWSSecretAccessKey: 'YOURAWSSECRETACCESSKEY',
    AWSRegion: 'eu-central-1',
    Confidence: 90
}

// Load dependencies.
var FS = require('fs');
var AWS = require('aws-sdk');

// Ensure a path to an image got passed as an argument.
if (process.argv.length < 3) {
    console.log('Please pass the path to the image as an argument.');
    return;
}

// Extract the image path from the passed arguments.
var imagePath = process.argv[2];

// Ensure that the passed image exists.
if (!FS.existsSync(imagePath)) {
    console.log('The passed image does not exist!');
    return;
}

// Set AWS credentials.
var credentials = new AWS.Credentials({
    accessKeyId: settings.AWSAccessKeyID,
    secretAccessKey: settings.AWSSecretAccessKey,
});

AWS.config.credentials = credentials;

// Set region.
AWS.config.update({
    region: settings.AWSRegion
});

// Create AWS Rekognition Client.
const Rekognition = new AWS.Rekognition();

// Set parameters.
const parameters = {
    Attributes: [
        'ALL',
    ],
    Image: {
        Bytes: base64_encode(imagePath),
    },
}

// Analyze faces.
Rekognition.detectFaces(parameters, function(error, response) {
    if (error) {
        console.log(error, error.stack);
    } else {
        let faces = [];

        // Filter detected objects which doesn't have the required confidence value.
        response.FaceDetails.forEach(data => {
            if (data.Confidence >= settings.Confidence) {
                faces.push(data);
            }
        });

        // Check if there are detected faces.
        if (faces.length === 0) {
            console.log('No faces detected!');
            return;
        }

        console.log('Detected Faces:');
        console.log();
        
        response.FaceDetails.forEach(function callback(data, index) {
            console.log('Face #' + (index + 1) + ':');
            console.log('- Gender:          ' + data.Gender.Value + ' (' + format_confidence(data.Gender.Confidence) + '% Confidence)');
            console.log('- Age:             ' + data.AgeRange.Low + '-' + data.AgeRange.High);
            console.log('- Face Occluded:   ' + boolean_to_language(data.FaceOccluded.Value) + ' (' + format_confidence(data.FaceOccluded.Confidence) + '% Confidence)');
            console.log('- Beard:           ' + boolean_to_language(data.Beard.Value) + ' (' + format_confidence(data.Beard.Confidence) + '% Confidence)');
            console.log('- Mustache:        ' + boolean_to_language(data.Mustache.Value) + ' (' + format_confidence(data.Mustache.Confidence) + '% Confidence)');
            console.log('- Eye Glasses:     ' + boolean_to_language(data.Eyeglasses.Value) + ' (' + format_confidence(data.Eyeglasses.Confidence) + '% Confidence)');
            console.log('- Sun Glasses:     ' + boolean_to_language(data.Sunglasses.Value) + ' (' + format_confidence(data.Sunglasses.Confidence) + '% Confidence)');
            console.log('- Eyes Open:       ' + boolean_to_language(data.EyesOpen.Value) + ' (' + format_confidence(data.EyesOpen.Confidence) + '% Confidence)');
            console.log('- Mouth Open:      ' + boolean_to_language(data.MouthOpen.Value) + ' (' + format_confidence(data.MouthOpen.Confidence) + '% Confidence)');
            console.log('- Smile:           ' + boolean_to_language(data.Smile.Value) + ' (' + format_confidence(data.Smile.Confidence) + '% Confidence)');
            console.log('- Emotions:');
            data.Emotions.forEach(emotion => {
                console.log('  - ' + emotion.Type + ' (' + format_confidence(emotion.Confidence) + '% Confidence)');
            });
            console.log();
        });
        
        return;
    }
});

// Function to encode the data of a file to a base64 encoded string.
function base64_encode(file) {
    // Read the binary data.
    var data = FS.readFileSync(file);
    
    // Convert the binary data to a base64 encoded string.
    return Buffer.from(data, 'base64');
}

// Returns Yes/No based on the passed boolean value.
function boolean_to_language(value) {
    return (value) ? 'Yes' : 'No';
}

// Formats a confidence value using two digits after the decimal point.
function format_confidence(confidence) {
    return parseFloat(confidence).toFixed(2);
}
