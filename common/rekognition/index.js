import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

const rekognition = new AWS.Rekognition({
    apiVersion: '2016-06-27',
});

export default rekognition;