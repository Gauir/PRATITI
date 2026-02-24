import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Register from './Components/Register';
import AboutUs from './Components/AboutUs';
import AdminHomePage from './Components/AdminHomePage';
import { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import EmpHomePage from './Components/EmpHomePage';


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element= {<HomePage/>} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/login" element={<Login onLoginSuccess={(u) => setUser(u)}/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/admin-home" element={<AdminHomePage/>} />
        <Route path = "/emp-home" element = {<EmpHomePage/>} />
      </Routes>
    </Router>
  );
}

export default App;