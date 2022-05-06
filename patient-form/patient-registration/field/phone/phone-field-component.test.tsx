// describe.skip('text input', () => {
//     const setupInput = async () => {
//       render(
//         <Formik initialValues={{ text: '' }} onSubmit={null}>
//           <Form>
//             <Input id="text" labelText="Text" name="text" placeholder="Enter text" light />
//           </Form>
//         </Formik>,
//       );
//       return screen.getByLabelText('text') as HTMLInputElement;
//     };
  
//     it('exists', async () => {
//       const input = await setupInput();
//       expect(input.type).toEqual('text');
//     });
  
//     it('can input data', async () => {
//       const input = await setupInput();
//       const expected = 'Some text';
  
//       fireEvent.change(input, { target: { value: expected } });
//       fireEvent.blur(input);
  
//       await wait();
  
//       expect(input.value).toEqual(expected);
//     });
//   });
  