import React from 'react';
import TodoItem from './TodoItem';

class TodosList extends React.Component {
  render() {
    return (
      <ul className="todos-list">
        {this.props.todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleChangeProps={this.props.handleChangeProps}
            deleteTodoProps={this.props.deleteTodoProps}
            setUpdate={this.props.setUpdate}
            updateDueDateProps={this.props.updateDueDateProps}
            toggleTimerProps={this.props.toggleTimerProps}
            resetTimerProps={this.props.resetTimerProps}
            setTimerDurationProps={this.props.setTimerDurationProps}
          />
        ))}
      </ul>
    );
  }
}

export default TodosList;
