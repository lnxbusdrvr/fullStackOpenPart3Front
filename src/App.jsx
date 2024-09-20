import { useState, useEffect } from 'react';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/PersonsComponent';
import Notifier from './components/Notifier';

import personService from './services/PersonsService';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [notifyMessage, setNotifyMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const addPhonebook = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons( persons.concat(returnedPerson) );
        setNotifyMessage(`Added ${newName}`);
        setIsError(false);
        setTimeout(() => {setNotifyMessage(null)}, 5000);
        setNewName('');
        setNewNumber('');
      });
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilter = (event) => {
    setNewFilter(event.target.value);
  }

  const filterPersons = persons
    .filter(p => p.name.toLowerCase().includes(newFilter.toLowerCase()));

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .erase(id)
        .then(() => {
          setNotifyMessage(`Deleted ${name}`);
          setIsError(false);
          setTimeout(() => {setNotifyMessage(null)}, 5000);
          setPersons(persons.filter(p => p.id !== id));
        })
        .catch(() => {
          setNotifyMessage(`Information of '${name}' has already been removed from the server`);
          setIsError(true);
          setTimeout(() => {setNotifyMessage(null)}, 5000);
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notifyMessage && <Notifier message={notifyMessage} isError={isError} />}

      <Filter handleFilter={handleFilter} />

      <h3>add a new</h3>
      <PersonForm
        addPhonebook={addPhonebook}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      <Persons filterPersons={filterPersons} handleDelete={handleDelete} />
    </div>
  );
}

export default App;

