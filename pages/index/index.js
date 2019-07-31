
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nHeight: '',
    imgs:[],
    chooseimg:[],
    distance: 0,//手指移动的距离
    scale: 1,//图片的比例
    baseWidth: null,//图片真实宽度
    baseHeight: null,//图片真实高度
    scaleWidth: '',//图片设显示宽度
    scaleHeight: '',//图片设显示高度
  },
  // 上传图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let imgs = that.data.imgs;
        imgs.shift();
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length > 0) {
            that.setData({
              imgs: imgs
            });
            console.log(imgs)
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        that.setData({
          imgs: imgs,
          chooseimg: res.tempFilePaths[0]
        });
        that.previewImg();
      },
    });
  },
  previewImg: function () {
    //获取当前图片的下标
    //所有图片
    for (var i = 0; i < this.data.imgs.length;i++){
      var imgs = this.data.imgs[i];
      console.log(imgs)
      wx.previewImage({
        //当前显示图片
        current: imgs,
        //所有图片
        urls: this.data.imgs
      })
    }
  
  },
  imgload: function (e) {
    this.setData({
      'baseWidth': e.detail.width, //获取图片真实宽度
      'baseHeight': e.detail.height, //获取图片真实高度
      'scaleWidth': this.data.baseWidth, //给图片设置宽度
      'scaleHeight': this.data.baseHeight //给图片设置高度
    })
  },
  touchstartCallback: function (e) {
    // 单手指缩放开始，不做任何处理
    //console.log(11111)
    if (e.touches.length == 1) return;
    // 当两根手指放上去的时候，将距离(distance)初始化。
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    //计算开始触发两个手指坐标的距离
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    //console.log(distance)
    this.setData({
      'distance': distance,
    })
  },
  touchmoveCallback: function (e) {
    //console.log(222222)
    // 单手指缩放不做任何操作
    if (e.touches.length == 1) return;
    //双手指运动 x移动后的坐标和y移动后的坐标
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    //双手指运动新的 ditance
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    //计算移动的过程中实际移动了多少的距离
    let distanceDiff = distance - this.data.distance;
    // console.log(distanceDiff)
    let newScale = this.data.scale + 0.005 * distanceDiff
    console.log(newScale)
    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
    if (newScale >= 2) {
      newScale = 2
      let scaleWidth = newScale * this.data.baseWidth + 'px'
      let scaleHeight = newScale * this.data.baseHeight + 'px'
      this.setData({
        'distance': distance,
        'scale': newScale,
        'scaleWidth': scaleWidth,
        'scaleHeight': scaleHeight,
        'diff': distanceDiff
      })
    }
    //为了防止缩放得太小，所以scale需要限制
    if (newScale <= 0.5) {
      newScale = 0.5
      this.setData({
        'distance': distance,
        'scale': newScale,
        'scaleWidth': '80rpx',
        'scaleHeight': '80rpx',
        'diff': distanceDiff
      })
    }
    let scaleWidth = newScale * this.data.baseWidth + 'px'
    let scaleHeight = newScale * this.data.baseHeight + 'px'
    this.setData({
      'distance': distance,
      'scale': newScale,
      'scaleWidth': scaleWidth,
      'scaleHeight': scaleHeight,
      'diff': distanceDiff
    })
  },
  cut: function () {
    var that = this;

    var canvas = wx.createCanvasContext('canvas');
    that.canvasdraw(canvas);
  },
  sys: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight * 0.5
        })
      },
    })
  },
  canvasdraw: function (canvas) {
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    var canvasimg1 = that.data.chooseimg;
    console.log(canvasimg1)
    canvas.drawImage(canvasimg1, 100, 30, 200, 200);
    canvas.draw(true, setTimeout(function () {
      that.daochu()
    }, 1000));
    // canvas.draw();
  },
  daochu: function () {
    console.log('a');
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowH,
      destWidth: windowW,
      destHeight: windowH,
      canvasId: 'canvas',
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
          }
        })
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nHeight: wx.getSystemInfoSync().windowHeight * 0.5 + "px",
    });
    var that = this;
    that.sys();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})