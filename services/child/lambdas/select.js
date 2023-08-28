import Response from '../../../common/response';
import * as cognito from '../../../common/cognito';
import ChildModel from '../../../models/child.class'
import SessionChildModel from '../../../models/sessionChild.class'

export const handler = async (event) => {
	let response = new Response()
	const childId = event.pathParameters.childId
	const accessToken = cognito.getAccessToken(event)
	const child = await ChildModel.get(childId)

	if (!child.id) {
		response.statusCode = 404
		response.body = {
			message: 'Child not found',
		}
		return response.toObject()
	}

	try {
		await SessionChildModel.add(new SessionChildModel(accessToken, childId))
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