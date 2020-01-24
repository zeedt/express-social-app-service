const oauth2orize = require('oauth2orize');
const server = oauth2orize.createServer();

const User = require('../db/models/users');
const { Clients, AccessToken } = require('../authentication/db/models');
const crypto = require('crypto');
var passport = require('passport');
const utils = require('../utils/utils');

server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
    console.log("Processing request");
    Clients.findOne({
        where: {
            clientId: client.clientId
        }
    }).then((localClient) => {
        if (localClient == null) { return done(null, false, { message: "Client record not found" }) }
        if (localClient.clientSecret != client.clientSecret) { return done(null, false, { message: "Client secret do not match" }) }
        User.findOne({
            where: {
                username: username
            }
        }).then((user) => {
            if (user == null) { return done(null, false, { "message": "user not found" }) }
            if (!utils.isPasswordCorrect(password, user.password)) {return done(null, false, { "message": "Password incorrect" })}

            AccessToken.destroy({
                where: {
                    userId: user.id,
                    clientId: client.clientId
                }
            }).then(() => {
                console.log("Existing token(s) successfully destroyed");
                const tokenValue = crypto.randomBytes(32).toString('hex');
                const tokenObject = { token: tokenValue, clientId: client.clientId, userId: user.id };
                AccessToken.create(tokenObject).then(() => {
                    console.log("Token saved successfully");
                    return done(null, tokenValue);
                }).catch((err) => {
                        return done(err);
                    })
            }).catch((err) => {
                return done(err);
            })
        }).catch((err) => {
            return done(err);
        });
    }).catch((err) => {
        console.dir(err)
        return done(err);
    })

}));

exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
]
