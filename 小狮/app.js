//app.js
var Bmob = require('utils/bmob.js');
var Util = require('utils/util.js')
//初始化的两个参数值Application ID 、REST API Key
Bmob.initialize("b813e8b88c0b24bcfc65ad3db154d948", "04eb57ec45dc98f8463b701b450a92a2");
App({
  onLaunch: function() {
    //在这里取消了对于用户信息获取的逻辑，转到具体页面进行了获取。
		//为了减少代码耦合，把相关操作写在了util.js
    /*
    //获取当前用户
    var currentUser = Bmob.User.current();
    if (!currentUser) {
      // do stuff with the user
      wx.login({
        success: function (res) {
          if (res.code) {
            Bmob.User.requestOpenId(res.code, {//获取userData(根据个人的需要，如果需要获取userData的需要在应用密钥中配置你的微信小程序AppId和AppSecret，且在你的项目中要填写你的appId)
              success: function (userData) {
                wx.getUserInfo({
                  success: function (result) {
                    //this.globalData.userName = userInfo.nickName;
                    var userInfo = result.userInfo;
                    var nickName = userInfo.nickName;
                    var user = new Bmob.User();//开始注册用户
                    user.set("username", nickName);
                    user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码
                    user.set("userData", userData);
                    user.signUp(null, {
                      success: function (res) {
                        console.log("注册成功!");
                      },
                      error: function (userData, error) {
                        console.log(error)
                      }
                    });
                  },
                  fail(){
                    wx.showToast({
                      icon:loading,
                      title: '获取用户信息失败',
                    })
                  }
                })
              },
              error: function (error) {
                // Show the error message somewhere
                console.log("Error: " + error.code + " " + error.message);
              }
            });

          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      }); 
    }*/
   // Util.htuLogin();
  },
  globalData: {
  //TODo 
  },
})

