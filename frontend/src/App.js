import LoginForm from './components/LoginForm';

const { Route, Switch } = require('react-router-dom');



function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/login"  >
          <LoginForm />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
