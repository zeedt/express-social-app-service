const User = require('../db/models/users');
const sequelize = require('../db/index').Sequelize;
const util = require('../utils/utils');
const Logger = require('../logger');
const fs = require('fs');
const { AccessToken } = require('../authentication/db/models')
const Op = require('../db/index').Sequelize.Op;
const fn = require('../db/index').Sequelize.fn;
const col = require('../db/index').Sequelize.col;

const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage }).single('file');

const arrayBufferToBase64 = (buffer) => {
    try {
        return new Buffer(buffer, 'binary').toString('base64');
    } catch (e) {
        console.log('Error ' + e);
        return 'Unable to get base 64 string';
    }
};

const UserService = () => {

    const signUp = async (signUpData) => {
        try {
            const user = await User.findOne({ where: { username: signUpData.username } });
            if (user != null) {
                throw new Error("User already exist");
            }
            signUpData.password = util.hashPassword(signUpData.password);
            var newUser = await User.create(signUpData);
            return newUser;
        } catch (e) {
            console.error("Error occurred due to " + e.message);
            throw new Error(e);
        }
    }

    const loadUsers = async (currentUser) => {

        try {
            var userList = await User.findAll({
                attributes: ['username', 'first_name', 'last_name','display_picture', 'email']
            });
            userList = userList.filter(u=>u.username!=currentUser);
            return { successful: true, users: userList }
        } catch (e) {
            Logger.error("Error occurred while loading users due to ", e);
            return { successful: false, message: e.message }
        }

    }

    const saveUserDisplayPicture = async (id, filePath) => {
        const user = await User.findByPk(id);
        if (user === undefined || user === null) {
            return { successful: false, message: 'User not found' }
        }

        user.display_picture = filePath;
        await User.update({ display_picture: filePath }, { where: { id: id } });
        return { successful: true, display_picture : filePath }
    }

    const uploadImage = multer({ storage: storage }).single('file');

    const loadDisplayPictureForUser = async (id) => {
        const user = await User.findByPk(id);
        if (user === undefined || user === null) {
            return { successful: false, message: 'User not found' }
        }
        const fileData = fs.readFileSync(user.display_picture);
        return { successful: true, data: arrayBufferToBase64(fileData) };

    }

    const logout = async (userId) => {
        await AccessToken.destroy({ where: { userId: userId } });
        return true;
    }

    const updateUserInfo = async (data, loggedInUserName) => {

        const user = await User.findOne({ where: { username: loggedInUserName } });
        if (user == null) {
            return { successful: false, message: 'user not found' }
        }

        if (!util.isPasswordCorrect(data.password, user.password)) {
            return { successful: false, message: 'Current password not correct' }
        }

        await User.update({ first_name: data.first_name, last_name: data.last_name, email: data.email }, { where: { username: loggedInUserName } });

        return { successful: true, message: 'User information updated successfully' }

    }


    const updateUserPassword = async (data, loggedInUserName) => {

        const user = await User.findOne({ where: { username: loggedInUserName } });
        if (user == null) {
            return { successful: false, message: 'user not found' }
        }

        if (!util.isPasswordCorrect(data.currentPassword, user.password)) {
            return { successful: false, message: 'Current password not correct' }
        }

        const encryptedPassword = await util.hashPassword(data.newPassword)
        await User.update({ password: encryptedPassword }, { where: { username: loggedInUserName } });

        await AccessToken.destroy({ where: { userId: user.id } })

        return { successful: true, message: 'User\'s password updated successfully. You have to login again.' }

    }

    const loadUserInformation = async (loggedInUserName) => {
        const user = await User.findOne({ where: { username: loggedInUserName } });
        if (user == null) {
            return { successful: false, message: 'user not found' }
        }
        const { email, first_name, last_name, username, display_picture, gender } = user;
        return { email, first_name, last_name, username, display_picture, gender, successful: true }
    }

    const filterUser = async (filterValue) => {
        console.log(filterValue.toLowerCase())
        return await User.findAll({
            where: {
                [Op.or]: [
                    // { username: { [Op.like]: `%${filterValue}%` } },
                    {username : sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), 'LIKE', '%' + filterValue.toLowerCase() + '%')},
                    {first_name : sequelize.where(sequelize.fn('LOWER', sequelize.col('first_name')), 'LIKE', '%' + filterValue.toLowerCase() + '%')},
                    {last_name : sequelize.where(sequelize.fn('LOWER', sequelize.col('last_name')), 'LIKE', '%' + filterValue.toLowerCase() + '%')},
                    // { first_name: { [Op.like]: `%${filterValue}%` } },
                    // { last_name: { [Op.like]: `%${filterValue}%` } }
                ]
            }, limit: 10,
            attributes: ['username', 'first_name', 'last_name', 'display_picture', 'email', 'gender']
        });
    }

    const findUserByUsername = async (username) => {
        return await User.findOne({
            where: {
                 username: username
            },
            attributes: ['username', 'first_name', 'last_name', 'gender', 'display_picture', 'email']
        });
    }

    const findAllUsers = async (username) => {
        return await User.findAll({
            attributes: ['username', 'first_name', 'last_name', 'gender', 'display_picture', 'email']
        });
    }

    return {
        signUp, loadUsers, uploadImage, saveUserDisplayPicture, loadDisplayPictureForUser,findAllUsers,
        logout, updateUserInfo, updateUserPassword, loadUserInformation, filterUser, findUserByUsername
    }

}

module.exports = UserService();