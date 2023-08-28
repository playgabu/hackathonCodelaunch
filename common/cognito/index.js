import AWS from 'aws-sdk';


const cognitoISP = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'us-east-1'
});

export default cognitoISP;
export const CLIENT_ID = process.env.clientId;
export const USER_POOL_ID = process.env.userPoolId;

export async function getCurrentCognitoUser(event) {
	const accessToken = getAccessToken(event)
  const cognitoUser = await cognitoISP.getUser({
    AccessToken: accessToken,
  }).promise()

  return cognitoUser
}

export function getAccessToken(event) {
  let token = event.headers.authorization
  if (!token) return null

  return token.startsWith('Bearer') ? token.split(' ')[1] : token
}