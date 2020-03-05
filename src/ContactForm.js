import React, { useState } from 'react';

export default function ContactForm(props) {
  const {
    initialValues = { first_name: '', last_name: '', phone: '', email: '' },
    onSuccess,
    onCancel
  } = props;
  const [contact, setContact] = useState(initialValues);
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();

    const baseUrl = process.env.REACT_APP_API_URL;
    const url = contact.id ? `${baseUrl}/contacts/${contact.id}` : `${baseUrl}/contacts`
    const data = { contact };
    const options = {
      method: contact.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        onSuccess(json);
      } else {
        setErrors(json);
      };
    } catch (error) {
      window.alert(error);
    }
  };

  function handleInputChange(event) {
    const { target: { name, value } } = event;
    setContact({
      ...contact,
      [name]: value
    });
  }

  const { first_name, last_name, phone, email } = contact;
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div>
          <input
            name="first_name"
            type="text"
            placeholder="First"
            value={first_name || ''}
            onChange={handleInputChange} />
          <small className="error">{errors.first_name}</small>
        </div>
        <div>
          <input
            name="last_name"
            type="text"
            placeholder="Last"
            value={last_name || ''}
            onChange={handleInputChange} />
          <small className="error">{errors.last_name}</small>
        </div>
      </div>
      <div>
        <input
          name="phone"
          type="text"
          placeholder="Phone"
          value={phone || ''}
          onChange={handleInputChange} />
        <small className="error">{errors.phone}</small>
      </div>
      <div>
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={email || ''}
          onChange={handleInputChange} />
        <small className="error">{errors.email}</small>
      </div>
      <button>Save</button>
      <button type="button" className="link-button" onClick={onCancel}>Cancel</button>
    </form>  
  );
}
