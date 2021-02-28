export const FormConfig = [
    {
        type: "text",
        name: "fname",
        label: "First Name",
        required: true
    },
    {
        type: "text",
        name: "lname",
        label: "Last Name",
        required: true
    },
    {
        type: "password",
        name: "password",
        label: "Password",
        title: "Should be a minimum of 8 characters\nShould contain lower and uppercase letters\nShould not contain user’s first or last name",
        required: true
    },
    {
        type: "email",
        name: "email",
        label: "Email",
        required: true
    },
    {
        type: "number",
        name: "phone",
        label: "Phone",
        required: false
    }
]