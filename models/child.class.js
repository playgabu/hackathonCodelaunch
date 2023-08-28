import ddb from '../common/dynamodb';
import { v4 as uuid } from 'uuid';

const $ENV = process.env.env;
export default class ChildModel {
	/**
   * @param {id} userId
   * @param {string} username
   * @param {string} birthDate
   * @param {Genre} genre
   * @param {[Games]} favoriteGames
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

		if (!Object.values(Genre).includes(this.genre)) {
			throw new Error(`Genre is invalid`)
		}

		if (!this.favoriteGames || !this.favoriteGames.length || !this.favoriteGames.every(game => Object.values(Games).includes(game))) {
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

export const Genre = {
	male: 0,
	female: 1,
	other: 2,
}

export const Games = {
	roblox: 0,
	minecraft: 1,
	fortnite: 2,
	fallGuys: 3,
}