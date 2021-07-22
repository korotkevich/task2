function createTaskHolderController() {
    const taskInput = document.getElementById('new-task')
    const addButton = document.getElementsByTagName('button')[0]
    const incompleteTasksHolder = document.getElementById('incomplete-tasks')
    const completedTasksHolder = document.getElementById('completed-tasks')
    const storage = window.localStorage

    return {

        initialize() {
            taskHolderController.getTasks()
            addButton.addEventListener('click', taskHolderController.addTask)

            completedTasksHolder.onclick = e => {
                taskHolderController.bindTaskEvents(e.target, taskHolderController.taskIncomplete)
            }

            incompleteTasksHolder.onclick = e => {
                taskHolderController.bindTaskEvents(e.target, taskHolderController.taskCompleted)
            }
        },

        updateStorage() {
            let store = []
            const todoList = [...document.getElementsByTagName('li')]
            todoList.forEach( e => {
                const listCheckbox = e.querySelectorAll('input[type=checkbox]')[0]
                const listLabel = e.getElementsByTagName('label')[0]
                const listState = {
                    checked: listCheckbox.checked,
                    name: listLabel.innerText,
                }
                store.push(listState)
            })

            storage.setItem('tasks', JSON.stringify(store))
        },

        createNewTaskElement(taskName, isChecked) {
            const listItem = taskHolderController.createElement('li')
            listItem.classList.add('section__list-item')
            const appendElements =
                [
                    {
                        tag: 'input',
                        attr: {
                            type: 'checkbox',
                            [isChecked ? 'checked' : null]: isChecked,
                            class: 'section__input checkbox',
                            'data-action': 'check'
                        }
                    },
                    {
                        tag: 'label',
                        attr: {
                            innerText: taskName,
                            class: 'section__label',

                        }
                    },
                    {
                        tag: 'input',
                        attr: {
                            type: 'text',
                            class: 'section__input text',
                        },

                    },
                    {
                        tag: 'button',
                        attr: {
                            innerText: 'Edit',
                            class: 'section__button edit',
                            'data-action': 'edit'
                        },

                    },
                    {
                        tag: 'button',
                        attr: {
                            innerText: 'Delete',
                            class: 'section__button delete',
                            'data-action': 'delete'
                        },

                    }
                ]
          return taskHolderController.appendElementWithElements(listItem, appendElements)
        },

        getTasks(){
            const tasks = JSON.parse(storage.getItem('tasks'))
            if (tasks) {
                tasks.forEach( e => {
                    const task = taskHolderController.createNewTaskElement(e.name, e.checked)
                    if (e.checked) {
                        completedTasksHolder.appendChild(task)
                    } else {
                        incompleteTasksHolder.appendChild(task)
                    }
                })
            }
        },

        addTask(){
            if (!taskInput.value.length) return
            const listItemName = taskInput.value
            const listItem = taskHolderController.createNewTaskElement(listItemName)
            incompleteTasksHolder.appendChild(listItem)
            taskInput.value = ''
            taskHolderController.updateStorage()
        },

        editTask(element){
            const listItem = element.parentNode
            const editInput = listItem.querySelectorAll('input[type=text]')[0]
            const label = listItem.getElementsByTagName('label')[0]
            const button = listItem.getElementsByTagName('button')[0]

            const containsClass = listItem.classList.contains('edit-mode')
            if (containsClass) {
                label.innerText = editInput.value
                button.innerText = 'Edit'
            } else {
                editInput.value = label.innerText
                button.innerText = 'Save'
            }
            listItem.classList.toggle('edit-mode')
            taskHolderController.updateStorage()
        },

        deleteTask(element){
            const listItem = element.parentNode
            const ul = listItem.parentNode
            ul.removeChild(listItem)
            taskHolderController.updateStorage()
        },

        taskCompleted(element) {
            const listItem = element.parentNode
            completedTasksHolder.appendChild(listItem)
            taskHolderController.updateStorage()
        },

        taskIncomplete(element) {
            const listItem = element.parentNode
            incompleteTasksHolder.appendChild(listItem)
            taskHolderController.updateStorage()
        },

        bindTaskEvents(element, checkBoxEventHandler){
            switch(element.dataset.action){
                case 'check':
                    checkBoxEventHandler(element);
                    break;

                case 'edit':
                    taskHolderController.editTask(element)
                    break;

                case 'delete':
                    taskHolderController.deleteTask(element);
                    break;
            }

           },

        createElement(tag, attributes = {}){
            const element = document.createElement(tag)
            for (let key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    if (key === 'innerText') {
                        element.innerText = attributes[key]
                    } else {
                        element.setAttribute(key, attributes[key])
                    }
                }
            }
            return element
        },

        appendElementWithElements(pushToElement, elements){
            elements.forEach( element => {
                pushToElement.appendChild(taskHolderController.createElement(element.tag, element.attr ?? {}))
            })
            return pushToElement
        }
    }
}

window.taskHolderController = createTaskHolderController()

window.taskHolderController.initialize()

