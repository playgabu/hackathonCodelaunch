import Response from '../../../common/response'
import UserModel from '../../../models/user.class'
import ChildModel from '../../../models/child.class'
import SessionChildModel from '../../../models/sessionChild.class'
import * as cognito from '../../../common/cognito'

export const handler = async (event) => {
	let response = new Response()
	const cognitoUser = await cognito.getCurrentCognitoUser(event)

	const user = await UserModel.getByEmail(cognitoUser.UserAttributes.find(attr => attr.Name === 'email').Value)

	if(!user.id) {
		response.statusCode = 404
		response.body = {
			message: 'User not found',
		}
	}

	const children = await ChildModel.getAllByUserId(user.id)

	response.body = {
		...user,
		children,
	}
	return response.toObject()
}