import { type FastifyRequest } from 'fastify'
import { z } from 'zod'

export const getUserMealById = async (request: FastifyRequest): Promise<string> => {
  const getUserMealParamsSchema = z.object({
    id: z.string()
  })

  const { id } = getUserMealParamsSchema.parse(request.params)

  return id
}
