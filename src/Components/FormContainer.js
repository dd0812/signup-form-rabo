/**
 * Stateless Component. Renders based on props recieved from parent.
 */

import React from 'react';

export const FormContainer = ({isError, ...props}) => (
    <div className="form-group">
        <label>{props.label}</label>
        <input
            aria-label={props.label}
            className={isError[props.name].length > 0 ? "is-invalid form-control" : "form-control"}
            {...props}
        />
        {isError[props.name].length > 0 && (
            <span className="invalid-feedback">{isError[props.name]}</span>
        )}
    </div>
);