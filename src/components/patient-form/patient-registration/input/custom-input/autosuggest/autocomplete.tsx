 import React from "react";

 
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
  
   export const mockGetSearchResults = async (query: string) => {
    return mockPersons.filter(person => {
      return person.display.toUpperCase().includes(query.toUpperCase());
    });
  };




