import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: 'localhost',
  endpoint: 'http://localhost:2000',
});

export default ddb;