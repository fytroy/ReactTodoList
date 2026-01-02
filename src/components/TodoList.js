import React from 'react';
import PropTypes from 'prop-types';
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

TodosList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleChangeProps: PropTypes.func.isRequired,
  deleteTodoProps: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired,
  updateDueDateProps: PropTypes.func.isRequired,
  toggleTimerProps: PropTypes.func.isRequired,
  resetTimerProps: PropTypes.func.isRequired,
  setTimerDurationProps: PropTypes.func.isRequired,
};

export default TodosList;
