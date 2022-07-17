const db = require('../configs/database');
const passport  = require('passport');
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const query =  `select * from users where userid = ${jwt_payload.userid}`;
        const {userid, username, role, email} = (await db.query(query)).rows[0];
        return done(null, {userid, username, role, email});
    } catch (error) {
      done(error);
    }
  })
);


 module.exports.isLogin = passport.authenticate("jwt", { session: false });