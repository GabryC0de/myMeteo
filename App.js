// React
import { Provider } from 'react-redux';

// Redux
import { store } from './store/store.js';

//components
import Main from './pages/main.js'

export default function App() {

  return (
    < Provider store={store} >
      <Main></Main>
    </Provider >
  );
}

