import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(null);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const [triggerEffect, setTriggerEffect] = useState(false);

  const createUser = async (event) => {
    event.preventDefault();
    await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) });
    setTriggerEffect(true);
    setNewName("");
    setNewAge("");
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
    setTriggerEffect(true);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    setTriggerEffect(true);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
    setTriggerEffect(false);
  }, [triggerEffect]);

  return (
    <div className="App">
      <h1>Type below to create a user</h1>
      <form onSubmit={createUser}>
        <input
          placeholder="Name..."
          value={newName}
          onChange={(event) => {
            setNewName(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age..."
          value={newAge}
          onChange={(event) => {
            setNewAge(event.target.value);
          }}
        />
        <button type="submit">Create User</button>
      </form>
      {users.map((user) => {
        return (
          <div>
            <h1>Name: {user.name}</h1>
            <h1>Age: {user.age}</h1>
            <button
              onClick={() => {
                updateUser(user.id, user.age);
              }}
            >
              Increase Age
            </button>
            <button onClick={() => deleteUser(user.id)}>Delete User</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
