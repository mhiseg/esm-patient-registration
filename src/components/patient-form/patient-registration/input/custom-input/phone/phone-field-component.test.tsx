// import React from 'react';
// import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// import { Formik, Form } from 'formik';
// import { PhoneInput } from './phone-field.component';



// describe('text input to be normalized', () => {
//   const setPhoneValue = jest.fn();
//   const setupInput = async () => {
//     render(
//       <Formik initialValues={{ phone: '' }} onSubmit={null}>
//         <Form>
//           <PhoneInput id="phone" name="phone" placeholder="Phone" setPhoneValue={setPhoneValue} />
//         </Form>
//       </Formik>,
//     );
//     return screen.getByPlaceholderText('Phone') as HTMLInputElement;
//   };

//   it('exists', async () => {
//     const input = await setupInput();
//     expect(input.type).toEqual('tel');
//   });

//   it('is formated', async () => {
//     const input = await setupInput();
//     const expected = '+(509) 4650-3243';

//     fireEvent.change(input, { target: { value: expected } });
//     fireEvent.blur(input);

//     await waitFor(()=>{
//       expect(input.value).toEqual(expected);
//     });
    
//   });

//   it('Phone number most be valide', async () => {                                   
//     const input = await setupInput();
//     const expected = '+(509)2';

//     fireEvent.change(input, { target: { value: expected } });
//     fireEvent.blur(input);

//     await waitFor(() => {
//       expect(screen.getByText('Format de telephone non valide')).toBeInTheDocument();
//     });
//   });

//   it('Expect setPhoneValue to have been called', async () => {  
//     await waitFor(() => {
//       expect(setPhoneValue).toHaveBeenCalled();
//     });
//   });




// });
