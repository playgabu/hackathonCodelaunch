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
	let user = new UserModel(body.email, body.fullName, body.phone, body.pin)

	try {
		await cognito.signUp({
				ClientId: ClientId,
				Username: user.email,
				Password: body.password,
			}).promise()
		await cognito.adminConfirmSignUp({
				UserPoolId: UserPoolId,
				Username: user.email,
			}).promise()
		user = await UserModel.add(user)

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