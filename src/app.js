import { Button } from 'bootstrap';
import { getDataFromApi, addTaskToApi, deleteTaskToApi } from './data';

class PomodoroApp {
  constructor(options) {
    let {
      tableTbodySelector,
      taskFormSelector,
      deleteButtonSelector,
      addTaskButtonSelector,
    } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$deleteButton = document.querySelectorAll(deleteButtonSelector);
    this.$addTaskButton = document.getElementById('addTaskButton');
  }

  addTask(task) {
    this.$addTaskButton.innerHTML = 'Loading...';
    this.$addTaskButton.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$addTaskButton.innerHTML = 'Add Task';
        this.$addTaskButton.disabled = false;
        this.deleteRows();
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `<th scope="row"><h6></h6></th><td>${task.title}</td><button type="button" name="deleteButton" id="${task.id}" class="delete btn btn-danger"><i class="fa fa-trash"></i></button>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  getDeleteButtons() {
    return document.querySelectorAll('.delete');
  }

  deleteRows() {
    getDataFromApi().then(() => {
      let buttons = this.getDeleteButtons();
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          deleteTaskToApi(button.id).then(button.parentElement.remove());
        });
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
    //this.deleteRows();
  }
}

export default PomodoroApp;
