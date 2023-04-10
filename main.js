const wrapper = document.querySelector('.wrapper')
const taskInput  = document.querySelector('.new-todo')
const tasksList = document.querySelector('.todo-list')
const count = document.querySelector('#count')
const toggleAll = document.querySelector(".toggleAll"); 
const todoItems = document.getElementsByClassName("todo-item"); 
const CHECKED = "checked";

//Массив задач
let tasks = []

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach( (task) => renderTask(task))
    renderTaskCount()
}


wrapper.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

//Функция добавления
function addTask(event){
    // Отменяет отправку формы
    event.preventDefault()

    //Достаем текст задачи из поля ввода
    const taskText = taskInput.value

    //Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    //Добавляем задачу в массив с задчами
    tasks.push(newTask)

    //Сохраняем список задач в хранилище LOcalStorage
    saveToLocalStorage()

    renderTask(newTask)

    //Очищаем поле ввода и возращаем на него фокус
    taskInput.value = ''
    taskInput.focus()
    renderTaskCount()
}

//Функция удаления
function deleteTask(event){
    //Если клик был Не по кнопке удалить задачу
    if (event.target.dataset.action !== 'delete')
        return 

    const parentNode = event.target.closest('.todo-item')

    //Определяем id задач
    const id = Number(parentNode.id)

    //Находим index задачи в массиве
    const index = tasks.findIndex( (task) => task.id === id)

    //Удаляем из массива
    tasks.splice(index, 1)

    //Сохраняем список задач в хранилище LOcalStorage
    saveToLocalStorage()

    //Удаляем задачу их разметки
    parentNode.remove()
    renderTaskCount()
}

//Функция выполнения задачи
function doneTask(event){
    //Если клик был Не по кнопке задача выполнена
    if (event.target.dataset.action !== 'done')
        return

    const parentNode = event.target.closest('.todo-item')

    //Определяем id задач
    const id = Number(parentNode.id)

    const task = tasks.find((task) => task.id === id)
    task.done = !task.done

    //Сохраняем список задач в хранилище LOcalStorage
    saveToLocalStorage()
    renderTaskCount()
    parentNode.classList.toggle('checked')
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
    
}

function renderTask(task){
    //Формируем css класс
    const cssClass = task.done ? 'todo-item checked' : 'todo-item'

    const taskHTML = `
        <li id="${task.id}" class="${cssClass}">
            <div class="view">
            <input type="checkbox" class="toogle" data-action="done">
            <label>${task.text}</label>
            <button class="destroy" data-action="delete"></button>
            </div>
        </li>`
    
    //Формируем разметку для новой задачи
    tasksList.insertAdjacentHTML('beforeend',taskHTML)
    
}

//Прослушивание клика кнопки toggleAll для выделения всех задач (сделать выполненными либо сбросить их) //
toggleAll.addEventListener("click", (e) => {
    // Меняем массив с элементами
    tasks.forEach((elem) => {
      elem.done = e.target.checked;
    });
  
    // Меняем отображение в html
    for (let item of todoItems) {
      if (e.target.checked) {
        item.classList.add("checked");
      } else {
        item.classList.remove("checked");
      }
    }
    saveToLocalStorage()
    renderTaskCount()
})

function renderTaskCount() {
    let counter = 0
    for (let i=0; i < todoItems.length; i++){
        if (!todoItems[i].classList.contains('checked'))
            counter++
    }
    count.innerHTML = counter
}

