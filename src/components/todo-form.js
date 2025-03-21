import { showModal, hideModal, formatDateForInput } from '../utils/dom-utils';

export default class TodoForm {
  constructor(app) {
    this.app = app;
    this.form = document.getElementById('todo-form');
    this.modal = document.getElementById('todo-modal');
    this.modalTitle = document.getElementById('todo-modal-title');
    this.currentTodo = null;

    this.bindEvents();
  }

  bindEvents() {
    // Form submit
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.save();
    });

    // Cancel button
    document.getElementById('cancel-todo-btn').addEventListener('click', () => {
      this.close();
    });

    // Close modal button
    document
      .getElementById('close-todo-modal')
      .addEventListener('click', () => {
        this.close();
      });

    // Close on click outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  open(todo = null) {
    this.currentTodo = todo;

    // Reset form
    this.form.reset();

    // Set modal title
    this.modalTitle.textContent = todo ? 'Edit Task' : 'New Task';

    // Populate form if editing
    if (todo) {
      document.getElementById('todo-title').value = todo.title;
      document.getElementById('todo-description').value =
        todo.description || '';

      if (todo.dueDate) {
        document.getElementById('todo-due-date').value = formatDateForInput(
          todo.dueDate
        );
      }

      document.getElementById('todo-priority').value = todo.priority;
    }

    // Show modal
    showModal('todo-modal');
    document.getElementById('todo-title').focus();
  }

  close() {
    hideModal('todo-modal');
    this.currentTodo = null;
  }

  save() {
    const formData = {
      title: document.getElementById('todo-title').value,
      description: document.getElementById('todo-description').value,
      dueDate: document.getElementById('todo-due-date').value,
      priority: document.getElementById('todo-priority').value,
    };

    if (this.currentTodo) {
      // Update existing todo
      this.app.updateTodo(this.currentTodo.id, formData);
    } else {
      // Create new todo
      this.app.createTodo(formData);
    }

    this.close();
  }
}
