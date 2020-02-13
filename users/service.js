const User = require('../db/models/users');
const sequelize = require('../db/index').Sequelize;
const util = require('../utils/utils');
const Logger = require('../logger');
const fs = require('fs');
const { AccessToken } = require('../authentication/db/models')

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

    const loadUsers = async () => {

        try {
            const userList = await User.findAll({
                attributes: ['username', 'first_name', 'last_name']
            });
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
        return { successful: true }
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

    return { signUp, loadUsers, uploadImage, saveUserDisplayPicture, loadDisplayPictureForUser, logout }

}

module.exports = UserService();