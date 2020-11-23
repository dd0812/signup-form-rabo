import React, { useState } from 'react';
import { FormContainer } from './FormContainer';
import { FormConfig } from './FormConfig';
import axios from 'axios';

const regExp = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
);
const pwdRegEx = RegExp(
    /^[a-zA-Z0-9!@#$%^&*.]{8,16}$/
);
export const SignUpForm = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState({
        fname: '',
        lname: '',
        email: '',
        password: ''
    });

    const formValid = ({ isError, ...rest }) => {
        // console.log('formData before post ==>', {...rest});
        return Object.keys(isError).every(eachField => rest[eachField].length > 0 && isError[eachField].length === 0);
    };

    const clearFormFields = () => {
        setFname('');
        setLname('');
        setPassword('');
        setEmail('');
    }

    async function userSignupPost(formValues) {
        return await axios.post('https://demo-api.now.sh/users', formValues)
    }

    async function userSignupGet(formValues) {
        return await axios.get('https://demo-api.now.sh/users', formValues)
    }

    const onSubmit = e => {
        e.preventDefault();
        const values = { fname, lname, email, password, isError };
        const formData = new FormData();
        Object.keys(values).forEach(val => {
            formData.append(val, values[val]); //formData.append(fname, "Mike");
        });

        if (formValid(values)) {
            userSignupPost(formData)
            .then(function (res) {
                alert('Form successfully submitted using POST');
                clearFormFields();
                setTimeout(function(){
                    userSignupGet(formData).then(function (res) {
                        alert('Form successfully submitted using GET');
                    }).catch(err => console.log(err));
                }, 4000);
            }).catch(err => console.log(err));
        } else {
            console.log("Form is invalid!");
        }
    };

    const onFieldChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        switch (name) {
            case "fname":
                isError.fname =
                    value.length < 4 ? "Atleast 4 characaters required for First Name" : "";
                setFname(value);
                break;
            case "lname":
                isError.lname =
                    value.length < 4 ? "Atleast 4 characaters required for Last Name" : "";
                setLname(value);
                break;
            case "email":
                isError.email = regExp.test(value)
                    ? ""
                    : "Email address is invalid";
                setEmail(value);
                break;
            case "password":
                let errText = "";
                if(!pwdRegEx.test(value)){
                    errText =  "Password must be between 8 to 16 characaters long";
                }else if(value.toUpperCase().indexOf(fname.toUpperCase()) > -1 ){
                    errText =  "Password cannot contain users Firstname";
                }else if(value.toUpperCase().indexOf(lname.toUpperCase()) > -1){
                    errText =  "Password cannot contain users Lastname";
                }
                isError.password = errText;
                setPassword(value);
                break;
            default:
                break;
        }
        setIsError(isError);
    };

    const getFieldValue = (name) => {
        switch (name) {
            case "fname":
                return fname;
            case "lname":
                return lname;
            case "email":
                return email;
            case "password":
                return password;
            default:
                return '';
        }
    }

    return (
        <form onSubmit={onSubmit} id="signup-form">
            {
                FormConfig.map((formField, index) =>
                    <FormContainer
                        key={index}
                        value={getFieldValue(formField.name)}
                        type={formField.type}
                        name={formField.name}
                        label={formField.label}
                        onChange={onFieldChange}
                        isError={isError}
                        {...formField}
                    />
                )
            }
            <button type="submit" className="btn btn-block btn-danger">Sign Up</button>
        </form>
    );
}