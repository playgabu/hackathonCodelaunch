import ddb from '../common/dynamodb';
import { v4 as uuid } from 'uuid';

const $ENV = process.env.env;
export default class UserModel {
	constructor(email, fullName, phone, pin) {
		this.email = email
		this.fullName = fullName
		this.phone = phone
		this.pin = pin
	}

	validate() {
		const stringRequiredFields = ['email', 'fullName', 'phone']
		for (let field of stringRequiredFields) {
			if (typeof this[field] !== 'string' || !this[field]) {
				throw new Error(`Field ${field} is required`)
			}
		}

		if(!this.pin || this.pin.length !== 4 || this.pin.match(/\D/)) {
			throw new Error('Pin must be 4 digits')
		}
	}

	/**
   * @param {string} id
   */
	static async get(id) {
		const params = {
			TableName: `Users_${$ENV}`,
			Key: { 'id': id }
		}
		let user = await ddb.get(params).promise()
		if (!user.Item) {
			return null
		}
		return user.Item
	}

	/**
   * @param {string} email
   */
	static async getByEmail(email) {
		const gettingParams = {
			TableName: `Users_${$ENV}`,
			IndexName: "email-index",
			ExpressionAttributeValues: {
				':email': email
			},
			KeyConditionExpression: 'email = :email',
			ScanIndexForward: false
		}

		let user = await ddb.query(gettingParams).promise()
		if (!user.Items?.length)
			return null
		return user.Items[0]
	}

	/**
   * @param {UserModel} user
   */
	static async add(user) {
		let sameEmail = await this.getByEmail(user.email)
		if (sameEmail) {
			throw new Error('Email already exists')
		}
		
		user.validate()

		user.id = uuid()
		user.createdAt = new Date().toISOString()
		user.updatedAt = new Date().toISOString()

		const params = {
			TableName: `Users_${$ENV}`,
			Item: user,
		};
		await ddb.put(params).promise()

		return user
	}

	/**
   * @param {UserModel} user
   */
	static async update(user) {
		user.validate()

		await ddb.update({
			Key: {
				id: user.id,
			},
			TableName: `Users_${$ENV}`,
			UpdateExpression: 'set email = :email, fullName = :fullName, phone = :phone, updatedAt = :updatedAt',
			ExpressionAttributeValues: {
				':email': user.email,
				':fullName': user.fullName,
				':phone': user.phone,
				':updatedAt': new Date().toISOString(),
			},
		}).promise()

		return user
	}
}