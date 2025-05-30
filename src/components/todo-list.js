import { clearEl, createEl } from '../utils/dom-utils';
import { formatDate, isOverdue } from '../utils/date-utils';

export default class TodoList {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('todo-list');
    this.setOrder = 'date';
    this.bindEvents();
    this.addSortingControls();
  }

  addSortingControls() {
    // Create a sort dropdown control
    const sortContainer = createEl('div', {
      className: 'sort-container',
    });

    const sortDropdown = createEl('select', {
      className: 'sort-dropdown',
      id: 'sort-dropdown',
    });

    const options = [
      { value: 'date', text: 'Sort by Date' },
      { value: 'priority', text: 'Sort by Priority' },
      { value: 'title', text: 'Sort by Title' },
    ];

    options.forEach((option) => {
      const optionEl = createEl(
        'option',
        {
          value: option.value,
        },
        option.text
      );

      sortDropdown.appendChild(optionEl);
    });

    sortContainer.appendChild(sortDropdown);

    // Add event listener for sort change
    sortDropdown.addEventListener('change', (e) => {
      this.sortOrder = e.target.value;
      this.render();
    });

    // Find the todo-actions div and append the sort container
    const todoActions = document.querySelector('.todo-actions');
    todoActions.appendChild(sortContainer);
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

  sortTodos(todos) {
    return [...todos].sort((a, b) => {
      switch (this.sortOrder) {
        case 'date':
          // Sort by due date (null dates at the end)
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);

        case 'priority':
          // Sort by priority (high > medium > low)
          const priorityValues = { high: 3, medium: 2, low: 1 };
          return priorityValues[b.priority] - priorityValues[a.priority];

        case 'title':
          // Sort alphabetically by title
          return a.title.localeCompare(b.title);

        default:
          return 0;
      }
    });
  }

  render() {
    clearEl(this.container);

    let todos = this.app.getTodosByProject(this.app.activeProject);

    // Sort todos based on current sort order
    todos = this.sortTodos(todos);

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

      // Todo header with checkbox and title
      const todoHeader = createEl('div', {
        className: 'todo-header',
      });

      // Checkbox
      const checkbox = createEl('input', {
        type: 'checkbox',
        className: 'todo-checkbox',
        checked: todo.completed,
      });

      // Title container
      const todoTitleContainer = createEl('div', {
        className: 'todo-title-container',
      });

      const todoTitle = createEl(
        'div',
        {
          className: 'todo-title',
        },
        todo.title
      );

      todoTitleContainer.appendChild(todoTitle);

      todoHeader.appendChild(checkbox);
      todoHeader.appendChild(todoTitleContainer);

      // Todo content section
      const todoContent = createEl('div', {
        className: 'todo-content',
      });

      // Description
      if (todo.description) {
        const todoDescription = createEl(
          'div',
          {
            className: 'todo-description',
          },
          todo.description
        );
        todoContent.appendChild(todoDescription);
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

      todoContent.appendChild(todoMeta);

      // Todo footer with priority and actions
      const todoFooter = createEl('div', {
        className: 'todo-footer',
      });

      const todoPriority = createEl(
        'div',
        {
          className: `todo-priority ${todo.priority}`,
        },
        todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
      );

      const todoActions = createEl('div', {
        className: 'todo-actions-btns',
      });

      const editButton = createEl('button', {
        className: 'btn secondary-btn icon-only todo-edit-btn',
        'aria-label': 'Edit task',
      });

      const editIcon = createEl('i', {
        className: 'fas fa-edit',
      });

      editButton.appendChild(editIcon);

      const deleteButton = createEl('button', {
        className: 'btn danger-btn icon-only todo-delete-btn',
        'aria-label': 'Delete task',
      });

      const deleteIcon = createEl('i', {
        className: 'fas fa-trash',
      });

      deleteButton.appendChild(deleteIcon);

      todoActions.appendChild(editButton);
      todoActions.appendChild(deleteButton);

      todoFooter.appendChild(todoPriority);
      todoFooter.appendChild(todoActions);

      // Assemble todo item
      todoItem.appendChild(todoHeader);
      todoItem.appendChild(todoContent);
      todoItem.appendChild(todoFooter);

      this.container.appendChild(todoItem);
    });
  }
}
