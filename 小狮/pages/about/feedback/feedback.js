// feedback.js
var Bmob = require('../../../utils/bmob.js');
var advice, contact, userName;
var that;
Page({
  data:{
    textAdvice:'',
    textContact:''
  },
  onShow: function () {
    that=this;
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        var userInfo = res.userInfo
        userName = userInfo.nickName
      }
    });
  },
  getAdvice: function (e) {
    advice = e.detail.value;
  },
  getContact: function (e) {
    contact = e.detail.value;
  },
  submit: function () {
    var Suggests = Bmob.Object.extend("Suggests");
    var suggest = new Suggests();
    suggest.set("advice", advice);
    suggest.set("contact", contact);
    suggest.set("name", userName);
    suggest.save(null, {
      success: function (result) {
        that.setData({
          textAdvice: '',
          textContact: ''
        })
        wx.showToast({
          title: '反馈成功',
          icon:"success"
        })
      },
      error: function (result, error) {
        // 添加失败
        wx.showToast({
          title: '评论失败',
        })
      }
    });
  }
})