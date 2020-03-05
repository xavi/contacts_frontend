import React from 'react';

export default function ContactView(props) {
  const { contact, onEdit, onDelete } = props;
  const { first_name, last_name, phone, email } = contact;

  return (
    <div className="contact-view">
      <p>{first_name} {last_name}</p>
      <p>{phone}</p>
      <p>{email}</p>

      <div>
        <button
          type="button"
          className="link-button edit"
          onClick={onEdit}
        >
          edit
        </button>
        <button
          type="button"
          className="link-button"
          onClick={() => {
            if (window.confirm(`Delete ${first_name} ${last_name}?`)) {
              onDelete();
            }
          }}
        >
          delete
        </button>
      </div>
    </div>
  );
}
