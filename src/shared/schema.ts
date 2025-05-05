import {
  ANYONE_CAN_DO_ANYTHING,
  boolean,
  createSchema,
  definePermissions,
  number,
  type Row,
  string,
  table,
} from '@rocicorp/zero';

const todoTable = table('todo')
  .columns({
    id: string(),
    description: string(),
    completed: boolean(),
    createdAt: number().from('created_at'),
  })
  .primaryKey('id');

export const schema = createSchema({
  tables: [todoTable],
});

export type Schema = typeof schema;

export const permissions = definePermissions(schema, () => ({
  todo: ANYONE_CAN_DO_ANYTHING,
}));

export type Todo = Row<typeof schema.tables.todo>;
