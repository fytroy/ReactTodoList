import React, { Component } from 'react';
import PropTypes from 'prop-types';

class InputTodo extends Component {
  state = {
    title: '',
    dueDate: '',
    dueTime: '',
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.title.trim()) {
      this.props.addTodoProps(this.state.title, this.state.dueDate, this.state.dueTime);
      this.setState({
        title: '',
        dueDate: '',
        dueTime: '',
      });
    } else {
      alert('Please write a task');
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form-container">
        <div className="input-group">
          <input
            type="text"
            className="input-text"
            placeholder="Add a new task..."
            value={this.state.title}
            name="title"
            onChange={this.onChange}
          />
          <input
            type="date"
            className="input-date"
            value={this.state.dueDate}
            name="dueDate"
            onChange={this.onChange}
            title="Set due date"
          />
          <input
            type="time"
            className="input-time"
            value={this.state.dueTime}
            name="dueTime"
            onChange={this.onChange}
            title="Set due time (optional)"
          />
          <button className="input-submit">
            <span className="plus-icon">+</span>
          </button>
        </div>
      </form>
    );
  }
}

InputTodo.propTypes = {
  addTodoProps: PropTypes.func.isRequired,
};

export default InputTodo;
