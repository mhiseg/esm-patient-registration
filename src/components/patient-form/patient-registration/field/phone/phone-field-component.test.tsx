import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { PhoneField } from '../../field/phone/phone-field.component'


describe('text input to be normalized', () => {
  const mockSetFieldValue = jest.fn();
  console.log(mockSetFieldValue)
  const setupInput = async () => {
    render(
      <Formik initialValues={{ phone: '' }} onSubmit={null}>
        <Form>
          <PhoneField id="phone" name="phone" placeholder="Phone" setPhoneValue={mockSetFieldValue.mockReturnValueOnce(true)} />
        </Form>
      </Formik>,
    );
    return screen.getByPlaceholderText('Phone') as HTMLInputElement;
  };

  it('exists', async () => {
    const input = await setupInput();
    expect(input.type).toEqual('tel');
  });

  it('is formated', async () => {
    const input = await setupInput();
    const expected = '+(509)4650-3243';

    fireEvent.change(input, { target: { value: expected } });
    fireEvent.blur(input);

    await waitFor(()=>{
      expect(input.value).toEqual(expected);
    });

    
  });

  // it('Failure test', async () => {
  //   const invalid = screen.queryByTestId('Phone');                                    
  //   const invalidText = screen.queryByTestId('Phone');
  //   console.log(screen)
  //   const input = await setupInput();
  //   const expected = '+(509)2';

  //   fireEvent.change(input, { target: { value: expected } });
  //   fireEvent.blur(input);

  //   await waitFor(() => {
  //     expect(invalid.textContent).toBe(true);
  //     expect(invalidText.textContent).toMatch('Format de telephone non valide');
  //   });
  // });




});






