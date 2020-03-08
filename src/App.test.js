import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import App from './App';

const contact = {
  id: 1, first_name: 'John', last_name: 'Doe', phone: '+1 424 555 0100', email: 'john@example.com'
};

function mockFetch(data) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data
    })
  );
}

test('New button should allow to save a new contact and display it on the list',  async () => {
  window.fetch = mockFetch([]);

  const { getByText, getByPlaceholderText } = render(<App />);
  const newButton = getByText('New');

  fireEvent.click(newButton);

  fireEvent.change(getByPlaceholderText(/first/i), { target: { value: contact.first_name } });
  fireEvent.change(getByPlaceholderText(/last/i), { target: { value: contact.last_name } });
  fireEvent.change(getByPlaceholderText(/phone/i), { target: { value: contact.phone } });
  fireEvent.change(getByPlaceholderText(/email/i), { target: { value: contact.email } });

  window.fetch = mockFetch(contact);
  fireEvent.click(getByText('Save'));

  await wait(() => {
    expect(getByText(`${contact.first_name} ${contact.last_name}`)).toBeInTheDocument();
    expect(getByText(contact.phone)).toBeInTheDocument();
    expect(getByText(contact.email)).toBeInTheDocument();
  });
});

describe('edit and delete', () => {
  beforeEach(() => {
    window.fetch = mockFetch([contact]);
  });

  test('Edit should allow to update a contact and display it on the list', async () => {
    const { getByDisplayValue, getByText } = render(<App />);

    await wait(() => {
      const editButton = getByText('edit');
      fireEvent.click(editButton);
    });

    const updatedContact = {
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe',
      phone: '+1 424 555 0101',
      email: 'jane@example.com'
    };

    fireEvent.change(getByDisplayValue(contact.first_name), {
      target: { value: updatedContact.first_name }
    });
    fireEvent.change(getByDisplayValue(contact.last_name), {
      target: { value: updatedContact.last_name }
    });
    fireEvent.change(getByDisplayValue(contact.phone), {
      target: { value: updatedContact.phone }
    });
    fireEvent.change(getByDisplayValue(contact.email), {
      target: { value: updatedContact.email }
    });

    window.fetch = mockFetch(updatedContact);
    fireEvent.click(getByText('Save'));

    await wait(() => {
      expect(
        getByText(`${updatedContact.first_name} ${updatedContact.last_name}`)
      ).toBeInTheDocument();
      expect(getByText(updatedContact.phone)).toBeInTheDocument();
      expect(getByText(updatedContact.email)).toBeInTheDocument();
    });
  });

  test('Delete option should delete a contact, removing it from the list', async () => {
    const { getByText, queryByText } = render(<App />);

    await wait(() => {
      const deleteButton = getByText('delete');

      // Makes window.confirm automatically return true, as if OK had been clicked
      window.confirm = jest.fn(() => true);
      fireEvent.click(deleteButton);
    });

    await wait(() => {
      expect(queryByText(`${contact.first_name} ${contact.last_name}`)).not.toBeInTheDocument();
    });
  });
});
