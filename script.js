// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to form elements
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Function to create a task card
    function createTaskCard(name, desc, deadline, id) {
        // Create the card container
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.setAttribute('data-id', id);

        // Create elements for task details
        const taskInfo = document.createElement('div');
        const taskName = document.createElement('h3');
        taskName.textContent = name;
        const taskDesc = document.createElement('p');
        taskDesc.textContent = desc;
        const taskDeadline = document.createElement('p');
        taskDeadline.textContent = `Date limite: ${deadline}`;

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';

        // Append task details and delete button to the card
        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskDesc);
        taskInfo.appendChild(taskDeadline);
        taskCard.appendChild(taskInfo);
        taskCard.appendChild(deleteButton);

        // Add delete button event listener
        deleteButton.addEventListener('click', () => {
            deleteTask(id, taskCard);
        });

        // Prepend the task card to the task list
        taskList.prepend(taskCard);
    }

    // Function to fetch tasks from API
    function fetchTasks() {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => {
                    // Assuming JSONPlaceholder returns tasks with "title" and "id"
                    createTaskCard(task.title, 'Description par défaut', '2024-12-31', task.id);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Handle form submission
    taskForm.addEventListener('submit', (event) => {
        // Prevent default form submission
        event.preventDefault();

        // Get values from form inputs
        const taskName = document.getElementById('task-name').value;
        const taskDesc = document.getElementById('task-desc').value;
        const taskDeadline = document.getElementById('task-deadline').value;

        // Add new task to the API and task list
        addTask(taskName, taskDesc, taskDeadline);
    });

    // Function to add task via API
    function addTask(name, desc, deadline) {
        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: name,
                completed: false,
            }),
        })
            .then(response => response.json())
            .then(task => {
                // Add the new task to the task list
                createTaskCard(task.title, desc, deadline, task.id);
                // Clear form inputs after submission
                taskForm.reset();
            })
            .catch(error => console.error('Error adding task:', error));
    }

    // Function to delete task via API
    function deleteTask(id, taskCard) {
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Remove the task card from the task list
                taskCard.remove();
            })
            .catch(error => console.error('Error deleting task:', error));
    }

    // Fetch existing tasks when the page loads
    fetchTasks();
});