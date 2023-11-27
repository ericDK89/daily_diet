import request from 'supertest'
import { expect, it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('User routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a user', async () => {
    const newUser = {
      name: 'Test',
      email: 'test@test.com'
    }

    const response = await request(app.server).post('/user').send(newUser)

    expect(response.statusCode).toEqual(201)
  })
})
