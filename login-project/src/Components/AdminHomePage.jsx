import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminHomePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://192.168.1.14:5000/users/all');
      setEmployees(response.data);
      // Optional: Select the first employee by default
      if (response.data.length > 0) setSelectedEmployee(response.data[0]);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const convertToBase64 = (bufferData) => {
    if (!bufferData) return "https://via.placeholder.com/150";
    const binaryData = bufferData.data || bufferData;
    const bytes = new Uint8Array(binaryData);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/jpeg;base64,${window.btoa(binary)}`;
  };

  const handleDelete = async (userId) => {
    // 1. Get the current logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // 2. SAFETY CHECK: Prevent self-deletion
    if (userId === loggedInUser.userId) {
        return alert("You cannot delete your own admin account! If you need to resign, please contact another administrator.");
    }

    // 3. CONFIRMATION: Only proceed if they say yes
    if (window.confirm(`Are you sure you want to delete employee ${userId}? This action cannot be undone.`)) {
        try {
            await axios.delete(`http://localhost:5000/users/delete/${userId}`);
            
            // Update the UI list
            const updatedList = employees.filter(emp => emp.userId !== userId);
            setEmployees(updatedList);
            
            // Clear the detail panel
            setSelectedEmployee(null);
            
            alert("Employee record has been permanently removed.");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Error: Could not complete the deletion.");
        }
    }
};

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={{ margin: 0 }}>Employees</h2>
          <div style={styles.countBox}>
            <span style={styles.countLabel}>Total : {employees.length}</span>
          </div>
        </div>

        <div style={styles.listScroll}>
          {employees.map((emp) => (
            <div
              key={emp.userId}
              style={{
                ...styles.card,
                borderLeft: selectedEmployee?.userId === emp.userId ? '5px solid #68397e' : '5px solid transparent',
                backgroundColor: selectedEmployee?.userId === emp.userId ? '#e9ecef' : '#fff'
              }}
              onClick={() => setSelectedEmployee(emp)}
            >
              <img src={convertToBase64(emp.profile_pic)} alt="User" style={styles.cardImg} />
              <div style={styles.cardText}>
                <div style={styles.cardName}>{emp.fname} {emp.lname}</div>
                <div style={styles.cardSubText}>ID: {emp.userId}</div>
                <div style={styles.cardSubText}>{emp.emp_email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: FULL INFORMATION */}
      <div style={styles.detailView}>
        {selectedEmployee ? (
          <div style={styles.profileBox}>
            <div style={styles.profileHeader}>
              <img
                src={convertToBase64(selectedEmployee.profile_pic)}
                alt="Profile"
                style={styles.largeImg}
              />
              <h1>{selectedEmployee.fname} {selectedEmployee.lname}</h1>
            </div>
            <hr />
            <div style={styles.infoGrid}>
              <p><strong>User ID:</strong> {selectedEmployee.userId}</p>
              <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
              <p><strong>Work Email:</strong> {selectedEmployee.emp_email}</p>
              <p><strong>Personal Email:</strong> {selectedEmployee.personal_email}</p>
              <p>
                <strong>Date of Birth:</strong> {selectedEmployee.dob ? selectedEmployee.dob.split('T')[0] : 'N/A'}
              </p>
              <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
              <p><strong>Address:</strong> {selectedEmployee.address}</p>
              <p><strong>Account Type:</strong> {selectedEmployee.isAdmin ? 'Admin' : 'Employee'}</p>
            </div>
            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <button
                onClick={() => handleDelete(selectedEmployee.userId)}
                style={styles.deleteBtnLarge}
              >
                Delete Employee Record
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.noSelection}>Select an employee to view details</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: { display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' },
  sidebar: { width: '35%', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' },
  listScroll: { overflowY: 'auto', flex: 1 },
  card: { display: 'flex', padding: '15px', margin: '10px', cursor: 'pointer', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: '0.3s' },
  cardImg: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px' },
  cardText: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  cardName: { fontWeight: 'bold', fontSize: '1.1rem' },
  cardSubText: { fontSize: '0.85rem', color: '#666' },
  detailView: { width: '65%', padding: '40px', overflowY: 'auto' },
  profileBox: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  profileHeader: { textAlign: 'center', marginBottom: '20px' },
  largeImg: { width: '180px', height: '180px', borderRadius: '15px', objectFit: 'cover', marginBottom: '15px', border: '5px solid #f8f9fa' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' },
  noSelection: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#999', fontSize: '1.2rem' },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 15px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff'
  },
  countBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#68397e',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '8px',
    minWidth: '100px',
    boxShadow: '0 2px 4px rgba(102, 60, 112, 0.3)'
  },
  countLabel: {
    fontSize: '1.2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 'bold',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBtnLarge: {
    backgroundColor: '#e41598',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s'
},

};

export default AdminHomePage;