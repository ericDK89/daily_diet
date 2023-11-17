import { type FastifyInstance } from 'fastify'
import { usersRoutes } from './users'
import { mealsRoutes } from './meals'

export const routes = async (app: FastifyInstance): Promise<void> => {
  await app.register(usersRoutes, { prefix: 'user' })
  await app.register(mealsRoutes, { prefix: 'meals' })
}
