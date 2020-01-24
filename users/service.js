const User = require('../db/models/users');
const sequelize = require('../db/index').Sequelize;
const util = require('../utils/utils')
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

    return {signUp}

}

module.exports = UserService();