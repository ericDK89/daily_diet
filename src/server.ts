import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { routes } from './routes'

export const app = fastify()

void app.register(cookie)

void app.register(routes)

void app.listen({
  port: 3333
}).then(() => { console.log('listening on port') })
