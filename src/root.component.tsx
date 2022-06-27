import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PatientRegistration from './patient-registration-component';


const RootComponent: React.FC = () => {
  alert(0)
  return (
    <BrowserRouter basename={`${window.spaBase}/death`}>
      <Route exact path="/patient"  component={PatientRegistration} />
      <Route exact path='/patient/:patientUuid'>
    		<PatientRegistration />
    	</Route>
    </BrowserRouter>
  );
};

export default RootComponent;
