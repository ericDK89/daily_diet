import { type FastifyReply, type FastifyRequest } from 'fastify'

export const checkSessionIdExists = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const { sessionId } = request.cookies

  if (sessionId == null) {
    return await reply.status(401).send({
      error: 'Unauthorized'
    })
  }
}
