require('dotenv').config();
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user-model');

// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SEC,
        callbackURL: "/auth/google/callback",
},
    async (accessToken,refreshToken,profile,done)=>{
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = await User.create({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    password: Math.random().toString(36).slice(-8), // random password
                    phone: "0000000000", // or prompt user to fill later
                    isVerified: true
                });
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
))

module.exports = passport;