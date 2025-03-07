export default class Todo {
  constructor(
    id,
    title,
    description = '',
    dueDate = null,
    priority = 'medium',
    completed = false,
    projectId
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
    this.projectId = projectId;
    this.createdAt = new Date();
  }

  toggleComplete() {
    this.completed = !this.completed;
    return this;
  }

  update(data) {
    this.title = data.title || this.title;
    this.description =
      data.description !== undefined ? data.description : this.description;
    this.dueDate = data.dueDate !== undefined ? data.dueDate : this.dueDate;
    this.priority = data.priority || this.priority;
    return this;
  }
}
