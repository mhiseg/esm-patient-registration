import React from 'react';
import { Autosuggest } from './autosuggest.component';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

const mockPersons = [
  {
    uuid: 'randomuuid1',
    display: 'Ouest,port-au-prince',
  },
  {
    uuid: 'randomuuid2',
    display: 'Artibonite',
  },
  {
    uuid: 'randomuuid3',
    display: 'Ouest,petion-ville',
  },
  {
    uuid: 'randomuuid4',
    display: 'Centre',
  },
];

const mockGetSearchResults = async (query: string) => {
  return mockPersons.filter(person => {
    return person.display.toUpperCase().includes(query.toUpperCase());
  });
};
 
console.log(mockGetSearchResults);
const handleSuggestionSelected = jest.fn((field, value) => [field, value]);

describe('autosuggest', () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <Autosuggest
          name="departement"
          placeholder="Lieu de naissance"
          onSuggestionSelected={handleSuggestionSelected}
          getSearchResults={mockGetSearchResults}
          getDisplayValue={item => item.display}
          getFieldValue={item => item.uuid}
        />
      </BrowserRouter>,
    );
  };

  it('should render a input box', () => {
    setup();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('shows search results in an ul', async () => {
    setup();
    const searchbox = screen.getByRole('searchbox');
    fireEvent.change(searchbox, { target: { value: 'Ouest' } });
    const list = await waitFor(() => screen.getByRole('list'));
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(2);
  });

  it('creates li items whose inner text is gotten through getDisplayValue', async () => {
    setup();
    const searchbox = screen.getByRole('searchbox');
    fireEvent.change(searchbox, { target: { value: 'Ouest' } });
    const list = await waitFor(() => screen.getAllByRole('listitem'));
    expect(list[0].textContent).toBe('Ouest,port-au-prince');
    expect(list[1].textContent).toBe('Ouest,petion-ville');
  });

  it('triggers onSuggestionSelected with correct values when li is clicked', async () => {
    setup();
    const searchbox = screen.getByRole('searchbox');
    fireEvent.change(searchbox, { target: { value: 'Ouest' } });
    const listitems = await waitFor(() => screen.getAllByRole('listitem'));
    fireEvent.click(listitems[0]);
    expect(handleSuggestionSelected).toHaveBeenNthCalledWith(1, 'departement', 'randomuuid1');
  });

  it.skip('sets search box value to selected suggestion', async () => {
    setup();
    let searchbox = screen.getByRole('searchbox');
    fireEvent.change(searchbox, { target: { value: 'Ouest' } });
    const listitems = await waitFor(() => screen.getAllByRole('listitem'));
    fireEvent.click(listitems[0]);
    searchbox = screen.getByRole('searchbox');
    expect(searchbox.textContent).toBe('Ouest,petion-ville');
  });

  it('clears suggestions when a suggestion is selected', async () => {
    setup();
    let list = screen.queryByRole('list');
    expect(list).toBeNull();
    const searchbox = screen.getByRole('searchbox');
    fireEvent.change(searchbox, { target: { value: 'Ouest' } });
    list = await waitFor(() => screen.queryByRole('list'));
    console.log(list)
    expect(list).not.toBeInTheDocument();
    const listitems = screen.getAllByRole('listitem');
    fireEvent.click(listitems[0]);
    list = screen.queryByRole('list');
    expect(list).toBeNull();
  });
});
