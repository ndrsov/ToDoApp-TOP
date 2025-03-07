export default class Project {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.createdAt = new Date();
  }

  update(name) {
    this.name = name;
    return this;
  }
}
