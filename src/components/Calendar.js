import React from 'react';
import PropTypes from 'prop-types';

class Calendar extends React.Component {
  state = {
    currentDate: new Date(),
    selectedDate: null,
  };

  getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDayOfMonth };
  };

  getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return this.props.todos.filter(todo => todo.dueDate === dateStr);
  };

  changeMonth = (offset) => {
    this.setState(prevState => {
      const newDate = new Date(prevState.currentDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return { currentDate: newDate };
    });
  };

  selectDate = (day) => {
    const selectedDate = new Date(
      this.state.currentDate.getFullYear(),
      this.state.currentDate.getMonth(),
      day
    );
    this.setState({ selectedDate });
  };

  isToday = (day) => {
    const today = new Date();
    const { currentDate } = this.state;
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  render() {
    const { currentDate, selectedDate } = this.state;
    const { handleChangeProps, deleteTodoProps } = this.props;
    const { daysInMonth, firstDayOfMonth } = this.getDaysInMonth(currentDate);
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const tasksForDay = this.getTasksForDate(date);
      const isSelected = selectedDate && selectedDate.getDate() === day &&
                        selectedDate.getMonth() === currentDate.getMonth() &&
                        selectedDate.getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${this.isToday(day) ? 'today' : ''} ${isSelected ? 'selected' : ''} ${tasksForDay.length > 0 ? 'has-tasks' : ''}`}
          onClick={() => this.selectDate(day)}
        >
          <div className="day-number">{day}</div>
          {tasksForDay.length > 0 && (
            <div className="task-indicator">{tasksForDay.length}</div>
          )}
        </div>
      );
    }

    const selectedDateTasks = selectedDate ? this.getTasksForDate(selectedDate) : [];

    return (
      <div className="calendar-view">
        <div className="calendar-header">
          <button className="month-nav" onClick={() => this.changeMonth(-1)}>‹</button>
          <h2 className="current-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button className="month-nav" onClick={() => this.changeMonth(1)}>›</button>
        </div>

        <div className="calendar-grid">
          {dayNames.map(name => (
            <div key={name} className="day-name">{name}</div>
          ))}
          {days}
        </div>

        {selectedDate && (
          <div className="selected-date-tasks">
            <h3 className="selected-date-title">
              Tasks for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            {selectedDateTasks.length > 0 ? (
              <ul className="calendar-tasks-list">
                {selectedDateTasks.map(todo => (
                  <li key={todo.id} className={`calendar-task-item ${todo.completed ? 'completed' : ''}`}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={todo.completed}
                      onChange={() => handleChangeProps(todo.id)}
                    />
                    <span className="task-text" style={todo.completed ? { textDecoration: 'line-through', opacity: 0.6 } : null}>
                      {todo.title}
                    </span>
                    {todo.dueTime && (
                      <span className="task-time">
                        🕐 {todo.dueTime}
                      </span>
                    )}
                    <button 
                      className="task-delete"
                      onClick={() => deleteTodoProps(todo.id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-tasks">No tasks scheduled for this day</p>
            )}
          </div>
        )}
      </div>
    );
  }
}

Calendar.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      dueDate: PropTypes.string,
    })
  ).isRequired,
  handleChangeProps: PropTypes.func.isRequired,
  deleteTodoProps: PropTypes.func.isRequired,
};

export default Calendar;
