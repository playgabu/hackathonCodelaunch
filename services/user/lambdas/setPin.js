import Response from '../../../common/response'
import UserModel from '../../../models/user.class'
import * as cognito from '../../../common/cognito'

export const handler = async (event) => {
	let response = new Response()
	let body = JSON.parse(event.body)

	console.log(body)

	const cognitoUser = await cognito.getCurrentCognitoUser(event)
	const user = await UserModel.getByEmail(cognitoUser.UserAttributes.find(attr => attr.Name === 'email').Value)
	if(!user.id) {
		response.statusCode = 404
		response.body = {
			message: 'User not found',
		}
	}

	const newUser = new UserModel(user.email, user.fullName, user.phone, body.pin)
	await UserModel.update(newUser)

	response.body = user
	return response.toObject()
}