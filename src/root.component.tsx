import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Patient } from './components/patient-form/patient-registration/patient-registration-types';
import PatientRegistration from './patient-registration-component';


const RootComponent: React.FC = () => {
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
