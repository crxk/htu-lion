var Bmob = require('bmob.js');
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function htuLogin() {
  //var loginState = false;
  wx.getUserInfo({
    withCredentials: false,
    success: function (result) {
      BmobLogin(result);
    },
    fail:function() {
      wx.showModal({
        title: '提示',
        content: '为了给广大师生营造一个良好的网络环境，防止别人恶意刷帖，您必须授权登录后才能发布信息哦，谢谢理解O(∩_∩)O！',
        cancelText: '取消',
        confirmText: '授权',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: function (res) {
                if (res.authSetting["scope.userInfo"] == true) {
                  console.log('重新授权成功')
                  wx.getUserInfo({
                    withCredentials: false,
                    success:function(res) {
                      BmobLogin(res)
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  })
}

function BmobLogin(result) {
  var userInfo = result.userInfo;
  var nickName = userInfo.nickName;
  var user = new Bmob.User();//开始注册用户
  user.set("username", nickName);
  user.set("password", '19961110');
  user.signUp(null, {
    success: function (res) {
      wx.showToast({
        title: '注册成功',
        icon: 'success',
      })
    },
    error: function (userData, error) {
      console.log(error)
      console.log(error.code)
      //202用户已经存在，所以直接登录就可以了
      if(error.code==202){
        Bmob.User.logIn(nickName,'19961110',{
          success: function (user) {
            console.log(user)
          },
          error: function (user, error) {
            // The login failed. Check error to see why.
            console.log(error)   
          }
        })
      }
    }
  });
}

module.exports = {
  formatTime: formatTime,
  htuLogin: htuLogin
}
