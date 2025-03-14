import { clearEl, createEl } from '../utils/dom-utils';
import Storage from '../storage';

export default class ProjectList {
  constructor(app) {
    this.app = app;
    this.projectContainer = document.querySelector('#projects-list');
    this.bindEvents();
  }

  bindEvents() {
    // Delegate event handling for project items
    this.projectContainer.addEventListener('clidk', (e) => {
      const projectItem = e.target.closest('.project-item');
      if (projectItem) {
        const projectId = projectItem.dataset.id;
        this.selectProject(projectId);
      }
    });

    // New Project button
    document.querySelector('#new-project-btn').addEventListener('click', () => {
      this.app.projectForm.open();
    });

    // Edit Project button
    document
      .querySelector('#edit-project-btn')
      .addEventListener('click', () => {
        this.app.projectForm.open(this.app.activeProject);
      });
    // Delete Project button
    document
      .querySelector('#delete-project-btn')
      .addEventListener('click', () => {
        if (
          confirm(
            'Are you sure you want to delete this project and all its tasks?'
          )
        ) {
          this.app.deleteProject(this.app.activeProject);
        }
      });
  }

  render() {
    clearEl(this.projectContainer);

    this.app.projects.forEach((project) => {
      const projectItem = createEl('div', {
        className: `project-item ${
          project.id === this.app.activeProject ? 'active' : ''
        }`,
        'data-id': project.id,
      });

      const icon = createEl('i', {
        className: 'fas fa-list',
      });

      const name = createEl('span', {}, project.name);

      projectItem.appendChild(icon);
      projectItem.appendChild(name);
      this.projectContainer.appendChild(projectItem);
    });

    // Update current project name
    const currentProject = this.app.projects.find(
      (p) => p.id === this.app.activeProject
    );
    if (currentProject) {
      document.querySelector('#current-project-title').textContent =
        currentProject.name;
    }

    // Hide dlete button if default project
    const isDefaultProject =
      this.app.activeProject === this.app.defaultProject.id;
    document.querySelector('#delete-project-btn').style.display =
      isDefaultProject ? 'none' : 'inline-flex';
  }

  selectProject(projectId) {
    this.app.activeProject = projectId;
    Storage.saveActiveProject(projectId);
    this.render();
    this.app.todoList.render();
  }
}
