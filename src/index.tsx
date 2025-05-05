import {Zero} from '@rocicorp/zero';
import {
  useQuery,
  useZero as useZeroWithTypeParams,
  ZeroProvider,
} from '@rocicorp/zero/react';
import {nanoid} from 'nanoid';
import {render} from 'preact';
import {type Schema, schema, type Todo} from './shared/schema.js';
import './styles.css';

const useZero = useZeroWithTypeParams<Schema>;

export function App() {
  const z = new Zero({
    schema,
    userID: 'anon',
    server: import.meta.env.VITE_PUBLIC_SERVER,
  });

  z.query.todo.preload();
  return (
    <ZeroProvider zero={z}>
      <Root />
    </ZeroProvider>
  );
}

export function Root() {
  const z = useZero();
  const [todos] = useQuery(z.query.todo);
  return (
    <div class="app">
      <h1>Todo App</h1>
      <div class="todo-list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
      <button
        class="create-button"
        onClick={() =>
          z.mutate.todo.insert({
            id: nanoid(),
            description: 'Hi Paris',
            completed: false,
            createdAt: Date.now(),
          })
        }
      >
        Create Todo
      </button>
    </div>
  );
}

function TodoItem({todo}: {todo: Todo}) {
  const z = useZero();
  const {completed} = todo;
  return (
    <div class={`todo-item ${completed ? 'complete' : 'incomplete'}`}>
      <input
        type="checkbox"
        checked={completed}
        onChange={e =>
          z.mutate.todo.update({
            id: todo.id,
            completed: e.currentTarget.checked,
          })
        }
      />
      <input
        type="text"
        onInput={e =>
          z.mutate.todo.update({
            id: todo.id,
            description: e.currentTarget.value,
          })
        }
        value={todo.description}
      />
    </div>
  );
}

render(<App />, document.getElementById('app')!);
