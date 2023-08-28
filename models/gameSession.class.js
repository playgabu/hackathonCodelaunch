import enums from './enums'
import ddb from '../common/dynamodb';
import { v4 as uuid } from 'uuid';

const $ENV = process.env.env;
export default class GameSessionModel {

	/**
	 * @param {string} coach
	 * @param {enums.Games} game
	 * @param {string} description
	 * @param {string} dateTime
	 */
	constructor(coach, game, description, dateTime) {
		this.coach = coach
		this.game = game
		this.description = description
		this.dateTime = dateTime
	}

	validate() {
		const stringRequiredFields = ['coach', 'description', 'dateTime']
		for (let field of stringRequiredFields) {
			if (typeof this[field] !== 'string' || !this[field]) {
				throw new Error(`Field ${field} is required`)
			}
		}

		if (!Object.values(enums.Games).includes(this.game)) {
			throw new Error(`Game is invalid`)
		}
	}

	static async getAll() {
		const params = {
			TableName: `GameSessions_${$ENV}`,
		}
		let gameSessions = await ddb.scan(params).promise()

		if(!gameSessions.Items || !gameSessions.Items.length) {
			let date = new Date()
			date.setHours(18,0,0,0)
			await this.add(new GameSessionModel('Javi', enums.Games.roblox, 'Murder Mystery 2', date.toISOString()))
			date.setHours(17,0,0,0)
			date.setDate(date.getDate() + 1)
			await this.add(new GameSessionModel('Kim', enums.Games.minecraft, 'Survival Mode', date.toISOString()))
		}

		gameSessions = await ddb.scan(params).promise()

		gameSessions.Items.forEach(x => {
			x.gameName = enums.getKeyByValue(enums.Games, x.game)
		})

		return gameSessions.Items
	}

	static async get(id) {
		const params = {
			TableName: `GameSessions_${$ENV}`,
			Key: { 'id': id }
		}
		let session = await ddb.get(params).promise()
		return session.Item
	}

	/**
	 * @param {GameSessionModel} gameSession
	 */
	static async add(gameSession) {
		gameSession.validate()
		gameSession.id = uuid()

		const params = {
			TableName: `GameSessions_${$ENV}`,
			Item: gameSession
		}
		await ddb.put(params).promise()
		return gameSession
	}

	static async addChild(id, childId) {
		let session = await this.get(id)
		if (!session) {
			throw new Error('Session not found')
		}

		if(!session.childrenIds || !session.childrenIds.includes(childId)) {
			session.childrenIds = [...(session.childrenIds || []), childId]
		}

		await ddb.update({
			Key: { id },
			TableName: `GameSessions_${$ENV}`,
			UpdateExpression: 'set childrenIds = :childrenIds',
			ExpressionAttributeValues: {
				':childrenIds': session.childrenIds,
			},
		}).promise()

		return session
	}

	static async removeChild(id, childId) {
		let session = await this.get(id)
		if (!session) {
			throw new Error('Session not found')
		}

		if(session.childrenIds && session.childrenIds.includes(childId)) {
			session.childrenIds = session.childrenIds.filter(x => x !== childId)
		}

		await ddb.update({
			Key: { id },
			TableName: `GameSessions_${$ENV}`,
			UpdateExpression: 'set childrenIds = :childrenIds',
			ExpressionAttributeValues: {
				':childrenIds': session.childrenIds,
			},
		}).promise()

		return session
	}
}