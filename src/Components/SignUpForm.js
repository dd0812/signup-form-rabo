import React, { useState } from 'react';
import { FormContainer } from './FormContainer';
import { FormConfig } from './FormConfig';
import axios from 'axios';

const regExp = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
);
export const SignUpForm = () => {
    const formKeys = FormConfig.reduce((accumaltor, field) => {
        accumaltor = {...accumaltor, [field.name]: ''};
        return accumaltor;
    }, {});
    const [inputs, setInputs] = useState({...formKeys});
    const [isError, setIsError] = useState({...formKeys});

    const formValid = ({ isError, ...rest }) => {
        console.log('FormConfig', FormConfig)        
        Object.keys(rest).forEach(field => {
            const isRequiredField = FormConfig.find(f => f.name === field).required;
            console.log('FormConfig[field].required', isRequiredField);
            if(rest[field].length === 0 && isRequiredField) {
                isError[field] = `Please enter a value for ${field}`;
            }
        });
        if(validateFields(rest)) return false;
        return Object.keys(isError).every(eachField => isError[eachField].length === 0);
    };

    const clearFormFields = () => {
        setInputs({...formKeys});
    }

    async function userSignupPost(formValues) {
        try {
            const response = await axios.post('https://demo-api.now.sh/users', formValues);
            if (response) {
                alert('Form successfully submitted using POST');
            }
        } catch (err){
            console.error(err);
        }
    }

    async function userSignupGet(formValues) {
        try {
            const response = await axios.get('https://demo-api.now.sh/users', formValues);
            if (response) {
                alert('Form successfully submitted using GET');
                console.log(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const onSubmit = e => {
        e.preventDefault();
        const values = {...inputs, isError};
        const formData = new FormData();
        Object.keys(values).forEach(val => {
            formData.append(val, values[val]); //formData.append(fname, "Mike");
        });

        if (formValid(values)) {
            userSignupPost(formData)
            clearFormFields();
            setTimeout(function () {
                userSignupGet(formData)
            }, 4000);
        } else {
            setIsError({...isError});
            console.log("Form is invalid!");
        }
    };

    const validateFields = (values) => {
        let hasError = false;
        Object.keys(values).forEach(key => {
            const value = values[key];
            switch (key) {
                case "fname":
                    isError.fname =
                        value.length < 4 ? (hasError = true, "Atleast 4 characaters required for First Name") : "";
                    break;
                case "lname":
                    isError.lname =
                        value.length < 4 ? (hasError = true, "Atleast 4 characaters required for Last Name") : "";
                    break;
                case "email":
                    isError.email = regExp.test(value)
                        ? ""
                        : (hasError = true, "Email address is invalid");
                    break;
                case "password":
                    let errText = "";
                    const val = value.toLowerCase();
                    if (value.length < 8) {
                        errText = "Password must be at least 8 characaters long";
                    }
                    else if(!(value.split('').some(char => !parseInt(char) && char === char.toLowerCase()))){
                        errText = "Password should contain at least one lowercase letter";
                    }
                    else if(!(value.split('').some(char => !parseInt(char) && char === char.toUpperCase()))){
                        errText = "Password should contain at least one uppercase letter";
                    }
                    else if (inputs.fname.length > 0 &&  val.includes(inputs.fname.toLowerCase())) {
                        errText = "Password cannot contain users Firstname";
                    }  
                    else if (inputs.lname.length > 0 &&  val.includes(inputs.lname.toLowerCase())) {
                        errText = "Password cannot contain users Lastname";
                    }
                    isError.password = errText;
                    if(errText.length > 0) hasError = true;
                    break;
                default:
                    break;
            }
            setIsError(isError);
        });
        return hasError;
    }

    const onFieldChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        setInputs(inputs => ({...inputs, [name]: value}));
    };

    console.log('inputs', inputs);
    return (
        <form id="signup-form" onSubmit={onSubmit}>
            {
                FormConfig.map((formField, index) =>
                    <FormContainer
                        key={index}
                        value={inputs[formField.name]} //{getFieldValue(formField.name)}
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