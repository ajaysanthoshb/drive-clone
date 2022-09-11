import React from 'react'
import SignUp from './Signup';
import Profile from './Profile';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import Dashboard from '../Cloud/Dashboard';
function App() {
  return (
      <Router>
        <Switch>
          {/* auth */}
          <Route exact path='/signup' component={SignUp}></Route>
          <Route exact path='/login' component={Login}></Route>
          <Route exact path='/forgotPassword' component={ForgotPassword}></Route>

          {/* Profile */}
          <PrivateRoute exact path='/user' component={Profile}></PrivateRoute>
          <PrivateRoute exact path='/update-profile' component={UpdateProfile}></PrivateRoute>

          {/* Drive */}
          {/* Put PrivateRoute later */}
          <PrivateRoute exact path = '/' component = {Dashboard}></PrivateRoute>
          <PrivateRoute exact path = '/folder/:folderId' component = {Dashboard}></PrivateRoute>
        </Switch>
      </Router>
  )
}
export default App;
