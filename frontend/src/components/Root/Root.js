import React, { Fragment } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import store from '../../application/redux/store';
import { AuthProvider } from '../../application/firebase/auth';
import App from '../App';

export default function Root() {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <Router>
          <Fragment>
            <App />
          </Fragment>
        </Router>
      </AuthProvider>
    </ReduxProvider>
  );
}
