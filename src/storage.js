import Todo from './models/todo';
import Project from './models/project';

// Local storage keys
const PROJECTS_STORAGE_KEY = 'todoapp_projects';
const TODOS_STORAGE_KEY = 'todoapp_todos';
const ACTIVE_PROJECT_KEY = 'todoapp_active_project';

export default class Storage {
  // Save all projects to localStorage
  static saveProjects(projects) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }

  // Get all projects from localStorage
  static getProjects() {
    const projectsData = localStorage.getItem(PROJECTS_STORAGE_KEY);

    if (!projectsData) {
      return [];
    }

    try {
      // Parse and convert back to Project objects
      return JSON.parse(projectsData).map((projectData) => {
        const project = new Project(projectData.id, projectData.name);
        project.createdAt = new Date(projectData.createdAt);
        return project;
      });
    } catch (error) {
      console.error('Error parsing projects from localStorage:', error);
      return [];
    }
  }

  // Save all todos to localStorage
  static saveTodos(todos) {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }

  // Get all todos from localStorage
  static getTodos() {
    const todosData = localStorage.getItem(TODOS_STORAGE_KEY);

    if (!todosData) {
      return [];
    }

    try {
      // Parse and convert back to Todo objects
      return JSON.parse(todosData).map((todoData) => {
        const todo = new Todo(
          todoData.id,
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
          todoData.completed,
          todoData.projectId
        );
        todo.createdAt = new Date(todoData.createdAt);
        return todo;
      });
    } catch (error) {
      console.error('Error parsing todos from localStorage:', error);
      return [];
    }
  }

  // Save active project ID
  static saveActiveProject(projectId) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
  }

  // Get active project ID
  static getActiveProject() {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  }

  // Completely reset storage (for testing or clearing app data)
  static clearStorage() {
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
    localStorage.removeItem(TODOS_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}
