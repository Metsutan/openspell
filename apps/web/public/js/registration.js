(() => {

    const formId = 'registerform';
    const statusMessageId = 'status-message';
    const usernameId = 'username';
    const emailId = 'email';
    const passwordId = 'password';
    const confirmPasswordId = 'confirm-password';
    const submitId = 'submit';
    const acceptTermsId = 'accept-terms';

    function validateFields() {
        try {
            return (checkCaptcha(statusMessageId) 
                && checkUsername(usernameId, statusMessageId) 
                && checkEmail(emailId, statusMessageId) 
                && checkPassword(passwordId, confirmPasswordId, statusMessageId)
                && acceptedTerms(acceptTermsId, statusMessageId)
            );
        } catch (exception) {
            console.error(exception);
            return false;
        }
    }

    document.forms[formId].onsubmit = () => { document.getElementById(submitId).disabled = true; }
    document.forms[formId][submitId].onclick = () => { return validateFields(); }

})();
