import './App.css';
import { UserContextProvider } from './Hooks/UserContext';
import AppRouter from './Routes/AppRouter';

import Header from './Components/Header';
import Alert from './Components/Alert';

function App() {
  return (
    <UserContextProvider>
      <Header />
      <Alert />
      <div className="App">
        <AppRouter />
      </div>
    </UserContextProvider>
  );
}

export default App;