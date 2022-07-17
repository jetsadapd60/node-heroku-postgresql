const { client } = require("../configs/database");
const { HashPassword, ComparePassword } = require("../utils/hash-password");
const { message } = require("../utils/message-handler.js");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

async function GetProfile(req, res, next) {
  try {
    const q = 'SELECT * FROM users';
    const result = await client.query(q);
    return res.json(result);
    const { userid } = await req.user;
    // const query = `select userid, username, role from users where userid = ${userid}`;
    const query = `SELECT * FROM users`;
    const users = await client.query(query);
    return message(res, 200, "user profile.", users);
  } catch (error) {
    next(error);
  }
}

/**
 * ลงชื่อเข้าระบบ SIGN IN
 * @param {*} req email and password, data type is string
 * @param {*} res return msg to client
 * @returns
 */
async function SignIn(req, res, next) {
  try {
    // 1. รับข้อมูลจาก client ผ่าน req.body
    const { email, pass } = await req.body;

    // 2. ถ้าช้อมูลส่งมาไม่ครบให้หยุดทำงาน แล้วส่งข้อความกลับไปแจ้ง client
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
      const err = new Error();
      err.message = "ข้อมูลสำหรับลงชื่อเข้าระบบไม่ครบ";
      err.statusCode = 400;
      err.validation = errors;
      throw err;
    }
    // if (email == undefined || pass == undefined) {
    //   const err = new Error();
    //   err.message = "ข้อมูลสำหรับลงชื่อเข้าระบบไม่ครบ";
    //   err.statusCode = 400;
    //   throw err;
    // }

    // 3. ค้นหา user ด้วย email
    const query = `select * from users where email = '${email}'`;
    const user = await client.query(query);
    // 3.1 ถ้ามี จะคืนค่าเป็นอาเรย์
    if (user.rows.length > 0) {
      // 3.1.1 เปรียบเทียบรหัสผ่าน
      const comparePass = await ComparePassword(pass, user.rows[0].pass);
      // 3.1.2 รหัสผ่านถูกต้อง คืนค่าให้ client
      if (comparePass === true) {
        const { userid, username, email } = user.rows[0];
        const access_token = await jwt.sign(
          { userid, username },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "5days" }
        );
        const decode = jwt.decode(access_token);
        return message(res, 200, "ลงชื่อเข้าระบบแล้ว", {
          userid,
          username,
          email,
          access_token,
          exp_token: decode.exp,
        });
      }
      // 3.1.3 รหัสผ่านไม่ถูกต้อง คืนค่าให้ client
      const err = new Error();
      err.message = "รหัสผ่านไม่ถูกต้อง";
      err.statusCode = 400;
      throw err;
    }
    // 3.2 ไม่มีอีเมล์ในระบบ คืนค่าให้ client
    const err = new Error();
    err.message = "อีเมล์ไม่มีในระบบ";
    err.statusCode = 400;
    throw err;
  } catch (error) {
    next(error);
  }
}

async function Register(req, res, next) {
  try {
    const { username, password, email, role } = req.body;
    const query = `
      insert into users(username, pass, role, email)
      values ('${username}', '${await HashPassword(password)}', '${
      role || "member"
    }',  '${email}')
    `;
    const user = await client.query(query);
    res.json({ msg: "Register complete." });
  } catch (error) {
    console.error("error is: ", error.message);
  }
}

module.exports = {
  Register,
  SignIn,
  GetProfile,
};
