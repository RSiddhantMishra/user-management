import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', address: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:8090/api/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await axios.put(`http://localhost:8090/api/users/${editingUser.id}`, userForm);
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...userForm } : user));
      setEditingUser(null);
    } else {
      const response = await axios.post('http://localhost:8090/api/users', userForm);
      setUsers([...users, response.data]);
    }
    setUserForm({ name: '', email: '', address: '' });
    window.location.reload(); // Refresh the page
  };

  const editUser = (user) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, address: user.address });
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8090/api/users/${id}`);
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <>
      <form className="styled-form" onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="name">Name : </label>
          <input type="text" name="name" placeholder="Your Name ..." value={userForm.name} onChange={handleChange} required />
        </div>
        <div class="form-group">
          <label for="email">Email : </label>
          <input type="email" name="email" placeholder="Your Email ..." value={userForm.email} onChange={handleChange} required />
        </div>
        <div class="form-group">
          <label for="address">Address : </label>
          <input type="text" name="address" placeholder="Your Address ..." value={userForm.address} onChange={handleChange} required />
        </div>
        <button type="submit">{editingUser ? 'Update' : 'Submit'}</button>
      </form>

      <table className="table-container">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td><button onClick={() => editUser(user)}>Edit</button></td>
              <td><button onClick={() => deleteUser(user.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserList;