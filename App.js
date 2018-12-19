import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { StatusBar } from 'react-native';
import reducers from './src/utility/CombineReducers';
import RouterComponent from './RouterComponent';

class App extends Component {
  render() {
    // creating store for reducer
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <StatusBar backgroundColor="#512DA8" barStyle="light-content" />
        <RouterComponent />
      </Provider>
    );
  }
}

export default App;
