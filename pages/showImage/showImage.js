Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    distance: 0, //手指移动的距离
    scale: 1, //图片的比例
    baseWidth: null, //图片真实宽度
    baseHeight: null, //图片真实高度
    scaleWidth: '', //图片设显示宽度
    scaleHeight: '', //图片设显示高度

  },
  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 2) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 2) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        // console.log(imgs);
        that.setData({
          imgs: imgs
        });
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    console.log("111111111")
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
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
        'scaleWidth': '80px',
        'scaleHeight': '80px',
        'diff': distanceDiff
      })
    }
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