const User = require('../db/models/users');
const { hashPassword, isPasswordCorrect } = require('../utils/utils');
const UserService = require('../users/service');

jest.mock('../db/models/users.js');

describe('User service tests', () => {

    const mockedUsers = [
        {
            username: 'zeed',
            gender: 'MALE'
        },
        {
            username: 'Bimbo',
            gender: 'FEMALE'
        }
    ]

    beforeEach(() => {
        User.findOne.mockResolvedValue({ username: 'zeed' });
        User.create.mockResolvedValue({ username: 'zeed', gender: 'MALE' });
        User.findAll.mockResolvedValue(mockedUsers);
    });

    describe('Test encryption and decryption', () => {
        const plainPassword = 'Password';

        test('hashed value should not be null and should not be equal to plain password', () => {
            const hashedString = hashPassword(plainPassword);
            expect(hashedString).not.toBe(null);
            expect(hashPassword).not.toBe(plainPassword);
        });

        test('hashed string should match plain string when compared', () => {
            const hashedString = hashPassword(plainPassword);
            expect(isPasswordCorrect(plainPassword, hashedString)).toBe(true);
        });

    });

    describe('User information', () => {

        test('user should not be null', async () => {
            const username = 'zeed';
            const user = await User.findOne({ where: { username: username } });
            expect(user).not.toBe(undefined);
            expect(user.username).toBe(username);
        });

        test('create user', async () => {
            User.findOne.mockResolvedValue(null);
            const username = 'zeed';
            const user = await User.findOne({ where: { username: username } });
            expect(user).toBe(null);
            const createdUser = await User.create({ username: username, gender: 'MALE' });
            expect(createdUser).not.toBe(null);
            expect(createdUser).not.toBe(undefined);
        });

        test('Signup user method should be successful', async () => {
            username = 'zeed';
            User.findOne.mockResolvedValue(null);
            const newUser = await UserService.signUp({ username: username, password: 'password', gender: 'MALE' });
            expect(newUser).not.toBe(null);
            expect(newUser).not.toBe(undefined);

        });

        test('Get all users should not be null and not be undefined', async () => {
            const users = await User.findAll();
            expect(users).not.toBe(null);
            expect(users).not.toBe(undefined);
            expect(users.length).toBe(2);
        });


    });



});
