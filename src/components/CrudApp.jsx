import React, { useState, useEffect } from 'react';

const apiUrl = 'https://jsonplaceholder.typicode.com/users'; // Open API URL

const CrudApp = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', email: '' });
  const [editItem, setEditItem] = useState(null);

  // Fetch all items from the API
  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Create a new item using fetch
  const addItem = () => {
    if (newItem.name && newItem.email) {
      fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(newItem),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((newUser) => {
          // Add the newly created user (from the API response) to the state
          setData([...data, newUser]);  // Add newUser here to the state
          setNewItem({ name: '', email: '' }); // Reset form fields
        })
        .catch((error) => console.error('Error adding item:', error));
    }
  };

  // Update an item using fetch
  const updateItem = () => {
    if (editItem && editItem.name && editItem.email) {
      fetch(`${apiUrl}/${editItem.id}`, {
        method: 'PUT',
        body: JSON.stringify(editItem),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((updatedItem) => {
          // Update the existing item in the state
          setData(data.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ));
          setEditItem(null);
        })
        .catch((error) => console.error('Error updating item:', error));
    }
  };

  // Delete an item using fetch
  const deleteItem = (id) => {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const filteredData = data.filter((item) => item.id !== id);
        setData(filteredData);
      })
      .catch((error) => console.error('Error deleting item:', error));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto' }}>
      <h2>CRUD App with Open API</h2>

      <div>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newItem.email}
          onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
        />
        <button onClick={addItem}>Add User</button>
      </div>

      <h3>Users List</h3>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {editItem && editItem.id === item.id ? (
              <>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={(e) =>
                    setEditItem({ ...editItem, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  value={editItem.email}
                  onChange={(e) =>
                    setEditItem({ ...editItem, email: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <span>{item.name} - {item.email}</span>
              </>
            )}
            <button onClick={() => deleteItem(item.id)}>Delete</button>
            {editItem && editItem.id === item.id ? (
              <button onClick={updateItem}>Update</button>
            ) : (
              <button onClick={() => setEditItem(item)}>Edit</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudApp;
