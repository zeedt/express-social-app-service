const utils = require('../utils/utils');
const User = require('../db/models/users');

const Logger = require('../logger');

jest.mock('../db/models/users.js');


describe('Outer', () => {

    Logger.info("About to run test");
    Logger.warn("Warning");

    test('test password util matches', () => {
        const testPassword = "password";
        encryptedPassword = utils.hashPassword(testPassword);
        expect(encryptedPassword).not.toBeNull();

        expect(utils.isPasswordCorrect(testPassword, encryptedPassword)).toBe(true)

    });


    test('Test USer object', async () => {
        console.log("test user object");
        User.findOne.mockResolvedValue({username:'zeed',password:'password'})
        const user = await User.findOne({ where: { username: 'zeed' } });
        expect(user).not.toBeNull();
        expect(user.username).toBe('zeed');
    });

    describe('testing', () => {
        console.log("Testing")
        it('should not be null;', () => {
            expect(4).not.toBeNull();
        });

        it('should fetch user', async () => {
        User.findOne.mockResolvedValue({username:'zeed',password:'password'})
        const user = await User.findOne({ where: { username: 'zeed' } });
            expect(user).not.toBeNull();
            expect(user.username).toBe('zeed');
        });

    });

    describe('Mock User Object', () => {

        it('should confirm user returned Olamide', async () => {
            User.findOne.mockResolvedValue({username:'zeed',password:'password'})
            const user = await User.findOne();
            console.log('user ' + JSON.stringify(user))
            expect(user.username).toBe('zeed');
            // expect(await User.findOne({where:{username:'zeed'}}).username).toBe('zeed');
        });


    });



});