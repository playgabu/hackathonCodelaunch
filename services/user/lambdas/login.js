import Response from '../../../common/response';
import ddb from '../../../common/dynamodb';
import cognito from '../../../common/cognito';
import UserModel from '../../../models/user.class'

const $ENV = process.env.env;
const UserPoolId = process.env.userPoolId;
const ClientId = process.env.clientId;

export const handler = async (event) => {
	let response = new Response()
  let body = JSON.parse(event.body)
	let email = body.email
	let password = body.password

	try {
		let res = await cognito.adminInitiateAuth({
			AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
			UserPoolId: UserPoolId,
			ClientId: ClientId,
			AuthParameters: {
				USERNAME: email,
				PASSWORD: password,
			},
		}).promise()

		response.headers = {
			...response.headers,
			'Set-Cookie': `GabuIdentity=${res.AuthenticationResult.AccessToken}`,
		}
	}
	catch (error) {
		response.statusCode = 500
		response.body = { message: error.message }
	}

	return response.toObject()
}