import { type FastifyInstance } from 'fastify'
import { knex } from '../db'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { getBestSequence } from '../utils/get-best-sequence'

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

  app.addHook('preHandler', checkSessionIdExists)

  // get all user metrics
  app.get('/:userId/metrics', async (request, reply) => {
    const createUserIdSchema = z.object({
      userId: z.string()
    })

    const { userId } = createUserIdSchema.parse(request.params)

    const allUserMeals = await knex('meals')
      .where('user_id', userId)
      .select('*')

    const userWithinDietMealsAmount = allUserMeals.filter(meal => meal.within_the_diet)
    const userNotWithinDietMealsAmount = allUserMeals.filter(meal => !meal.within_the_diet)

    const metricBestSequence = getBestSequence(allUserMeals)

    const metrics = {
      allUserMeals: allUserMeals.length,
      userWithinDietMealsAmount: userWithinDietMealsAmount.length,
      userNotWithinDietMealsAmount: userNotWithinDietMealsAmount.length,
      bestSequence: metricBestSequence
    }

    return await reply.status(200).send(metrics)
  })

  app.get('/', async (request) => {
    const users = await knex('users').select('*')
    return {
      users
    }
  })
}
