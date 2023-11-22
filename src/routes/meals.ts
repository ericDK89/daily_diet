import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../db'
import { randomUUID } from 'crypto'
import { getUserMealById } from '../utils/get-user-meal-by-id'

export const mealsRoutes = async (app: FastifyInstance): Promise<void> => {
  app.addHook('preHandler', checkSessionIdExists)

  // create new meal
  app.post('/:userId', async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      userId: z.string()
    })

    const { userId } = getUserIdParamsSchema.parse(request.params)

    const createNewMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.boolean()
    })

    const { description, diet, name } = createNewMealSchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      description,
      name,
      within_the_diet: diet,
      user_id: userId
    })

    return await reply.status(201).send()
  })

  // get all user meals
  app.get('/:userId', async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      userId: z.string()
    })

    const { userId } = getUserIdParamsSchema.parse(request.params)

    const allUserMeals = await knex('meals')
      .where('user_id', userId)
      .select('*')

    return await reply.status(200).send({
      allUserMeals
    })
  })

  // get user meal by id
  app.get('/meal/:mealId', async (request, reply) => {
    const mealId = await getUserMealById(request)

    const userMeal = await knex('meals')
      .where('id', mealId)
      .first()

    return await reply.status(200).send({ userMeal })
  })

  // edit user meal by id
  app.put('/:mealId', async (request, reply) => {
    const mealId = await getUserMealById(request)

    const userMeal = await knex('meals')
      .where('id', mealId)
      .first()

    const getUserMealsBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      withinTheDiet: z.boolean().optional()
    })

    const { description, name, withinTheDiet } = getUserMealsBodySchema.parse(request.body)

    if (userMeal == null) {
      return await reply.status(404).send({
        error: 'Meal not found'
      })
    }

    const updatedFields = {
      name: name ?? userMeal.name,
      description: description ?? userMeal.description,
      within_the_diet: withinTheDiet ?? userMeal.within_the_diet
    }

    await knex('meals')
      .where('id', mealId)
      .update(updatedFields)

    return await reply.status(200).send()
  })

  // delete user meal by id
  app.delete('/:mealId', async (request, reply) => {
    const mealId = await getUserMealById(request)

    await knex('meals')
      .where('id', mealId)
      .del()

    return await reply.status(202).send()
  })
}
