import React, { useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { auth } from '../../Firebase'
export default function PrivateRoute({ component: Component, ...rest }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading({});
    })
  }, [])

  return (
    isLoading === true ? (
      <div>Loading</div>
    ) : (
      <Route
        {...rest}
        render={() => {
          return user ? <Component {...rest} /> : <Redirect to="/login" />
        }}
      ></Route>
    )
  )
}
