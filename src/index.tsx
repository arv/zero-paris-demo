import {useZero as useZeroWithTypeParams} from '@rocicorp/zero/react';
import {render} from 'preact';
import {type Schema} from './shared/schema.js';
import './styles.css';

const useZero = useZeroWithTypeParams<Schema>;

export function App() {
  return '';
}

render(<App />, document.getElementById('app')!);
