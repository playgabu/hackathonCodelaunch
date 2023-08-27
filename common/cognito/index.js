import { CognitoIdentityServiceProvider } from 'aws-sdk';


const cognitoISP = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'us-east-1'
});

export default cognitoISP;
export const CLIENT_ID = process.env.clientId;
export const USER_POOL_ID = process.env.userPoolId;