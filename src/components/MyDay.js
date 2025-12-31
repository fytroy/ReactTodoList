import React from 'react';
import TodoItem from './TodoItem';

class MyDay extends React.Component {
  getTodaysTasks = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    return this.props.todos.filter(todo => {
      if (todo.dueDate === todayStr) {
        return true;
      }
      return false;
    });
  };

  render() {
    const {
      handleChangeProps,
      deleteTodoProps,
      setUpdate,
      toggleTimerProps,
      resetTimerProps,
      setTimerDurationProps,
    } = this.props;

    const todaysTasks = this.getTodaysTasks();
    const completedCount = todaysTasks.filter(todo => todo.completed).length;
    const totalCount = todaysTasks.length;

    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="my-day-view">
        <div className="my-day-header">
          <div className="day-info">
            <h2 className="day-title">☀️ My Day</h2>
            <p className="day-date">
              {dayNames[today.getDay()]}, {monthNames[today.getMonth()]} {today.getDate()}
            </p>
          </div>
          {totalCount > 0 && (
            <div className="progress-info">
              <div className="progress-text">
                {completedCount} of {totalCount} completed
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="my-day-content">
          {todaysTasks.length > 0 ? (
            <ul className="todos-list">
              {todaysTasks.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  handleChangeProps={handleChangeProps}
                  deleteTodoProps={deleteTodoProps}
                  setUpdate={setUpdate}
                  toggleTimerProps={toggleTimerProps}
                  resetTimerProps={resetTimerProps}
                  setTimerDurationProps={setTimerDurationProps}
                />
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No tasks for today</h3>
              <p>You're all set! Enjoy your day or add new tasks in the All Tasks view.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MyDay;
