const validator = require('validator')
module.exports = app => {
    function notIsEmptyOrNull(userInfo, messageError) {
        if (!userInfo) throw messageError
    }
    function notExist(value, messageError) {
        if (value) throw messageError
    }
    function isString(userInfo, messageError) {
        if (validator.default.isNumeric(userInfo)) throw messageError
    }
    function isNumeric(userInfo, messageError) {
        if (!validator.default.isNumeric(userInfo)) throw messageError
    }
    function confirmPassword(userInfos, messageError) {
        const user = { ...userInfos }
        if (user.confirmPassword != user.password) throw messageError
    }
    function isEmail(email, messageError) {
        if (!validator.default.isEmail(email)) throw messageError
    }
    function isStrongPassword(password, messageError) {
        if (!validator.default.isStrongPassword(password, {
            "minLength": 8,
            "minLowercase": 1,
            "minUppercase": 1,
            "minNumbers": 1,
            "minSymbol": 1
        })) throw messageError
    }

    return { notIsEmptyOrNull, notExist, isString, isNumeric, confirmPassword, isEmail, isStrongPassword }
}