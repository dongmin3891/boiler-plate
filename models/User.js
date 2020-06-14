const mongoose = require("mongoose"); //몽고스를 불러옴
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //만약에 dong min@naver.com 이렇게 했을 때 스페이스가 있다 trim은 이 스페이스를 없애준다.
    unique: 1, // 중복방지
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  }, //어떤 유저가 관리자가 될 수도 있고 일반 유저가 될 수도 있다. 관리자는 또 그 일반 유저를 관리 할 수도 있고 그래서 사용 넘버가 1이면 뭐 관리자고 0이면 일반유저
  image: String,
  token: {
    type: String,
  }, //유효성 관리
  tokenExp: {
    type: Number,
  }, //토큰이 사용할 수 있는 기간을 주는 것
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
      // Store hash in your password DB.
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 45678 암호호된 비밀번호 ﻿$2b$10$KpG8B0EzD.0POXyu.xCUu.3FY60FjHWHMdK/e2BAFZHSpjBqqcBc6
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  //jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  // user._id + 'secretToken' = token
  // ->
  // 'secretToken' -> user._id

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  //user._id + '' = token
  //토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

// 그 다음 이 스키마를 모델로 감싸준다고 하였다.
const User = mongoose.model("User", userSchema);
//'User'에는 이 모델의 이름을 적어주고 그 오른쪽은 스키마 이름을 가져오면 된다.

//이 모델을 다른 파일에서도 쓰고 싶다면?
module.exports = { User };
