import cognito from '../../../common/cognito';
import Response from '../../../common/response';

const UserPoolId = process.env.userPoolId;
const ClientId = process.env.clientId;

export const request = async (event) => {
	let response = new Response()
  let body = JSON.parse(event.body)
	
	try {
		await cognito.forgotPassword({
			ClientId: ClientId,
			Username: body.email,
		}).promise()
	}
	catch (error) {
		response.statusCode = 500
		response.body = { message: error.message }
	}
	
	return response.toObject()
}

export const reset = async (event) => {
	let response = new Response()
	let body = JSON.parse(event.body)
	
	try {
		await cognito.confirmForgotPassword({
			ClientId: ClientId,
			Username: body.email,
			ConfirmationCode: body.code,
			Password: body.password,
		}).promise()
	}
	catch (error) {
		response.statusCode = 500
		response.body = { message: error.message }
	}
	
	return response.toObject()
}