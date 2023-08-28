import Response from '../../../common/response';
import ddb from '../../../common/dynamodb';
import cognito from '../../../common/cognito';
import UserModel from '../../../models/user.class'

const $ENV = process.env.env;
const UserPoolId = process.env.userPoolId;
const ClientId = process.env.clientId;

export const handler = async (event) => {
	let response = new Response()
  	let body = JSON.parse(event.body)
	let email = body.email
	let password = body.password

	try {
		let userData = UserModel.getByEmail(email)
		let authResponse = await cognito.initiateAuth({
			AuthFlow: "USER_PASSWORD_AUTH",
			ClientId: ClientId,
			AuthParameters: {
				USERNAME: email,
				PASSWORD: password
			}
		}).promise()

		if (authResponse && authResponse.AuthenticationResult) {
			const { RefreshToken, AccessToken } = authResponse.AuthenticationResult;
			response.body = {
			  refreshToken: RefreshToken,
			  accessToken: AccessToken,
			  id: userData.id
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