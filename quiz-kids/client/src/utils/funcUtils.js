export const validateName = (input) => {
    let pattern = /^[A-Za-z]{1,}$/;
    if(input)
        return pattern.test(input) && input.trim()
    else return false;        
}

export const validatePassword = (pw) => {
    return /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw) &&
    pw.length > 4;
}

export const validateConfirmPassword = (pw, confirmPassword) => pw === confirmPassword;

export const validateMail = (input) => {
    return String(input)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export const validateUserName = (input) => {
    return /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(input);
}