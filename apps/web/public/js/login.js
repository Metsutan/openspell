(() => {
    const formId = 'loginform';
    const statusMessageId = 'status-message';
    const usernameId = 'username';
    const passwordId = 'password';
    const submitId = 'submit';

    function validateFields() {
        return (checkCaptcha(statusMessageId) && checkUsernameNotEmpty(usernameId, statusMessageId) && checkPasswordNotEmpty(passwordId, statusMessageId));
    }

    document.forms[formId].onsubmit = () => { document.getElementById(submitId).disabled = true; }
    document.forms[formId][submitId].onclick = () => { return validateFields(); }
});