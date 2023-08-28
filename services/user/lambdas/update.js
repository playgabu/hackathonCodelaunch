import Response from '../../../common/response';
import ddb from '../../../common/dynamodb';
import cognito from '../../../common/cognito';
import UserModel from '../../../models/user.class'

const $ENV = process.env.env;
const UserPoolId = process.env.userPoolId;
const ClientId = process.env.clientId;

export const handler = async (event) => {
	let response = new Response()

	// Get AccessToken from cookies
	let accessToken = event.headers.cookie
		.split(';')
		.map((pair) => pair.split('='))
		.find(x => x[0].trim() === 'GabuIdentity')[1]
	
	let cognitoUser = await cognito.getUser({
			AccessToken: accessToken,
		}).promise()


	if(!cognitoUser) {
		response.statusCode = 401
		response.body = {
			message: 'Unauthorized',
		}
		return response.toObject()
	}

	let currentUser = await UserModel.getByEmail(cognitoUser.UserAttributes.find(x => x.Name === 'email').Value)
  let body = JSON.parse(event.body)
	let newUser = new UserModel(body.email, body.fullName, body.phone)

	newUser.id = currentUser.id

	try {
		await cognito.adminUpdateUserAttributes({
				UserPoolId: UserPoolId,
				Username: currentUser.email,
				UserAttributes: [
					{
						Name: 'email',
						Value: newUser.email,
					},
				],
			}).promise()
		await UserModel.update(newUser)
		response.body = newUser
	}
	catch (error) {
		response.statusCode = 400
		response.body = {
			message: error.message,
		}
	}
	return response.toObject()
}