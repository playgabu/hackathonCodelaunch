import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

const s3Client = new AWS.S3({
  apiVersion: '2006-03-01',
  
  signatureVersion: 'v4',
});

export default s3Client;