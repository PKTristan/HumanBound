import { useDispatch } from 'react-redux';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import NavBar from './components/NavBar';
import { useEffect } from 'react';
import * as userActions from './store/user';
import Modal from "react-modal";
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import BookDetails from './components/BookDetails';

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
        <Route exact path="/books"  >
          <BookList />
        </Route>
        <Route exact path='/books/:id' >
          <BookDetails />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
