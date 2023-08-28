import Response from '../../../common/response'
import ChildModel from '../../../models/child.class'
import SessionChildModel from '../../../models/sessionChild.class'
import * as cognito from '../../../common/cognito'

export const handler = async (event) => {
	let response = new Response()
	const accessToken = cognito.getAccessToken(event)

	let sessionChild = await SessionChildModel.getByAccessToken(accessToken)

	if(!sessionChild.accessToken) {
		response.statusCode = 401
		response.body = {
			message: 'Unauthorized',
		}
		return response.toObject()
	}

	let child = await ChildModel.get(sessionChild.childId)
	if(!child.id) {
		response.statusCode = 404
		response.body = {
			message: 'Child not found',
		}
		return response.toObject()
	}

	response.body = child
	return response.toObject()
}