const bcrypt = require('bcrypt');

const hashPassword = (text) => {
    return bcrypt.hashSync(text, 10);
}

const isPasswordCorrect = (plainText, hashedPassword) => {
    console.log(bcrypt.compareSync(plainText, hashedPassword))
    return bcrypt.compareSync(plainText, hashedPassword)
}

module.exports = {hashPassword, isPasswordCorrect};