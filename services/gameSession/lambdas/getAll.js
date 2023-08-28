import Response from '../../../common/response'
import GameSessionModel from '../../../models/gameSession.class'

export const handler = async (event) => {
	let response = new Response()
	let sessions = await GameSessionModel.getAll()
	response.body = sessions
	return response.toObject()
}