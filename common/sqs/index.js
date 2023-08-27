import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

const sqs = new AWS.SQS();

export default sqs;