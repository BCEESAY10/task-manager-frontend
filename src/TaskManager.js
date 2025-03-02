import React, {useState, useEffect} from 'react'

function TaskManager(){

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("")


     // Fetch tasks from the backend
     useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const response = await fetch("http://localhost:8000/tasks/");
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    function handleInputChange(event){
        setNewTask(event.target.value);
    }

    async function addTask(){
        if (newTask.trim() === "") return;

        try {
            const response = await fetch("http://localhost:8000/tasks/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newTask, completed: false }),
            });

            const result = await response.json();
            setTasks([...tasks, result.task]); 
            setNewTask(""); 
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }

    async function deleteTask(index) {
        const taskToDelete = tasks[index];

        try {
            await fetch(`http://localhost:8000/tasks/${taskToDelete.id}`, {
                method: "DELETE",
            });

            setTasks(tasks.filter((_, i) => i !== index)); 
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    async function toggleStatus(index) {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;

        try {
            await fetch(`http://localhost:8000/tasks/${tasks[index].id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: updatedTasks[index].completed }),
            });

            setTasks(updatedTasks); // Update the UI
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    async function modifyTask(index) {
        const newTitle = prompt("Enter new task title:", tasks[index].title);
        if (!newTitle) return;

        const updatedTasks = [...tasks];
        updatedTasks[index].title = newTitle;

        try {
            await fetch(`http://localhost:8000/tasks/${tasks[index].id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newTitle }),
            });

            setTasks(updatedTasks); // Update UI
        } catch (error) {
            console.error("Error modifying task:", error);
        }
    }


    return(
        <>
            <div className='task-manager'>
                <h1>Task Manager</h1>

                <div className='content'>
                    <input type='text' placeholder='Enter a task' value={newTask} onChange={handleInputChange} />
                    <button className='add-btn' onClick={addTask}>Add</button>
                </div>
                <ul>
                    {tasks.map((task, index) => 
                    <li key={index}>
                        <button className={`status-btn ${task.completed ? 'completed' : 'pending'}`} onClick={() => toggleStatus(index)}>{task.completed ? "Completed" : "Pending"}</button>
                        <span className='text'>{task.title}</span>
                        <button className='edit-btn' onClick={() => modifyTask(index)}>Modify</button>
                        <button className='del-btn' onClick={() => deleteTask(index)}>Delete</button>
                    </li>)}
                </ul>
            </div>
        </>
    )
}

export default TaskManager;