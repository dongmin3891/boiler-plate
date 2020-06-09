const mongoose = require("mongoose"); //몽고스를 불러옴

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  emil: {
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
// 그 다음 이 스키마를 모델로 감싸준다고 하였다.
const User = mongoose.model("User", userSchema);
//'User'에는 이 모델의 이름을 적어주고 그 오른쪽은 스키마 이름을 가져오면 된다.

//이 모델을 다른 파일에서도 쓰고 싶다면?
module.exports = { User };
