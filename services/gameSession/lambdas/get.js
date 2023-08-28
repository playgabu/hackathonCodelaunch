import Response from '../../../common/response'
import GameSessionModel from '../../../models/gameSession.class'
import ChildModel from '../../../models/child.class'

export const handler = async (event) => {
	let response = new Response()
	let id = event.pathParameters.id
	let session = await GameSessionModel.get(id)

	if (!session) {
		response.statusCode = 404
		response.body = { message: 'Game session not found' }
		return response.toObject()
	}

	let children = []

	if(session.childrenIds && session.childrenIds.length) {
		children = await ChildModel.getAllById(session.childrenIds)
	}

	response.body = {
		...session,
		children
	}
	return response.toObject()
}