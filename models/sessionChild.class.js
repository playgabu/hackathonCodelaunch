import ddb from '../common/dynamodb'

const $ENV = process.env.env;
export default class SessionChildModel {
	/**
	 * @param {string} accessToken
	 * @param {string} childId
	 */
	constructor(accessToken, childId) {
		this.accessToken = accessToken
		this.childId = childId
	}

	validate() {
		const stringRequiredFields = ['accessToken', 'childId']
		for (let field of stringRequiredFields) {
			if (typeof this[field] !== 'string' || !this[field]) {
				throw new Error(`Field ${field} is required`)
			}
		}
	}

	static async getByAccessToken(accessToken) {
		const params = {
			TableName: `SessionChildren_${$ENV}`,
			Key: {
				accessToken: accessToken
			}
		}
		let sessionProfile = await ddb.get(params).promise()
		return sessionProfile.Item
	}

	static async add(sessionProfile) {
		sessionProfile.validate()

		let TTL = new Date()
		TTL.setHours(TTL.getHours() + 1)
		sessionProfile.TTL = TTL.getTime() / 1000

		const params = {
			TableName: `SessionChildren_${$ENV}`,
			Item: sessionProfile
		}
		await ddb.put(params).promise()
		return sessionProfile
	}

	static async extendTTL(accessToken) {
		let TTL = new Date()
		TTL.setHours(TTL.getHours() + 1)

		const params = {
			TableName: `SessionChildren_${$ENV}`,
			Key: {
				accessToken: accessToken
			},
			UpdateExpression: 'set TTL = :TTL',
			ExpressionAttributeValues: {
				':TTL': TTL.getTime() / 1000
			},
			ReturnValues: 'UPDATED_NEW'
		}
		await ddb.update(params).promise()
	}
}