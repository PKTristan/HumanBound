import { useDispatch } from 'react-redux';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import { useEffect } from 'react';
import * as userActions from './store/user';
import Modal from "react-modal";

const { Route, Switch } = require('react-router-dom');

Modal.setAppElement('#root');

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getUser());
  }, [dispatch, userActions]);


  return (
    <div className="app">
      <NavBar />
      <Switch>
        <Route exact path="/login"  >
          <LoginForm />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
