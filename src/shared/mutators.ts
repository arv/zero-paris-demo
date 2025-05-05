import type {CustomMutatorDefs, Transaction} from '@rocicorp/zero';
import type {Schema} from './schema.ts';

export const mutators = {
  todo: {
    async add(
      tx: Transaction<Schema, unknown>,
      args: {id: string; description: string},
    ) {
      const {id, description} = args;
      await tx.mutate.todo.insert({
        id,
        description,
        completed: false,
        createdAt: Date.now(),
      });
    },
  },
} satisfies CustomMutatorDefs<Schema>;

export type Mutators = typeof mutators;
