const bcrypt = require('bcrypt');
module.exports = app => {
    function encryptPassword(password) {
        const salt = generateSalt()
        return bcrypt.hashSync(password, salt)
    }

    function generateSalt() {
        return bcrypt.genSaltSync(10)
    }
    return { encryptPassword }
}