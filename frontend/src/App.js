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
import Review from './components/Review';
import HomePage from './components/HomePage';
import CircleList from './components/CircleList';
import CirclePage from './components/CirclePage';

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
        <Route exact path='/'>
          <HomePage />
        </Route>
        <Route exact path='/reviews/:id'>
          <Review />
        </Route>
        <Route exact path="/books"  >
          <BookList />
        </Route>
        <Route exact path='/books/:id' >
          <BookDetails />
        </Route>
        <Route exact path='/circles' >
          <CircleList />
        </Route>
        <Route exact path='/circles/:id' >
          <CirclePage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
