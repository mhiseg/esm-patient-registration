import React from 'react';
import { AddressField } from './field/address/address-field.component';
import BirthPlace from './field/birthplace/birthPlace';
import { DobField } from './field/dob/dob.component';
import { GenderField } from './field/gender/gender-field.component';
import { HabitatField } from './field/habitat/habitat-field.component';
import { IdField } from './field/id/id-field.component';
import { IdSelect } from './field/id/identifier-selection-overlay';
import { NameField } from './field/name/firstname-field.component';
import { LastNameField } from './field/name/lastname-field.component';
import { OccupationSelect } from './field/occupation/occuptation-field-component';
import { PhoneField } from './field/phone/phone-field.component'
import ResidenceField from './field/residence/residence';
import { StatuField } from './field/statu/statu-selection-overlay';
import { Unknow } from './input/custom-input/unknow-format-component';



// const FieldForm = (name) =>{
//   switch (name) {

// case 'cob':
//   return <CobField />;

//     case 'residence':
//       return <ResidenceField />;


//     case 'cob':
//       return <CobField />;


const FieldForm = (name: string) => {
  switch (name) {
    case 'firstName':
      return <NameField/>
    case 'lastName':
      return <LastNameField />;
    case 'idType':
      return <IdSelect />;
    case 'idValue':
      return <IdField />;
    case 'gender':
      return <GenderField />;
    case 'habitat':
      return <HabitatField />;
    case 'statu':
      return <StatuField />;
    case 'occupation':
      return <OccupationSelect />;
    case 'phone':
      return <PhoneField />;
    case 'address':
      return <AddressField />;
    case 'residence':
      return <ResidenceField />;
    case 'birthPlace':
      return <BirthPlace />;
    default:
      return <Unknow />;
  }
}

export default FieldForm;
