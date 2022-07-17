const express = require("express");
const router = express.Router();
const { Register, SignIn, GetProfile } = require("../controllers/auth-controller");
const { body } = require("express-validator");

router.get("/profile", GetProfile);

router.post("/signup", Register);

router.post(
  "/signin",
  [
    body("email")
      .not()
      .isEmpty()
      .withMessage("กรอกอีเมล์")
      .isEmail()
      .withMessage("รูปแบบไม่ถูกต้อง"),
    body("pass")
      .not()
      .isEmpty()
      .withMessage("กรอกรหัสผ่าน")
      .isLength({ min: 4 })
      .withMessage("กรอก 3 ตัวอักษรขึ้นไป"),
  ],
  SignIn
);

module.exports = router;
