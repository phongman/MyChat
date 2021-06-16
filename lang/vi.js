export const transValidation = {
    email_incorrect: "Invalid email",
    gender_incorrect: "Invalid gender",
    password_incorrect: "Invalid password",
    password_confirm_incorrect: "wrong password",
}

export const transErrors = {
    account_in_use: "Email is used",
    account_deleted: "Account is deleted",
    account_not_active: "Account is not activated"
}   

export const transSuccess = {
    user_created: (userEmail) => {
        return `Account <strong>${userEmail}<strong> created success`;
    }
}