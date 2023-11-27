import fastify from 'fastify'
import { routes } from './routes'
import cookie from '@fastify/cookie'

export const app = fastify()

void app.register(cookie)

void app.register(routes)
