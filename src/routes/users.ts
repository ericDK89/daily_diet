import { type FastifyInstance } from 'fastify'
import { knex } from '../db'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export const usersRoutes = async (app: FastifyInstance): Promise<void> => {
  //  create new user
  app.post('/', async (request, reply) => {
    const createNewUserSchema = z.object({
      name: z.string(),
      email: z.string()
    })

    let { sessionId } = request.cookies

    if (sessionId == null) {
      sessionId = randomUUID()

      void reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      })
    }

    const { email, name } = createNewUserSchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId
    })

    return await reply.status(201).send()
  })

  // get all user metrics
  app.get('/:id', async (request, reply) => {
    const { sessionId } = request.cookies

    const user = await knex('users')
      .where('session_id', sessionId)
      .first()

    if (user == null) {
      return await reply.status(404).send({
        error: 'User not found'
      })
    }

    const userFoodAmount = await knex('meals')
      .where('id', user.id)
      .select('*')

    return {
      userFoodAmount
    }
  })

  app.get('/', async (request) => {
    const users = await knex('users').select('*')
    return {
      users
    }
  })
}
