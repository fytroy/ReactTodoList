import React from 'react';
import TodosList from './TodoList';
import Header from './Header';
import InputTodo from './InputTodo';
import Calendar from './Calendar';
import MyDay from './MyDay';

class TodoContainer extends React.Component {
  state = {
    todos: [],
    filter: 'all', // all, active, completed
    currentView: 'tasks', // tasks, myDay, calendar
  };

  componentDidMount() {
    const temp = localStorage.getItem('todos');
    const loadedTodos = JSON.parse(temp);
    if (loadedTodos) {
      this.setState({
        todos: loadedTodos,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.todos !== this.state.todos) {
      const temp = JSON.stringify(this.state.todos);
      localStorage.setItem('todos', temp);
    }
  }

  handleChange = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      }),
    }));
  };

  delTodo = (id) => {
    this.setState({
      todos: [
        ...this.state.todos.filter((todo) => {
          return todo.id !== id;
        }),
      ],
    });
  };

  addTodoItem = (title, dueDate, dueTime) => {
    const newTodo = {
      id: Date.now(),
      title: title,
      completed: false,
      dueDate: dueDate,
      dueTime: dueTime,
      timerDuration: 0, // in minutes
      isTimerRunning: false,
      timerEndTime: null,
    };
    this.setState({
      todos: [...this.state.todos, newTodo],
    });
  };

  setUpdate = (updatedTitle, id) => {
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id === id) {
          todo.title = updatedTitle;
        }
        return todo;
      }),
    });
  };

  updateDueDate = (id, newDueDate) => {
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, dueDate: newDueDate };
        }
        return todo;
      }),
    });
  };

  toggleTimer = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) => {
        if (todo.id === id) {
          if (todo.isTimerRunning) {
            // Stop timer
            return {
              ...todo,
              isTimerRunning: false,
              timerEndTime: null,
            };
          } else {
            // Start timer - countdown from timerDuration
            if (todo.timerDuration > 0) {
              return {
                ...todo,
                isTimerRunning: true,
                timerEndTime: Date.now() + (todo.timerDuration * 60 * 1000),
              };
            }
          }
        }
        return todo;
      }),
    }));
  };

  resetTimer = (id) => {
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isTimerRunning: false,
            timerEndTime: null,
          };
        }
        return todo;
      }),
    });
  };

  setTimerDuration = (id, minutes) => {
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            timerDuration: minutes,
          };
        }
        return todo;
      }),
    });
  };

  setView = (view) => {
    this.setState({ currentView: view });
  };

  setFilter = (filter) => {
    this.setState({ filter });
  };

  clearCompleted = () => {
    this.setState({
      todos: this.state.todos.filter((todo) => !todo.completed),
    });
  };

  render() {
    const { todos, filter, currentView } = this.state;
    
    const filteredTodos = todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    const activeCount = todos.filter((todo) => !todo.completed).length;

    return (
      <div className="container">
        <div className="inner">
          <Header />
          
          {/* Navigation Tabs */}
          <div className="nav-tabs">
            <button
              className={`nav-tab ${currentView === 'tasks' ? 'active' : ''}`}
              onClick={() => this.setView('tasks')}
            >
              📋 All Tasks
            </button>
            <button
              className={`nav-tab ${currentView === 'myDay' ? 'active' : ''}`}
              onClick={() => this.setView('myDay')}
            >
              ☀️ My Day
            </button>
            <button
              className={`nav-tab ${currentView === 'calendar' ? 'active' : ''}`}
              onClick={() => this.setView('calendar')}
            >
              📅 Calendar
            </button>
          </div>

          {/* Conditionally render based on current view */}
          {currentView === 'tasks' && (
            <>
              <InputTodo addTodoProps={this.addTodoItem} />
              <TodosList
                todos={filteredTodos}
                handleChangeProps={this.handleChange}
                deleteTodoProps={this.delTodo}
                setUpdate={this.setUpdate}
                updateDueDateProps={this.updateDueDate}
                toggleTimerProps={this.toggleTimer}
                resetTimerProps={this.resetTimer}
                setTimerDurationProps={this.setTimerDuration}
              />
              <div className="todo-footer">
                <span className="todo-count">
                  {activeCount} {activeCount === 1 ? 'item' : 'items'} left
                </span>
                <div className="filters">
                  <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => this.setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={filter === 'active' ? 'active' : ''}
                    onClick={() => this.setFilter('active')}
                  >
                    Active
                  </button>
                  <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => this.setFilter('completed')}
                  >
                    Completed
                  </button>
                </div>
                <button className="clear-completed" onClick={this.clearCompleted}>
                  Clear completed
                </button>
              </div>
            </>
          )}

          {currentView === 'myDay' && (
            <MyDay
              todos={todos}
              handleChangeProps={this.handleChange}
              deleteTodoProps={this.delTodo}
              setUpdate={this.setUpdate}
              toggleTimerProps={this.toggleTimer}
              resetTimerProps={this.resetTimer}
              setTimerDurationProps={this.setTimerDuration}
            />
          )}

          {currentView === 'calendar' && (
            <Calendar
              todos={todos}
              handleChangeProps={this.handleChange}
              deleteTodoProps={this.delTodo}
            />
          )}
        </div>
      </div>
    );
  }
}

export default TodoContainer;
