import React from 'react';
import {BrowserRouter as Router,Routes,Route}from 'react-router-dom'
import TaskPage from './TaskPage';
import LoginPage from './LoginPage';
import SignUp from './SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/tasks' element={<TaskPage />} />
      </Routes>
    </Router>
  )
}

export default App;
