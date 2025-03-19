import { clearEl, createEl } from '../utils/dom-utils';
import { formatDate, isOverdue } from '../utils/date-utils';

export default class TodoList {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('todo-list');
    this.bindEvents();
  }

  bindEvents() {
    // New todo button
    document.getElementById('new-todo-btn').addEventListener('click', () => {
      this.app.todoForm.open();
    });

    // Delegate event handling for todo items
    this.container.addEventListener('click', (e) => {
      const todoItem = e.target.closest('.todo-item');
      if (!todoItem) return;

      const todoId = todoItem.dataset.id;

      // Handle checkbox click
      if (e.target.classList.contains('todo-checkbox')) {
        this.app.toggleTodoComplete(todoId);
      }

      // Handle edit button click
      if (e.target.closest('.todo-edit-btn')) {
        const todo = this.app.getTodoById(todoId);
        this.app.todoForm.open(todo);
      }

      // Handle delete button click
      if (e.target.closest('.todo-delete-btn')) {
        if (confirm('Are you sure you want to delete this task?')) {
          this.app.deleteTodo(todoId);
        }
      }
    });
  }

  render() {
    clearEl(this.container);

    const todos = this.app.getTodosByProject(this.app.activeProject);

    if (todos.length === 0) {
      const emptyState = createEl('div', {
        className: 'empty-state',
      });

      const icon = createEl('i', {
        className: 'fas fa-tasks',
      });

      const message = createEl(
        'p',
        {},
        'No tasks yet. Click the "New Task" button to add one.'
      );

      emptyState.appendChild(icon);
      emptyState.appendChild(message);
      this.container.appendChild(emptyState);
      return;
    }

    todos.forEach((todo) => {
      const todoItem = createEl('div', {
        className: `todo-item ${todo.completed ? 'completed' : ''}`,
        'data-id': todo.id,
      });

      // Checkbox
      const checkbox = createEl('input', {
        type: 'checkbox',
        className: 'todo-checkbox',
        checked: todo.completed,
      });

      // Todo information
      const todoInfo = createEl('div', {
        className: 'todo-info',
      });

      const todoTitle = createEl(
        'div',
        {
          className: 'todo-title',
        },
        todo.title
      );

      if (todo.description) {
        const todoDescription = createEl(
          'div',
          {
            className: 'todo-description',
          },
          todo.description
        );
        todoInfo.appendChild(todoDescription);
      }

      // Todo metadata
      const todoMeta = createEl('div', {
        className: 'todo-meta',
      });

      if (todo.dueDate) {
        const dueDateClass =
          isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : '';

        const todoDueDate = createEl('div', {
          className: `todo-due-date ${dueDateClass}`,
        });

        const dateIcon = createEl('i', {
          className: 'far fa-calendar-alt',
        });

        const dateText = createEl('span', {}, formatDate(todo.dueDate));

        todoDueDate.appendChild(dateIcon);
        todoDueDate.appendChild(dateText);
        todoMeta.appendChild(todoDueDate);
      }

      const todoPriority = createEl(
        'div',
        {
          className: `todo-priority ${todo.priority}`,
        },
        todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
      );

      todoMeta.appendChild(todoPriority);
      todoInfo.appendChild(todoTitle);
      todoInfo.appendChild(todoMeta);

      // Todo actions
      const todoActions = createEl('div', {
        className: 'todo-actions',
      });

      const editButton = createEl('button', {
        className: 'btn secondary-btn todo-edit-btn',
        'aria-label': 'Edit task',
      });

      const editIcon = createEl('i', {
        className: 'fas fa-edit',
      });

      editButton.appendChild(editIcon);

      const deleteButton = createEl('button', {
        className: 'btn danger-btn todo-delete-btn',
        'aria-label': 'Delete task',
      });

      const deleteIcon = createEl('i', {
        className: 'fas fa-trash',
      });

      deleteButton.appendChild(deleteIcon);

      todoActions.appendChild(editButton);
      todoActions.appendChild(deleteButton);

      // Assemble todo item
      todoItem.appendChild(checkbox);
      todoItem.appendChild(todoInfo);
      todoItem.appendChild(todoActions);

      this.container.appendChild(todoItem);
    });
  }
}
