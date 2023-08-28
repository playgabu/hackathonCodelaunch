import Response from '../../../common/response';
import cognito from '../../../common/cognito';

const ClientId = process.env.clientId;

export const handler = async (event) => {
	let response = new Response()
  	let body = JSON.parse(event.body)
	let refreshToken = body.refreshToken

	try {

		let authResponse = await cognito.initiateAuth({
			AuthFlow: "REFRESH_TOKEN_AUTH",
			ClientId: ClientId,
			AuthParameters: {
				REFRESH_TOKEN : refreshToken
			  }
		}).promise()

		if (authResponse && authResponse.AuthenticationResult) {
			const { RefreshToken, IdToken } = authResponse.AuthenticationResult;
			response.body = {
			  refreshToken: RefreshToken,
			  accessToken: IdToken
			}

		  } else {
			response.body = {
			  authResponse,
			  accessToken: "",
			  refreshToken: "",
			  message: "No se pudo iniciar sesión"
			}
		  }
	}

	catch (error) {
		response.statusCode = 500
		response.body = { message: error.message }
	}

	return response.toObject()
}