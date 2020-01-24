const passport = require('passport');
const PasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const {Clients, AccessToken} = require('./db/models');
const BearerStrategy = require('passport-http-bearer').Strategy;
const utils = require('../utils/utils')
const User = require('../db/models/users')

const verifyClient = (username, password, done)=> {
    console.log("Verifying client");
  Clients.findOne({where : {
      clientId : username
  }}).then((client)=> {
      if (client == null){
          return done(null, false, {message : "Client not found"});
      }
      if (!utils.isPasswordCorrect(password, client.clientSecret)) {
          return done(null, false, {message : "Client password not correct"});
      }
      return done(null, client);
  }).catch((error)=> {
      console.error("Error occurred due to " + error.message);
      return done(error);
  })
}

passport.use(new BasicStrategy(verifyClient));

passport.use(new ClientPasswordStrategy(verifyClient));

passport.use(new BearerStrategy(
    (token, done) => {
        AccessToken.findOne({
            where : {
                token : token
            }
        }).then((localToken)=> {
            if (localToken == null) {
                return done(null, false, {"message" : "Token not found"});
            }
            if (localToken.userId) {
                User.findByPk(localToken.userId).then((user)=> {
                    if (user == null) {
                        return done(null, false, { message: 'Unable to get user details from token' });
                    }
                    user.password = null;
                    return done(null, user, { scope: '*' });
                }).catch((error)=> {
                    return done(error);
                })
            }
        });
    }
  ));

  module.exports = passport;