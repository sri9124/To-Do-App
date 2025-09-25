import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACK_URI || 'http://localhost:5000';

function TaskPage() {
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newTimeAmPm, setNewTimeAmPm] = useState("AM");


  const [todos, setTodos] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const navigate = useNavigate();


  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingData, setEditingData] = useState({
    text: '',
    description: '',
    date: '',
    time: '',
    timeAmPm: 'AM',
  });

  const api = axios.create({
    baseURL: API_URL,
    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchTodos = async () => {
    try {
      const response = await api.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/');
      }
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !newDate.trim() || !newTime.trim()) {
      alert("Task title, date, and time are required.");
      return;
    }
    try {
      const response = await api.post("/api/todos", {
        text: newTodo,
        description: newDescription,
        date: newDate,
        time: newTime,
        timeAmPm: newTimeAmPm,
      });
      setTodos([response.data, ...todos]);
      setNewTodo('');
      setNewDescription('');
      setNewDate('');
      setNewTime('');
      setNewTimeAmPm('AM');
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id, currentCompleted) => {
    try {
      const response = await api.patch(`/api/todos/${id}`, { completed: !currentCompleted });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, completed: response.data.completed } : todo
      ));
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodoId(todo._id);
    setEditingData({
      text: todo.text,
      description: todo.description,
      date: formatDisplayDate(todo.date),
      time: todo.time,
      timeAmPm: todo.timeAmPm || 'AM',
    });
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingData({ text: '', description: '', date: '', time: '', timeAmPm: 'AM' });
  };

  const handleUpdateTodo = async (id) => {
    if (!editingData.text.trim()) {
      alert("Title cannot be empty.");
      return;
    }
    try {
      const response = await api.patch(`/api/todos/${id}`, editingData);
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
      cancelEditing();
    } catch (error) {
      console.error("Error updating todo:", error.response?.data || error.message);
      alert(`Failed to update task: ${error.response?.data?.msg || 'Please check console'}`);
    }
  };

  const toggleExpand = (id) => {
    if (editingTodoId === id) return;
    setExpandedTask(expandedTask === id ? null : id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString.split('T')[0];
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-8 border-6 border-[#c0c0c0]">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <button
            onClick={handleLogout}
            className='text-red-500 underline cursor-pointer italic font-bold text-lg'
          >Logout</button>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTodo} className="space-y-3 mb-6">
          <input className="w-full outline-none px-3 py-2 border rounded" type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Task title" required />
          <input className="w-full outline-none px-3 py-2 border rounded" type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Task description" />
          <div className="flex gap-2">
            <input
              className="w-1/2 outline-none px-3 py-2 border rounded"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
            <input
              className="flex-grow outline-none px-3 py-2 border rounded"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
            />
            <select
              className="outline-none px-3 py-2 border rounded bg-white"
              value={newTimeAmPm}
              onChange={(e) => setNewTimeAmPm(e.target.value)}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <button
            type="submit"
            onClick={addTodo}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white w-full font-semibold"
          > Add Task</button>
        </form>

        {/* Todo List */}
        <div className="todo-list max-h-80 overflow-y-auto pr-2">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks yet. Add one above!</p>
          ) : (
            <ul className="space-y-3">


              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className={`bg-gray-100 p-3 rounded-lg shadow-sm transition-opacity ${todo.completed ? 'opacity-60' : ''}`}>
                  {editingTodoId === todo._id ? (
                    <div className="w-full space-y-2">
                      <input
                        type="text"
                        value={editingData.text}
                        onChange={(e) => setEditingData({ ...editingData, text: e.target.value })}
                        className="w-full outline-none px-3 py-2 border rounded font-semibold"
                      />
                      <textarea
                        value={editingData.description}
                        onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                        className="w-full outline-none px-3 py-2 border rounded"
                        placeholder="Description"
                      />
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={editingData.date}
                          onChange={(e) => setEditingData({ ...editingData, date: e.target.value })}
                          className="w-1/2 outline-none px-3 py-2 border rounded"
                        />
                        <input
                          type="time"
                          value={editingData.time}
                          onChange={(e) => setEditingData({ ...editingData, time: e.target.value })}
                          className="flex-grow outline-none px-3 py-2 border rounded"
                        />
                        <select
                          value={editingData.timeAmPm}
                          onChange={(e) => setEditingData({ ...editingData, timeAmPm: e.target.value })}
                          className="outline-none px-3 py-2 border rounded bg-white"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateTodo(todo._id)}
                          className="text-green-500 hover:text-green-700 p-1"
                          title="Save"
                        ><FaSave size={20} /></button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          title="Cancel"
                        ><FaTimes size={20} /></button>
                      </div>
                    </div>
                  ) : (

                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo._id, todo.completed)}
                            className="form-checkbox h-5 w-5 text-blue-600 flex-shrink-0"
                          />
                          <span
                            onClick={() => !todo.completed && toggleExpand(todo._id)}
                            className={`cursor-pointer text-gray-800 text-lg truncate ${todo.completed ? 'line-through' : ''}`}
                          >{todo.text}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => startEditing(todo)} disabled={todo.completed}
                            className="text-blue-500 hover:text-blue-700 p-1 disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Edit"
                          ><FaEdit size={18} /></button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            disabled={todo.completed}
                            className="text-red-500 hover:text-red-700 p-1 disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Delete"
                          ><FaTrash size={18} /></button>
                        </div>
                      </div>
                      {expandedTask === todo._id && (
                        <div className="mt-2 pl-8 text-gray-600 text-sm">
                          <p>
                            <span className="font-semibold">Description:</span> {todo.description || "No description"}
                          </p>
                          <p>
                            <span className="font-semibold">Date:</span> {formatDisplayDate(todo.date)}
                          </p>
                          <p>
                            <span className="font-semibold">Time:</span> {todo.time ? `${todo.time} ${todo.timeAmPm || ''}`.trim() : "Not set"}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskPage;