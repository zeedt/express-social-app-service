const Chat = require('../db/models/chat');
const Op = require('../db/index').Sequelize.Op;


const ChatService = {

    addChat : async (chatObject) => {
        try {
            return await Chat.create(chatObject);
        } catch (error) {
            console.error(error);
            console.log("Error occurred due to " + error.message);
        }
    },

    loadPreviousChat : async(id, from, to) => {
        return await Chat.findAll(
            {
                where : {
                    id : (id <= 0) ? {[Op.gt] : (0)} : {[Op.lt] : (id)},
                    [Op.or] : [
                        {
                            sender : from,
                            receiver : to
                        },
                        {
                            sender : to,
                            receiver : from
                        }
                    ],
                    
                },
                limit : 15,
                order : [
                    ['id' , "DESC"]
                ]
            });
    }

}

module.exports = ChatService;