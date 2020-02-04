const User = require('../db/models/users');
const sequelize = require('../db/index').Sequelize;
const util = require('../utils/utils');
const Logger = require('../logger');
const UserService = ()=> {
    
    const signUp = async (signUpData)=> {
        try {
            const user = await User.findOne({where : {username : signUpData.username}});
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
                attributes : ['username', 'first_name', 'last_name']
            });
            return {successful : true, users : userList}
        } catch (e) {
            Logger.error("Error occurred while loading users due to ", e);
            return {successful : false, message : e.message}
        }

    }

    return {signUp, loadUsers}

}

module.exports = UserService();