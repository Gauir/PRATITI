import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Import the CSS
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '', password: '', fname: '', lname: '',
    dob: '', designation: '', emp_email: '',
    personal_email: '', gender: 'Male', address: '', photo: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Create FormData instead of a plain object
    const data = new FormData();

    for (let key in formData) {
      if (key === 'photo') {
        // Add the file specifically
        data.append('photo', formData.photo);
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      // 4. Send with correct headers
      // Change this line in your Register.jsx
      const response = await axios.post('http://192.168.1.14:5000/users/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Success: " + response.data.message);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. See console for details.");
    }
  };

  return (
    <div className="register-container">
      <h2>Employee Registration</h2>
      <form className="register-form" onSubmit={handleSubmit}>

        <div className="input-group">
          <label>User ID</label>
          <input name="userId" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>First Name</label>
          <input name="fname" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input name="lname" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Date of Birth</label>
          <input name="dob" type="date" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Designation</label>
          <input name="designation" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Company Email</label>
          <input name="emp_email" type="email" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Personal Email</label>
          <input name="personal_email" type="email" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Gender</label>
          <select name="gender" onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-group full-width">
          <label>Address</label>
          <textarea name="address" rows="3" onChange={handleChange}></textarea>
        </div>

        <div className="input-group full-width">
          <label>Profile Picture</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
          />
        </div>

        <button type="submit" className="submit-btn">Register Employee</button>
      </form>
    </div>
  );
};

export default Register;