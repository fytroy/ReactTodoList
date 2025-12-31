import React from 'react';
import './App.css';
import TodoContainer from './components/TodoContainer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TodoContainer />
    );
  }
}

export default App;
