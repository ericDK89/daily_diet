import { type FastifyRequest } from 'fastify'
import { z } from 'zod'

export const getUserMealById = async (request: FastifyRequest): Promise<string> => {
  const getUserMealParamsSchema = z.object({
    mealId: z.string()
  })

  const { mealId } = getUserMealParamsSchema.parse(request.params)

  return mealId
}
