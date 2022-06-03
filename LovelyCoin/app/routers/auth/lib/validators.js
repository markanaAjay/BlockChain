const validators = {};

validators.isEmailValid = (sEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sEmail);
}


module.exports = validators;
