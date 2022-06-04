 import React from "react";

 
const mockPersons = [
    {
        uuid: 'randomuuid1',
        display: 'Ouest,port-au-prince',
        city:'GOnaives'
    },
    {
      uuid: 'randomuuid2',
      display: 'Artibonite',
      city:'Marmelade'

    },
    {
      uuid: 'randomuuid3',
      display: 'Ouest,petion-ville',
      city:'Ennery'

    },
    {
      uuid: 'randomuuid4',
      display: 'Centre',
      city:'Plaissance'

    },
  ];
  
   export const mockGetSearchResults = async (query: string) => {
    return mockPersons.filter(person => {
      return person.display.toUpperCase().includes(query.toUpperCase());
    });
  };




