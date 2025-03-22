import { showModal, hideModal } from '../utils/dom-utils';

export default class ProjectForm {
  constructor(app) {
    this.app = app;
    this.form = document.getElementById('project-form');
    this.modal = document.getElementById('project-modal');
    this.modalTitle = document.getElementById('project-modal-title');
    this.currentProject = null;

    this.bindEvents();
  }

  bindEvents() {
    // Form submit
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.save();
    });

    // Cancel button
    document
      .getElementById('cancel-project-btn')
      .addEventListener('click', () => {
        this.close();
      });

    // Close modal button
    document
      .getElementById('close-project-modal')
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

  open(projectId = null) {
    // Reset form
    this.form.reset();

    if (projectId) {
      this.currentProject = projectId;
      const project = this.app.getProjectById(projectId);

      // Set modal title
      this.modalTitle.textContent = 'Edit Project';

      // Populate form
      document.getElementById('project-name').value = project.name;
    } else {
      this.currentProject = null;
      this.modalTitle.textContent = 'New Project';
    }

    // Show modal
    showModal('project-modal');
    document.getElementById('project-name').focus();
  }

  close() {
    hideModal('project-modal');
    this.currentProject = null;
  }

  save() {
    const name = document.getElementById('project-name').value;

    if (this.currentProject) {
      // Update existing project
      this.app.updateProject(this.currentProject, { name });
    } else {
      // Create new project
      this.app.createProject({ name });
    }

    this.close();
  }
}
