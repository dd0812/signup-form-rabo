import { render, fireEvent } from '@testing-library/react';
import { FormContainer } from './FormContainer';
import { FormConfig } from './FormConfig';

const isError = {
    fname: '',
    lname: '',
    email: '',
    password: ''
}

const Container = () => (
    FormConfig.map((field, index) =>
        <FormContainer key={index} isError={isError} onChange={o => o} {...field} />
    )
)

const fields = render(<Container />);
const fNameTest = fields.getByLabelText(/First Name/i);
const lNameTest = fields.getByLabelText(/Last Name/i);
const pwdTest = fields.getByLabelText(/Password/i);
const emailTest = fields.getByLabelText(/Email/i);

test('Renders Form Field Labels', () => {
    // console.log(fields);
    expect(fNameTest).toBeInTheDocument();
    expect(lNameTest).toBeInTheDocument();
    expect(pwdTest).toBeInTheDocument();
    expect(emailTest).toBeInTheDocument();
});

test('Check Form Field Change events', () => {
    fireEvent.change(fNameTest, { target: { value: 'Mike' } });
    expect(fNameTest.value).toBe('Mike');
    fireEvent.change(lNameTest, { target: { value: 'Bean' } });
    expect(lNameTest.value).toBe('Bean');
    fireEvent.change(pwdTest, { target: { value: 'Abcd!123' } });
    expect(pwdTest.value).toBe('Abcd!123');
    fireEvent.change(emailTest, { target: { value: 'test@test.com' } });
    expect(emailTest.value).toBe('test@test.com');
});