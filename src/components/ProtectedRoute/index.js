import {Redirect, Route} from 'react-router-dom'
import Cookie from 'js-cookie'

const ProtectedRoute = ({component: Component, ...rest}) => {
  const token = Cookie.get('jwt_token')
  if (!token) {
    return <Redirect to="/login" />
  }
  return <Route {...rest} component={Component} />
}

export default ProtectedRoute
