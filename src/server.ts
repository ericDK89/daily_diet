import { app } from './app'
import { env } from './env'

void app.listen({
  port: env.PORT,
  host: ('RENDER' in process.env) ? '0.0.0.0' : 'localhost'
}).then(() => {
  console.log(`Server listening on ${env.PORT}`)
})
