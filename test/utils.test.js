const utils = require('../utils/utils');
const User = require('../db/models/users');

const Logger = require('../logger');


describe('Util tests', () => {

    Logger.info("About to run test");
    Logger.warn("Warning");

    test('should test password matches', () => {
        const testPassword = "password";
        encryptedPassword = utils.hashPassword(testPassword);
        expect(encryptedPassword).not.toBeNull();

        expect(utils.isPasswordCorrect(testPassword, encryptedPassword)).toBe(true)

    });

});