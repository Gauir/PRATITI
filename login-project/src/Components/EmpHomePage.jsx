import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EmpHomePage() {
    const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();

    // This must match your Express Server port
    const BACKEND_URL = "http://192.168.1.14:5000";

    useEffect(() => {
        const data = localStorage.getItem('loggedInUser');
        if (data) {
            setEmployee(JSON.parse(data));
        } else {
            // If someone tries to access this page without logging in, send them back
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    // Function to convert Buffer to Base64
    const getImageSrc = (blobData) => {
        if (!blobData) return null;

        // If your backend sends the buffer as an array of numbers
        const binary = String.fromCharCode.apply(null, new Uint8Array(blobData.data || blobData));
        const base64String = window.btoa(binary);

        return `data:image/jpeg;base64,${base64String}`;
    };

    const convertToBase64 = (bufferData) => {
        // Check if the data exists
        if (!bufferData) return null;

        // MySQL/Node often sends BLOBs as an object with a 'data' property (Uint8Array)
        const binaryData = bufferData.data || bufferData;

        // Convert the array of bytes into a string
        let binary = '';
        const bytes = new Uint8Array(binaryData);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        // Convert that string to Base64
        return `data:image/jpeg;base64,${window.btoa(binary)}`;
    };

    if (!employee) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Employee Dashboard</h1>
            </header>

            <div style={styles.card}>
                <div style={styles.imageSection}>
                    {employee.profile_pic ? (
                        <img
                            // Use our conversion function here
                            src={convertToBase64(employee.profile_pic)}
                            alt="Profile"
                            style={styles.profileImg}
                            onError={(e) => {
                                console.log("Conversion failed");
                                e.target.src = "https://via.placeholder.com/150?text=Error";
                            }}
                        />
                    ) : (
                        <div style={styles.placeholder}>No Photo Available</div>
                    )}
                </div>

                <div style={styles.infoSection}>
                    <h2>{employee.fname} {employee.lname}</h2>
                    <p><strong>Employee ID:</strong> {employee.userId}</p>
                    <p><strong>Designation:</strong> {employee.designation}</p>
                    <p><strong>Company Email:</strong> {employee.emp_email}</p>
                    <p><strong>Personal Email:</strong> {employee.personal_email}</p>
                    <p>
                        <strong>Date of Birth:</strong> {employee.dob ? employee.dob.split('T')[0] : 'N/A'}
                    </p>
                    <p><strong>Gender:</strong> {employee.gender}</p>
                    <p><strong>Address:</strong> {employee.address}</p>
                    <p><strong>Role:</strong> {employee.isAdmin ? 'Administrator' : 'Staff'}</p>
                </div>
            </div>
        </div>
    );
}

// Basic inline styles for clarity
const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', marginBottom: '20px' },
    card: { display: 'flex', gap: '30px', backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
    profileImg: { width: '180px', height: '180px', borderRadius: '10px', objectFit: 'cover', border: '3px solid #fff' },
    placeholder: { width: '180px', height: '180px', backgroundColor: '#ddd', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
    infoSection: { lineHeight: '1.6' }
};

export default EmpHomePage;