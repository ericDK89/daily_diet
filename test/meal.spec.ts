import request from 'supertest'
import { expect, it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Meal routes', async () => {
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

  it('should be able to create a new meal', async () => {
    const newUser = {
      name: 'Test',
      email: 'test@test.com'
    }

    const createUser = await request(app.server).post('/user').send(newUser)

    const cookies = createUser.get('Set-Cookie')

    const getUser = await request(app.server)
      .get('/user')
      .set('Cookie', cookies)

    const userId = getUser.body.users[0].id

    const newMeal = {
      description: 'Lanche de fim de semana',
      name: 'Pizza',
      diet: false
    }

    const response = await request(app.server)
      .post(`/meals/${userId}`)
      .set('Cookie', cookies)
      .send(newMeal)

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to get all user meals', async () => {
    const newUser = {
      name: 'Test',
      email: 'test@test.com'
    }

    const createUser = await request(app.server).post('/user').send(newUser)

    const cookies = createUser.get('Set-Cookie')

    const getUser = await request(app.server)
      .get('/user')
      .set('Cookie', cookies)

    const userId = getUser.body.users[0].id

    const newMeal1 = {
      description: 'Lanche de fim de semana',
      name: 'Pizza',
      diet: false
    }

    const newMeal2 = {
      description: 'Salada antes de dormir',
      name: 'Salada',
      diet: true
    }

    await request(app.server)
      .post(`/meals/${userId}`)
      .set('Cookie', cookies)
      .send(newMeal1)

    await request(app.server)
      .post(`/meals/${userId}`)
      .set('Cookie', cookies)
      .send(newMeal2)

    const getUserAllMeals = await request(app.server)
      .get(`/meals/${userId}`)
      .set('Cookie', cookies)

    expect(getUserAllMeals.body.allUserMeals).toEqual([{
      id: expect.any(String),
      user_id: userId,
      name: 'Pizza',
      description: 'Lanche de fim de semana',
      within_the_diet: 0,
      created_at: expect.any(String)
    }, {
      id: expect.any(String),
      user_id: userId,
      name: 'Salada',
      description: 'Salada antes de dormir',
      within_the_diet: 1,
      created_at: expect.any(String)
    }])
  })

  it('should be able to get a meal by id', async () => {
    const newUser = {
      name: 'Test',
      email: 'test@test.com'
    }

    const createUser = await request(app.server).post('/user').send(newUser)

    const cookies = createUser.get('Set-Cookie')

    const getUser = await request(app.server)
      .get('/user')
      .set('Cookie', cookies)

    const userId = getUser.body.users[0].id

    const newMeal = {
      description: 'Lanche de fim de semana',
      name: 'Pizza',
      diet: false
    }

    await request(app.server)
      .post(`/meals/${userId}`)
      .set('Cookie', cookies)
      .send(newMeal)

    const getUserAllMeals = await request(app.server)
      .get(`/meals/${userId}`)
      .set('Cookie', cookies)

    const mealId = getUserAllMeals.body.allUserMeals[0].id

    const getMeal = await request(app.server)
      .get(`/meals/meal/${mealId}`)
      .set('Cookie', cookies)

    expect(getMeal.body.userMeal).toEqual({
      id: expect.any(String),
      user_id: userId,
      name: 'Pizza',
      description: 'Lanche de fim de semana',
      within_the_diet: 0,
      created_at: expect.any(String)
    })
  })
})
