import React from 'react';
import PropTypes from 'prop-types';

class TodoItem extends React.Component {
  state = {
    editing: false,
    currentTime: Date.now(),
    timerInput: '',
  };

  componentDidMount() {
    this.timerInterval = setInterval(() => {
      this.setState({ currentTime: Date.now() });
    }, 100);
  }

  componentWillUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  handleEditing = () => {
    this.setState({
      editing: true,
    });
  };

  handleUpdatedDone = (event) => {
    if (event.key === 'Enter') {
      this.setState({ editing: false });
    }
  };

  formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  getRemainingTime = () => {
    const { todo } = this.props;
    if (todo.isTimerRunning && todo.timerEndTime) {
      const remaining = todo.timerEndTime - this.state.currentTime;
      return Math.max(0, remaining);
    }
    return todo.timerDuration * 60 * 1000; // Convert minutes to milliseconds
  };

  handleTimerInput = (e) => {
    this.setState({ timerInput: e.target.value });
  };

  setTimer = () => {
    const minutes = parseInt(this.state.timerInput);
    if (!isNaN(minutes) && minutes > 0) {
      this.props.setTimerDurationProps(this.props.todo.id, minutes);
      this.setState({ timerInput: '' });
    }
  };

  formatDueDateTime = (dateString, timeString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // If time is specified, create a full datetime
    let dueDateTime = date;
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      dueDateTime = new Date(date);
      dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      dueDateTime.setHours(23, 59, 59, 999); // End of day if no time specified
    }
    
    const diffTime = dueDateTime - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let dateText = '';
    if (diffDays < 0) {
      dateText = `Overdue by ${Math.abs(diffDays)} day(s)`;
    } else if (diffDays === 0) {
      dateText = 'Due today';
    } else if (diffDays === 1) {
      dateText = 'Due tomorrow';
    } else if (diffDays <= 7) {
      dateText = `Due in ${diffDays} days`;
    } else {
      dateText = date.toLocaleDateString();
    }
    
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      dateText += ` at ${displayHour}:${minutes} ${ampm}`;
    }
    
    return dateText;
  };

  isDueSoon = (dateString, timeString) => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    
    let dueDateTime = date;
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      dueDateTime = new Date(date);
      dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      dueDateTime.setHours(23, 59, 59, 999);
    }
    
    const diffTime = dueDateTime - now;
    const diffHours = diffTime / (1000 * 60 * 60);
    
    return diffHours >= 0 && diffHours <= 72; // 3 days
  };

  isOverdue = (dateString, timeString) => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    
    let dueDateTime = date;
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      dueDateTime = new Date(date);
      dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      dueDateTime.setHours(23, 59, 59, 999);
    }
    
    return dueDateTime < now;
  };

  render() {
    const { todo, handleChangeProps, deleteTodoProps, setUpdate, toggleTimerProps, resetTimerProps } = this.props;
    const { editing, timerInput } = this.state;

    const viewMode = {};
    const editMode = {};

    if (editing) {
      viewMode.display = 'none';
    } else {
      editMode.display = 'none';
    }

    const completedStyle = {
      textDecoration: 'line-through',
      opacity: 0.6,
    };

    const remainingTime = this.getRemainingTime();
    const dueDateClass = this.isOverdue(todo.dueDate, todo.dueTime)
      ? 'overdue'
      : this.isDueSoon(todo.dueDate, todo.dueTime)
      ? 'due-soon'
      : '';

    return (
      <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <div className="todo-content" style={viewMode}>
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              className="checkbox"
              checked={todo.completed}
              onChange={() => handleChangeProps(todo.id)}
            />
            <span
              className="todo-title"
              style={todo.completed ? completedStyle : null}
              onDoubleClick={this.handleEditing}
            >
              {todo.title}
            </span>
          </div>
          
          <div className="todo-meta">
            {todo.dueDate && (
              <div className={`due-date ${dueDateClass}`}>
                <span className="icon">📅</span>
                <span>{this.formatDueDateTime(todo.dueDate, todo.dueTime)}</span>
              </div>
            )}
            
            <div className="timer-section">
              {todo.timerDuration > 0 ? (
                <>
                  <div className={`time-display ${todo.isTimerRunning && remainingTime === 0 ? 'timer-finished' : ''}`}>
                    <span className="icon">⏱️</span>
                    <span className="time">{this.formatTime(remainingTime)}</span>
                  </div>
                  <div className="timer-controls">
                    <button
                      className={`timer-btn ${todo.isTimerRunning ? 'pause' : 'play'}`}
                      onClick={() => toggleTimerProps(todo.id)}
                      title={todo.isTimerRunning ? 'Pause' : 'Start'}
                      disabled={!todo.timerDuration}
                    >
                      {todo.isTimerRunning ? '⏸' : '▶'}
                    </button>
                    <button
                      className="timer-btn reset"
                      onClick={() => resetTimerProps(todo.id)}
                      title="Reset"
                    >
                      ↻
                    </button>
                  </div>
                </>
              ) : (
                <div className="timer-input-wrapper">
                  <input
                    type="number"
                    className="timer-input"
                    placeholder="Min"
                    value={timerInput}
                    onChange={this.handleTimerInput}
                    min="1"
                  />
                  <button className="timer-set-btn" onClick={this.setTimer}>
                    Set Timer
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className="delete-btn" onClick={() => deleteTodoProps(todo.id)}>
            ×
          </button>
        </div>

        <input
          type="text"
          style={editMode}
          className="edit-input"
          defaultValue={todo.title}
          onKeyPress={this.handleUpdatedDone}
          onChange={(e) => {
            setUpdate(e.target.value, todo.id);
          }}
        />
      </li>
    );
  }
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    dueDate: PropTypes.string,
    dueTime: PropTypes.string,
    isTimerRunning: PropTypes.bool,
    timerEndTime: PropTypes.number,
    timerDuration: PropTypes.number,
  }).isRequired,
  handleChangeProps: PropTypes.func.isRequired,
  deleteTodoProps: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired,
  toggleTimerProps: PropTypes.func.isRequired,
  resetTimerProps: PropTypes.func.isRequired,
  setTimerDurationProps: PropTypes.func.isRequired,
};

export default TodoItem;
