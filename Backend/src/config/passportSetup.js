import passport from'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
import db from '../models/index';
import jwt from 'jsonwebtoken';
require('dotenv').config();

// Passport setup for Facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:8080/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.emails || profile.emails.length === 0) {
      return done(new Error('No email found for this user.'));
    }

    // Lấy email của người dùng từ profile
    const email = profile.emails[0].value;
    console.log(email)
    let user = await db.Users.findOne({ where: { email: email } });
    if (!user) {
      // Nếu không có user, tạo mới
      user = await db.Users.create({
        email: email,
        fullName: profile.displayName,
      });

    }
    const token = jwt.sign({ user: { id: user.id, email: user.email, fullName: user.fullName } }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return done(null, token);
  } catch (err) {
    return done(err, null);
  }
}));

// Passport setup for Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://localhost:8080/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.emails || profile.emails.length === 0) {
      return done(new Error('No email found for this user.'));
    }

    // Lấy email của người dùng từ profile
    const email = profile.emails[0].value;
    console.log(email)
    let user = await db.Users.findOne({ where: { email: email } });
    if (!user) {
      // Nếu không có user, tạo mới
      user = await db.Users.create({
        email: email,
        fullName: profile.displayName,
      });

    }
    const token = jwt.sign({ user: { id: user.id, email: user.email, fullName: user.fullName } }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return done(null, token);
  } catch (err) {
    return done(err, null);
  }
}));