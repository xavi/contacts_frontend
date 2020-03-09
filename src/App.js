import React, { useState, useEffect } from 'react';
import './App.css';
import ContactForm from './ContactForm';
import ContactView from './ContactView';

function App() {
  const [contacts, setContacts] = useState(null);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${baseUrl}/contacts`);
        if (response.ok) {
          const json = await response.json();
          setContacts(json);
        } else {
          window.alert(`:(\n${response.status} ${response.statusText}`);
        }
      } catch (error) {
        window.alert(error);
      }
    }

    fetchData();
  }, []);

  function handleCreatedContact(createdContact) {
    setContacts((oldContacts) => [createdContact, ...oldContacts]);
    setDraft(null);
  }

  function handleUpdatedContact(updatedContact) {
    setContacts((oldContacts) => (
      oldContacts.map((oldContact) => (
        oldContact.id === updatedContact.id ? updatedContact : oldContact
      ))
    ));
    setDraft(null);
  }

  async function deleteContact(id) {
    const options = { method: 'DELETE' };
    const baseUrl = process.env.REACT_APP_API_URL;
    const response = await fetch(`${baseUrl}/contacts/${id}`, options);
    if (response.ok) {
      setContacts(oldContacts => oldContacts.filter(contact => contact.id !== id));
    } else {
      window.alert(':(\nOops, there was an error deleting the contact.');
    }
  }

  return (
    <div>
      {draft !== null && !draft.id ? (
        <ContactForm
          onSuccess={handleCreatedContact}
          onCancel={() => setDraft(null)}
        />
      ) : (
        <button onClick={() => setDraft({})}>New</button>
      )}

      {contacts === null
        ? <p>Loading contacts...</p>
        : <div className="contacts">
            {contacts.map(contact => (
              <div key={contact.id} className="contact">
                {draft !== null && draft.id === contact.id ? (
                  <ContactForm
                    initialValues={contact}
                    onSuccess={handleUpdatedContact}
                    onCancel={() => setDraft(null)}
                  />
                ) : (
                  <ContactView
                    contact={contact}
                    onEdit={() => setDraft(contact)}
                    onDelete={() => deleteContact(contact.id)}
                  />
                )}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

export default App;
