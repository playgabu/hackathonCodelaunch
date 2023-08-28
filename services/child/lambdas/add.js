import Response from '../../../common/response'
import * as cognito from '../../../common/cognito'
import ChildModel from '../../../models/child.class'
import UserModel from '../../../models/user.class'

export const handler = async (event) => {
	let response = new Response()
  let body = JSON.parse(event.body)

	const cognitoUser = await cognito.getCurrentCognitoUser(event)
	if(!cognitoUser) {
		response.statusCode = 401
		response.body = {
			message: 'Unauthorized',
		}
		return response.toObject()
	}

	let user = await UserModel.getByEmail(cognitoUser.UserAttributes.find(x => x.Name === 'email').Value)
	let child = new ChildModel(user.id, body.username, body.birthDate, body.genre, body.favoriteGames, body.avatar)

	try {
		child = await ChildModel.add(child)
		response.body = child
	}
	catch (error) {
		response.statusCode = 400
		response.body = {
			message: error.message,
		}
	}

	return response.toObject()
}