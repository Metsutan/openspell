const validNameChars = new RegExp(/^[A-Za-z0-9\s]+$/);
const validEmail = new RegExp(/^(.+@[.\S]+\.[.\S]+)$/);

/**
 * Checks if the username is in the correct format.
 * @param {*} usernameId The ID of the username field.
 * @param {*} statusMessageId The ID of the status message element.
 */
function checkUsername(usernameId, statusMessageId) {

    if (!usernameId) { return false; }

    const username = document.getElementById(usernameId).value;
    const statusMessage = (statusMessageId ? document.getElementById(statusMessageId) : null);
    let success;
    let message;

    if (username.length === 0) {
        // username is empty
        message = 'Please enter a username';
        success = false;
    } else if (username.charAt(0) === ' ') {
        // username starts with a space
        message = 'Username cannot begin with a space';
        success = false;
    //} else if (!isNaN(parseInt(username.charAt(0)))) {
    //    // username begins with a number
    //    message = 'Username cannot begin with a number';
    //    success = false;
    } else if (username.indexOf('  ') !== -1) {
        // username contains multiple spaces in a row
        message = 'Username cannot contain multiple adjacent spaces';
        success = false;
    } else if (!validNameChars.test(username)) {
        // username contains non-alphanumeric/non-space
        message = 'Username must only contain alphanumeric and spaces';
        success = false;
    } else {
        // username is ok
        message = '';
        success = true;
    }
    
    if (statusMessage) {
        statusMessage.innerHTML = message;
    }

    return success;
}

/**
 * Checks if an email is in the correct format.
 * @param {*} emailId The ID of the email field.
 * @param {*} statusMessageId The ID of the status message element.
 */
function checkEmail(emailId, statusMessageId) {
    if (!emailId) { return false; }

    const emailElement = document.getElementById(emailId);
    
    if (!emailElement) {
        // emails are disabled.
        return true;
    }

    const email = emailElement.value;
    const statusMessage = (statusMessageId) ? document.getElementById(statusMessageId) : null;
    let success;
    let message;

    if (email.length === 0) {
        // email is empty
        message = 'Please enter an email';
        success = false;
    } else if (!validEmail.test(email)) {
        // email is in invalid format
        message = 'Email format is invalid';
        success = false;
    } else {
        // email is ok
        message = '';
        success = true;
    }

    if (statusMessage) {
        statusMessage.innerHTML = message;
    }

    return success;
}

/**
 * Checks if the password and confirm password fields are correct.
 * @param {*} passwordId The ID of the password field.
 * @param {*} confirmPasswordId The ID of the confirm password field.
 * @param {*} statusMessageId The ID of the status message element.
 */
function checkPassword(passwordId, confirmPasswordId, statusMessageId) {

    if (!passwordId || !confirmPasswordId) { return false; }

    const statusMessage = (statusMessageId) ? document.getElementById(statusMessageId) : null;
    let success;
    let message;

    if (document.getElementById(passwordId).value.length === 0) {
        // password is empty
        message = 'Please enter a password';
        success = false;
    } else if (document.getElementById(confirmPasswordId).value.length === 0) {
        // confirm password is empty
        message = 'Please confirm your password';
        success = false;
    } else if (document.getElementById(passwordId).value !== document.getElementById(confirmPasswordId).value) {
        // password and confirm password dont match
        message = 'Passwords do not match';
        success = false;
    } else if (document.getElementById(passwordId).value.length < 8) {
        // password too short
        message = 'Password must contain at least 8 characters';
        success = false;
    } else {
        message = '';
        success = true;
    }

    if (statusMessage) {
        statusMessage.innerHTML = message;
    }
    
    return success;
}

/**
 * Checks if the captcha is correct.
 * @param {*} statusMessageId The ID of the status message element.
 */
function checkCaptcha(statusMessageId) {

    const statusMessage = (statusMessageId) ? document.getElementById(statusMessageId) : null;
    let success;
    let message;

    try {

        var isCaptchaDefined;

        try {
            isCaptchaDefined = (undefined !== grecaptcha);
        } catch (exception) {
            isCaptchaDefined = false;
        }

        var recaptchaResponseLength = 0;
        
        if (isCaptchaDefined) {
            recaptchaResponseLength = grecaptcha.getResponse();

            if (recaptchaResponseLength == 0) { 
                //reCaptcha not verified
                message = 'Please complete the captcha';
                success = false;
            } else {
                // captcha is successful
                message = '';
                success = true;
            }

        } else {
            // captcha is disabled
            message = '';
            sucess = true;
        }

    } catch (exception) {
        console.error(exception);
        message = 'Error loading captcha';
        success = false;
    }

    if (statusMessage) {
        statusMessage.innerHTML = message;
    }

    return success;
}

/**
 * Checks if the username field is empty or not
 * @param {*} usernameId The ID of the username field.
 * @param {*} statusMessageId The ID of the status message element.
 */
function checkUsernameNotEmpty(usernameId, statusMessageId) {

    if (!usernameId) { return false; }

    const statusMessage = (statusMessageId) ? document.getElementById(statusMessageId) : null;
    let success;
    let message;

    if (document.getElementById(usernameId).value.length === 0) {
        // username is empty
        message = 'Please enter your username';
        success = false;
    } else {
        message = '';
        success = true;
    }
    
    if (statusMessage) {
        statusMessage.innerHTML = message;
    }

    return success;
}

/**
 * Checks if the password field is empty or not.
 * @param {*} passwordId The ID of the password field.
 * @param {*} statusMessageId The ID of the status message element.
 */
function checkPasswordNotEmpty(passwordId, statusMessageId) {

    if (!passwordId) { return false; }

    const statusMessage = (statusMessageId) ? document.getElementById(statusMessageId) : null;
    let success;
    let message;

    if (document.getElementById(passwordId).value.length === 0) {
        // password is empty
        message = 'Please enter your password';
        success = false;
    } else {
        message = '';
        success = true;
    }
    
    if (statusMessage) {
        statusMessage.innerHTML = message;
    }

    return success;
}

/**
 * Checks if the 'accept terms & conditions' checkbox is checked or not.
 * @param {*} acceptTermsId The ID of the accept Terms checkbox.
 * @param {*} statusMessageId The ID of the status message element.
 */
function acceptedTerms(acceptTermsId, statusMessageId) {

    if (!acceptTermsId) { return false; }

    const statusMessage = (statusMessageId) ? document.getElementById(statusMessageId) : null;
    let success;
    let message;

    if (document.getElementById(acceptTermsId).checked) {
        // accepted the terms & conditions
        message = '';
        success = true;
    } else {
        // did not check the checkbox
        message = 'You must accept the Terms & Conditions and Privacy Policy in order to register an account';
        success = false;
    }

    if (statusMessage) {
        statusMessage.innerHTML = message;
    }

    return success;
}