import Response from '../../../common/response'
import GameSessionModel from '../../../models/gameSession.class'
import SessionChild from '../../../models/sessionChild.class'
import ChildModel from '../../../models/child.class'
import * as Cognito from '../../../common/cognito'

export const handler = async (event) => {
	let response = new Response()

	const accessToken = Cognito.getAccessToken(event);
	if (!accessToken) {
		response.statusCode = 401
		response.body = { message: 'Unauthorized' }
		return response.toObject()
	}

	const sessionChild = await SessionChild.getByAccessToken(accessToken)
	if (!sessionChild) {
		response.statusCode = 404
		response.body = { message: 'Child not found' }
		return response.toObject()
	}
	
	await GameSessionModel.removeChild(event.pathParameters.id, sessionChild.childId)
	await ChildModel.setGameSession(sessionChild.childId, null)

	return response.toObject()
}