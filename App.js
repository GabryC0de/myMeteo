// Importa la configurazione delle icone una sola volta
import './icons/icons.js';
// React
import { StrictMode } from 'react'
// Redux
import { Provider } from 'react-redux';
import { store } from './store/store.js';


//components
import Main from './pages/main.js'

export default function App() {

  return (
    <StrictMode>
      < Provider store={store} >
        <Main></Main>
      </Provider >
    </StrictMode>
  );
}

