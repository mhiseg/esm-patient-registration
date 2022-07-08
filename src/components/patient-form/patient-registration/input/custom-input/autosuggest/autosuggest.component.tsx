import React, { useEffect, useRef, useState } from 'react';
import styles from './autosuggest.scss';
import { useTranslation } from 'react-i18next';
import { Search, TextInput } from 'carbon-components-react';



interface AutosuggestProps {
  name: string;
  placeholder: string;
  value?:string ;
  getDisplayValue: Function;
  getFieldValue: Function;
  getSearchResults: (query: string) => Promise<any>;
  onSuggestionSelected: (field: string, value: string) => void;
}

export const Autosuggest: React.FC<AutosuggestProps> = ({
  name,
  placeholder,
  getDisplayValue,
  getFieldValue,
  value,
  getSearchResults,
  onSuggestionSelected,
  
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const searchBox = useRef(null);
  const wrapper = useRef(null);
  const { t } = useTranslation();



  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideComponent);
    searchBox.current.input.value= value || '';
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideComponent);
    };
  }, [wrapper,value]);

  const handleClickOutsideComponent = e => {

    if (wrapper.current && !wrapper.current.contains(e.target)) {
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query) {
      getSearchResults(query).then(suggestions => {
        setSuggestions(suggestions);
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleClick = (index: number) => {
    const display = getDisplayValue(suggestions[index]);
    const value = getFieldValue(suggestions[index]);
    searchBox.current.input.value = display;
    onSuggestionSelected(name, value);
    setSuggestions([]);
  };

  return (
    <div className={styles.autocomplete} ref={wrapper}>
      <Search
        name={name}
        id="autosuggest"
        placeholder={placeholder}
        labelText={""}
        onChange={handleChange}
        ref={searchBox}
        className={styles.autocompleteSearch}
        light={true}
        size="lg"
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={e => handleClick(index)}>
              {getDisplayValue(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
