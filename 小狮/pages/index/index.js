//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var Util = require('../../utils/util.js');
var Info = Bmob.Object.extend("info");
var info = new Info();
var app = getApp();
var date;
var that;
//上传信息相关的变量
var type = "校园卡"; var month, day;
var userName = "htu小狮";//用户的名字&发布者的名字
var toFindName = '';
var picURL = '';//服务器图片的URL
var avatarURL = '../../../images/icon.jpg';//用户头像地址
var count = 10;//一次性获取数据的数目
Page({
  data: {
    picPath: '',//用户选择上传图片的本地路径
    showPic: false,
    findResultShowed: false,
    loading: false,
    writeInfo: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    infoList: [],
    items: [
      { name: '校园卡', value: '校园卡', checked: 'true' },
      { name: '身份证', value: '身份证' },
      { name: '其他', value: '其他' },
    ],
  },
  //页面生命周期函数
  onLoad: function () {
    /*
    * 在加载页面时给that赋值，获取到这个页面实例
    * 获取用户信息
    */
    that = this;

    //获取当前时间戳 给上传的图片命名&&记录发布信息的时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间  
    var n = timestamp * 1000;
    date = new Date(n);
    //console.log('time!!'+date.toLocaleString());
    month = date.getMonth() + 1
    day = date.getDate()
  },
  onPullDownRefresh: function () {
    getList();
  },
  onShow: function () {
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        var userInfo = res.userInfo
        userName = userInfo.nickName
        avatarURL = userInfo.avatarUrl
        console.log('发布信息' + userName + avatarURL)
      }
    });
    getList();
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  //事件处理函数
  toAddInfo: function () {
    var currentUser = Bmob.User.current();
    if (!currentUser) {
      Util.htuLogin();
      that.setData({
        writeInfo: true,
      })
    } else {
      that.setData({
        writeInfo: true,
      })
    }
  },
  //获取到选择的丢失物品类型
  radioChange: function (e) {
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
    type = e.detail.value;
  },
  //取消输入信息的对话框
  noneWindows: function () {
    that.setData({
      writeInfo: "",
    })
  },
  //上传图片
  chooseImage: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          picPath: res.tempFilePaths,
          showPic: true
        })
        if (tempFilePaths.length > 0) {
          var picName = userName + date.toLocaleString() + ".jpg";
          var file = new Bmob.File(picName, tempFilePaths);
          wx.showLoading({
            title: '图片上传中',
            mask: true
          });
          file.save().then(function (res) {
            //console.log('文件上传成功后返回的地址' + res.url());
            //console.log('文件名称'+picName);
            picURL = res.url();
            wx.hideLoading();
            common.showTip("图片上传成功", "success");
          }, function (error) {
            common.showTip("图片上传失败", "failed");
            console.log(error);
          })
        }

      }
    })
  },
  //发布信息
  addInfo: function (event) {
    var content = event.detail.value.content;
    var name = event.detail.value.name;
    var publisher = userName;
     var currentUser = Bmob.User.current();//获取当前用户
    if (!content) {
      common.showTip("内容不能为空", "loading");
    }
    else if (!currentUser) {
      Util.htuLogin();
    }
    else {
      var Info = Bmob.Object.extend("Info");
      var info = new Info();
      info.set("type", type);
      info.set("content", content);
      info.set("name", name);
      info.set("date", month + '月' + day + '日');
      info.set("publisher", publisher);
      info.set("picURL", picURL);
      info.set("avatarURL", avatarURL);
      info.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          console.log("信息添加成功, objectId:" + result.id);
          common.showTip('添加成功');
          //添加成功后刷新界面
          getList();
          that.setData({
            writeInfo: false,
            loading: false
          })
        },
        error: function (result, error) {
          // 添加失败
          common.showTip('添加失败');
        }
      });
    }
  },
  //上拉加载
  pullUpLoad: function () {
    count = count + 2;
    getList();
  },

  //搜索框相关的函数
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  toFind: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    findInfo(toFindName);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    //得到要搜索数据
    toFindName = e.detail.value;
    this.setData({
      inputVal: e.detail.value
    });
  },
})

/*
 * 会调用的函数
 * 从数据库获取列表
 */
function getList() {
  var Info = Bmob.Object.extend("Info");
  var query = new Bmob.Query(Info);
  query.descending('createdAt');
  query.limit(count);
  // 查询所有数据
  query.find({
    success: function (results) {
      that.setData({
        infoList: results
      })
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}
/*
 * 以失主姓名作为关键字
 * 进行搜索查询
 */
function findInfo(name) {
  var Info = Bmob.Object.extend("Info");
  var query = new Bmob.Query(Info);
  query.equalTo("name", name);
  query.descending('createdAt');
  query.find({
    success: function (results) {
      if (results.length > 0) {
        that.setData({
          infoList: results,
        });
      } else {
        wx.showToast({
          title: '没有找到',
          icon: 'loading',
          duration: 2000,
          success: function () {
            //getList();
          }
        })
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}