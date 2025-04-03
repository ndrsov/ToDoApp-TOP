import Project from '../models/project';
import Todo from '../models/todo';
import Storage from '../storage';
import { generateId } from '../utils/dom-utils';
import ProjectList from './project-list';
import TodoList from './todo-list';
import TodoForm from './todo-form';
import ProjectForm from './project-form';

export default class App {
  constructor() {
    this.todos = [];
    this.projects = [];
    this.defaultProject = null;
    this.activeProject = null;

    this.initialize();

    // Initialize components
    this.projectList = new ProjectList(this);
    this.todoList = new TodoList(this);
    this.todoForm = new TodoForm(this);
    this.projectForm = new ProjectForm(this);

    // Render UI
    this.projectList.render();
    this.todoList.render();
  }

  initialize() {
    // Load data from localStorage
    this.loadData();

    // Create default project if none exists
    if (this.projects.length === 0) {
      this.defaultProject = new Project(generateId(), 'Default Project');
      this.projects.push(this.defaultProject);
      Storage.saveProjects(this.projects);
    } else {
      this.defaultProject = this.projects[0];
    }

    // Set active project
    const activeProjectId = Storage.getActiveProject();
    const activeProjectExists = this.projects.some(
      (p) => p.id === activeProjectId
    );

    this.activeProject = activeProjectExists
      ? activeProjectId
      : this.defaultProject.id;
  }

  loadData() {
    this.projects = Storage.getProjects();
    this.todos = Storage.getTodos();
  }

  // Project methods
  createProject(data) {
    const newProject = new Project(generateId(), data.name);
    this.projects.push(newProject);
    Storage.saveProjects(this.projects);

    // Set as active project
    this.activeProject = newProject.id;
    Storage.saveActiveProject(newProject.id);

    // Update UI
    this.projectList.render();
    this.todoList.render();
  }

  updateProject(projectId, data) {
    const project = this.getProjectById(projectId);
    if (project) {
      project.update(data.name);
      Storage.saveProjects(this.projects);

      // Update UI
      this.projectList.render();
    }
  }

  deleteProject(projectId) {
    // Can't delete default project
    if (projectId === this.defaultProject.id) return;

    // Delete project
    this.projects = this.projects.filter((p) => p.id !== projectId);

    // Delete associated todos
    this.todos = this.todos.filter((t) => t.projectId !== projectId);

    // Save changes
    Storage.saveProjects(this.projects);
    Storage.saveTodos(this.todos);

    // Set active project to default
    this.activeProject = this.defaultProject.id;
    Storage.saveActiveProject(this.activeProject);

    // Update UI
    this.projectList.render();
    this.todoList.render();
  }

  getProjectById(projectId) {
    return this.projects.find((p) => p.id === projectId);
  }

  // Todo methods
  createTodo(data) {
    const newTodo = new Todo(
      generateId(),
      data.title,
      data.description,
      data.dueDate,
      data.priority,
      false,
      this.activeProject
    );

    this.todos.push(newTodo);
    Storage.saveTodos(this.todos);

    // Update UI
    this.todoList.render();
  }

  updateTodo(todoId, data) {
    const todo = this.getTodoById(todoId);
    if (todo) {
      todo.update(data);
      Storage.saveTodos(this.todos);

      // Update UI
      this.todoList.render();
    }
  }

  deleteTodo(todoId) {
    this.todos = this.todos.filter((t) => t.id !== todoId);
    Storage.saveTodos(this.todos);

    // Update UI
    this.todoList.render();
  }

  toggleTodoComplete(todoId) {
    const todo = this.getTodoById(todoId);
    if (todo) {
      todo.toggleComplete();
      Storage.saveTodos(this.todos);

      // Update UI
      this.todoList.render();
    }
  }

  getTodoById(todoId) {
    return this.todos.find((t) => t.id === todoId);
  }

  getTodosByProject(projectId) {
    return this.todos.filter((t) => t.projectId === projectId);
  }
}
