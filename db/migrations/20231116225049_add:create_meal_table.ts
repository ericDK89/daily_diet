import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').unsigned()
    table.foreign('user_id').references('id').inTable('users')
    table.text('name')
    table.text('description')
    table.boolean('within_the_diet').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
