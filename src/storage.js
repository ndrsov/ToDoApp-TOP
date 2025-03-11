import Todo from './models/todo';
import Project from './models/project';

// Main localStorage keys
const PROJECTS_STORAGE_KEY = 'todoapp_projects';
const TODOS_STORAGE_KEY = 'todoapp_todos';
const ACTIVE_PROJECT_KEY = 'todoapp_active_project';

export default class Storage {
  // Save projects to localStorage
  static saveProjects(projects) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }

  // Get projects from localStorage
  static getProjects() {
    const projectData = localStorage.getItem(PROJECTS_STORAGE_KEY);

    if (!projectData) {
      return [];
    }

    try {
      return JSON.parse(projectData).map((projectDate) =>
        Object.assign(new Project(), projectData)
      );
    } catch (err) {
      console.error('Error parsing projects from localStorage', err);
      return [];
    }
  }

  //   Save todos to localStorage
  static saveTodos(todos) {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }

  // Get todos from localStorage
  static getTodos() {
    const todosData = localStorage.getItem(TODOS_STORAGE_KEY);

    if (!todosData) {
      return [];
    }

    try {
      return JSON.parse(todosData).map((todoData) =>
        Object.assign(new Todo(), todoData)
      );
    } catch (err) {
      console.error('Error parsing todos from localStorage', err);
      return [];
    }
  }

  // Save and get active project id
  static saveActiveProject(projectId) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
  }

  static getActiveProject() {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  }

  // Reset storage

  static clearStorage() {
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
    localStorage.removeItem(TODOS_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}
