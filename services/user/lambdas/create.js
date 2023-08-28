import Response from '../../../common/response';
import cognito from '../../../common/cognito';
import UserModel from '../../../models/user.class'

const UserPoolId = process.env.userPoolId;
const ClientId = process.env.clientId;

export const handler = async (event) => {
	let response = new Response()
  let body = JSON.parse(event.body)
	let user = new UserModel(body.email, body.fullName, body.phone, body.pin)

	let cognitoUser = null
	let currentUser = null
	try {
		cognitoUser = await cognito.adminGetUser({
			UserPoolId: UserPoolId,
			Username: user.email,
		}).promise()
		currentUser = await UserModel.get(user.email);
	}
	catch (_) {}

	if(cognitoUser && currentUser && currentUser.id) {
		response.statusCode = 400
		response.body = {
			message: 'User already exists',
		}
		return response.toObject()
	}

	try {
		if(!cognitoUser) {
			await cognito.adminCreateUser({
				UserPoolId: UserPoolId,
				Username: user.email,
				MessageAction: 'SUPPRESS',
				TemporaryPassword: body.password,
			}).promise()
		}
		await cognito.adminSetUserPassword({
			UserPoolId: UserPoolId,
			Username: user.email,
			Password: body.password,
			Permanent: true,
		}).promise()
		await cognito.adminUpdateUserAttributes({
			UserPoolId: UserPoolId,
			Username: user.email,
			UserAttributes: [
				{
					Name: 'email_verified',
					Value: 'true',
				}
			]
		}).promise()
		if(!currentUser || !currentUser.id) {
			user = await UserModel.add(user)
		}

		response.body = user
	}
	catch (error) {
		response.statusCode = 400
		response.body = {
			message: error.message,
		}
	}
	return response.toObject()
}