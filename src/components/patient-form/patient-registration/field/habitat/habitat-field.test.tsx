// import React, { useContext } from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import '@testing-library/jest-dom';
// import { Formik, Form } from 'formik';

// import { GenderField } from './habitat-field.component';

// jest.mock('react', () => ({
//   ...(jest.requireActual('react') as any),
//   useContext: jest.fn(() => ({
//     setFieldValue: jest.fn(),
//   })),
// }));

// jest.mock('formik', () => ({
//   ...(jest.requireActual('formik') as any),
//   useField: jest.fn(() => [{}, {}]),
// }));

// describe('Habitat Field', () => {
//   const renderComponent = () => {
//     return render(
//       <Formik initialValues={{}} onSubmit={null}>
//         <Form>
//           <GenderField />
//         </Form>
//       </Formik>,
//     );
//   };

//   it('renders', () => {
//     expect(renderComponent()).not.toBeNull();
//   });

//   it('has a label', () => {
//     expect(renderComponent().getAllByText('Habitat')).toBeTruthy();
//   });

//   it('checks an option', () => {
//     const component = renderComponent();
//     fireEvent.click(component.getByLabelText('urbain'));
//     expect(component.getByLabelText('urbain')).toBeChecked();
//   });
// });
