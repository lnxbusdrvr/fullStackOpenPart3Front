import { useState, useEffect } from 'react';

import Header from './components/Header';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/PersonsComponent';
import Notifier from './components/Notifier';

import personService from './services/PersonsService';

import Footer from './components/Footer';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
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

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      personService
        .update(existingPerson.id, { ...existingPerson, number: newNumber })
        .then(newPerson => {
          setPersons(persons.map(oldP => oldP.id === existingPerson.id ? newPerson : oldP));
          setNotifyMessage(`Modified ${newName}`);
          setIsError(false);
          setTimeout(() => { setNotifyMessage(null); }, 5000);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setNotifyMessage(error.response.data.error);
          setIsError(true);
          setTimeout(() => { setNotifyMessage(null); }, 5000);
        });
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons( persons.concat(returnedPerson) );
          setNotifyMessage(`Added ${newName}`);
          setIsError(false);
          setTimeout(() => { setNotifyMessage(null); }, 5000);
          setNewName('');
          setNewNumber('');
        }).catch(error => {
          setNotifyMessage(error.response.data.error);
          setIsError(true);
          setTimeout(() => { setNotifyMessage(null); }, 5000);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const filterPersons = persons
    .filter(p => p.name.toLowerCase().includes(newFilter.toLowerCase()));

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .erase(id)
        .then(() => {
          setNotifyMessage(`Deleted ${name}`);
          setIsError(false);
          setTimeout(() => { setNotifyMessage(null); }, 5000);
          setPersons(persons.filter(p => p.id !== id));
        })
        .catch(() => {
          setNotifyMessage(`Information of '${name}' has already been removed from the server`);
          setIsError(true);
          setTimeout(() => { setNotifyMessage(null); }, 5000);
          setPersons(persons.filter(p => p.id !== id));
        }).catch(error => {
          // This should not be happend while using normally frontend
          setNotifyMessage(error.response.data.error);
          setIsError(true);
          setTimeout(() => { setNotifyMessage(null); }, 5000);
        });
    }
  };

  return (
    <div>
      <Header app="Phonebook" />

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
      <Footer app="Phonebook app" school="fullstackopen.com & Open University of Helsinki" year="2024" />
    </div>
  );
};

export default App;

