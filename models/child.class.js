import ddb from '../common/dynamodb';
import enums from './enums'
import { v4 as uuid } from 'uuid';

const $ENV = process.env.env;
export default class ChildModel {
	/**
   * @param {id} userId
   * @param {string} username
   * @param {string} birthDate
   * @param {enums.Genres} genre
   * @param {[enums.Games]} favoriteGames
   * @param {string} avatar
   */
	constructor(userId, username, birthDate, genre, favoriteGames, avatar) {
		this.userId = userId
		this.username = username
		this.birthDate = birthDate
		this.genre = genre
		this.favoriteGames = favoriteGames
		this.avatar = avatar
	}

	validate() {
		const stringRequiredFields = ['username', 'birthDate', 'avatar']
		for (let field of stringRequiredFields) {
			if (typeof this[field] !== 'string' || !this[field]) {
				throw new Error(`Field ${field} is required`)
			}
		}

		if (!Object.values(enums.Genres).includes(this.genre)) {
			throw new Error(`Genre is invalid`)
		}

		if (!this.favoriteGames || !this.favoriteGames.length || !this.favoriteGames.every(game => Object.values(enums.Games).includes(game))) {
			throw new Error(`Favorite games are invalid`)
		}
	}

	/**
	 * @param {string} childId
	 */
	static async get(childId) {
		const params = {
			TableName: `Children_${$ENV}`,
			Key: { id: childId }
		}
		let child = await ddb.get(params).promise()
		return child.Item
	}

	/**
	 * @param {string} userId
	 */
	static async getByUserId(userId) {
		const params = {
			TableName: `Children_${$ENV}`,
			IndexName: 'user-index',
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues: {
				':userId': userId
			}
		}
		let children = await ddb.query(params).promise()
		return children.Items
	}

	/**
	 * @param {ChildModel} child
	 */
	static async add(child) {
		child.validate()
		child.id = uuid()

		const params = {
			TableName: `Children_${$ENV}`,
			Item: child
		}
		await ddb.put(params).promise()
		return child
	}
}