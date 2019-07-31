// pages/canvas/canvas.js
Page({
   /**
    * 页面的初始数据
    */
   data: {
     imgs:[],
     imgsBottom: [],
     allimgs:[],
     chooseimg:[],
     opacity:0,
     distance: 0,//手指移动的距离
     distanceBottom: 0,//手指移动的距离
     scale: 1,//图片的比例
     scaleBottom: 1,//图片的比例
     baseWidth: null,//图片真实宽度
     baseHeight: null,//图片真实高度
     baseW: null,//图片真实宽度
     baseH: null,//图片真实高度
     scaleWidth: '',//图片设显示宽度
     scaleHeight: '',//图片设显示高度
     sW: '',//图片设显示宽度
     sH: '',//图片设显示高度
     imgX:'',
     imgY:'',
     imgXw: '',
     imgYh: '',
     cenW:'',
     cenH:'',
     cenWw: '',
     cenHh: '',
     vW: '',
     vH: '',
     vWw: '',
     vHh: '',
     pyW: '',
     pyH: '',
     pyWw: '',
     pyHh: ''
   },
  // previewImg: function (e) {
  //   //获取当前图片的下标
  //   var index = e.currentTarget.dataset.index;
  //   //所有图片
  //   var imgs = this.data.imgs;
  //   wx.previewImage({
  //     //当前显示图片
  //     current: imgs[index],
  //     //所有图片
  //     urls: imgs
  //   })
  // },
  // previewImgBottom: function (e) {
  //   //获取当前图片的下标
  //   var index = e.currentTarget.dataset.index;
  //   //所有图片
  //   var imgs = this.data.imgsBottom;
  //   wx.previewImage({
  //     //当前显示图片
  //     current: imgs[index],
  //     //所有图片
  //     urls: imgs
  //   })
  // },
  imgload: function (e) {
    this.setData({
      'baseWidth': e.detail.width, //获取图片真实宽度
      'baseHeight': e.detail.height, //获取图片真实高度
      'scaleWidth': this.data.baseWidth, //给图片设置宽度
      'scaleHeight': this.data.baseHeight //给图片设置高度
    });
    console.log(this.data.windowW, this.data.baseWidth, this.data.windowH, this.data.baseHeight)
    var arr=this.findCenter(this.data.windowW,this.data.baseWidth,this.data.windowH,this.data.baseHeight);
    console.log(arr)
    this.setData({
      cenW:arr[0],
      cenH:arr[1],
      vW: this.data.baseWidth,
      vH: this.data.baseHeight,
    })
    console.log(this.data.cenW,this.data.cenH)
  },
  imgloadBottom: function (e) {
    this.setData({
      'baseW': e.detail.width, //获取图片真实宽度
      'baseH': e.detail.height, //获取图片真实高度
      'sW': this.data.baseW, //给图片设置宽度
      'sH': this.data.baseH //给图片设置高度
    });
    let arr = this.findCenter(this.data.windowW, this.data.baseW, this.data.windowH, this.data.baseH);
    this.setData({
      cenWw: arr[0],
      cenHh: arr[1],
      vWw: this.data.baseW,
      vHh: this.data.baseH
    })
  },
  touchstartCallback: function (e) {
    // 单手指缩放开始，不做任何处理

      if (e.touches.length == 1) return;
      // 当两根手指放上去的时候，将距离(distance)初始化。
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      //计算开始触发两个手指坐标的距离
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      this.setData({
        'distance': distance, 
        pyW: e.changedTouches[0].clientX,
        pyH: e.changedTouches[0].clientY
      })
   
  },
  touchstartCallbackBottom: function (e) {
    // 单手指缩放开始，不做任何处理
      if (e.touches.length == 1) return;
      // 当两根手指放上去的时候，将距离(distance)初始化。
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      //计算开始触发两个手指坐标的距离
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      //console.log(distance)
      this.setData({
        'distanceBottom': distance,
        pyWw: e.changedTouches[0].clientX,
        pyHh: e.changedTouches[0].clientY
      })
  },
  touchmoveCallback: function (e) {
    // 单手指缩放不做任何操作
    if (e.touches.length == 1) return;
    //双手指运动 x移动后的坐标和y移动后的坐标
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    //双手指运动新的 ditance
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    //计算移动的过程中实际移动了多少的距离
    let distanceDiff = distance - this.data.distance;
    let newScale = this.data.scale + 0.005 * distanceDiff
    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
    if (newScale >= 2) {
      newScale = 2
    }
    //为了防止缩放得太小，所以scale需要限制
    if (newScale <= 0.5) {
      newScale = 0.5
    }
    let scaleWidth = newScale * this.data.baseWidth + 'px'
    let scaleHeight = newScale * this.data.baseHeight + 'px'
    this.setData({
      'distance': distance,
      'scale': newScale,
      'scaleWidth': scaleWidth,
      'scaleHeight': scaleHeight,
      'diff': distanceDiff,
    });
    console.log(this.data.scaleWidth)
    this.setData({
      imgX: this.data.scaleWidth ,
      imgY: this.data.scaleHeight,
      pyW: e.changedTouches[0].clientX,
      pyH: e.changedTouches[0].clientY
    })
  },
  touchmoveCallbackBottom: function (e) {
      if (e.touches.length == 1) return;
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      let distanceDiff = distance - this.data.distanceBottom;
      let newScale = this.data.scaleBottom + 0.005 * distanceDiff
      if (newScale >= 5) {
        newScale = 5
      }
      if (newScale <= 0.5) {
        newScale = 0.5
      }
    let scw = newScale * this.data.baseW + 'px'
    let sch = newScale * this.data.baseH + 'px'
      this.setData({
        'distanceBottom': distance,
        'scaleBottom': newScale,
        'sW': scw,
        'sH': sch,
      });
    this.setData({
      imgXw: this.data.sW,
      imgYh: this.data.sH,
      pyWw: e.changedTouches[0].clientX,
      pyHh: e.changedTouches[0].clientY
    })
  },
   onLoad: function (options) {
      var that = this;
      that.sys();
     this.setData({
       imgX: this.data.windowW,
       imgY: this.data.windowH*0.5,
       imgXw: this.data.windowW,
       imgYh: this.data.windowH * 0.5
     })
   },
   sys: function () {
      var that = this;
      wx.getSystemInfo({
         success: function (res) {
            that.setData({
               windowW: res.windowWidth,
               windowH: res.windowHeight
            })
         },
      })
   },
   canvasdraw: function (canvas) {
    var that = this;
    var canvasimg1 = that.data.imgs[0];
     let a, b, c, d;
     if (that.data.scaleWidth==null){
       a=that.data.baseWidth;
       b=that.data.baseHeight;
       c = that.data.cenW;
       d = that.data.cenH;
     }else{
       a = that.data.scale * that.data.baseWidth;
       b = that.data.scale * that.data.baseHeight;
       if (that.data.scale * that.data.baseWidth>that.data.windowW){
         c=0;
         d=0;
       }else{
         c = (that.data.windowW - that.data.scale * that.data.baseWidth) / 2;
         d = (that.data.windowH * 0.5 - that.data.scale * that.data.baseHeight) / 2;
       }
     }
      var windowW = that.data.windowW;
      var windowH = that.data.windowH;
     canvas.drawImage(canvasimg1, c, d, a, b);
      canvas.draw(true, setTimeout(function () {
         that.daochu();
      }, 100));
   },
   daochu: function () {
    var that = this;
    that.setData({
      imgs:''
    })
      var windowW = that.data.imgX;
      var windowH = that.data.imgY;
      wx.canvasToTempFilePath({
         x: 0,
         y: 0,
         width: windowW,
         height: windowH,
         destWidth: windowW,
         destHeight: windowH,
         canvasId: 'canvas',
         success: function (res) {
           let pathAll = that.data.allimgs;
           pathAll.push(res.tempFilePath);
            wx.saveImageToPhotosAlbum({
               filePath: res.tempFilePath,
               success(res) {
               }
            })
         }
      });
   },
  canvasOdraw: function (canvas) {
    var that = this;
    var canvasimg2 = that.data.imgsBottom[0];
    let a, b, c, d;
    if (that.data.sW == null) {
      a = that.data.cenWw;
      b = that.data.cenHh;
      c = that.data.baseW;
      d = that.data.baseH;
    } else {
      c = that.data.scaleBottom * that.data.baseW;
      d = that.data.scaleBottom * that.data.baseH;
      console.log(that.data.scaleBottom * that.data.baseW > that.data.windowW)
      if (that.data.scaleBottom * that.data.baseW > that.data.windowW){
        a = 0; b = 0;
      }else{
        a = (that.data.windowW - that.data.scaleBottom * that.data.baseW) / 2;
        b = (that.data.windowH * 0.5 - that.data.scaleBottom * that.data.baseH) / 2;
      }
    }

    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    console.log(a,b,c,d)
    canvas.drawImage(canvasimg2, a, b, c, d);
    canvas.draw(true, setTimeout(function () {
      that.daoOchu();
    }, 100));
    canvas.width=that.data.windowW;
  },
  daoOchu: function () {
    var that = this;
    that.setData({
      imgsBottom: ''
    })
    var windowW = that.data.imgXw;
    var windowH = that.data.imgYh;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowH,
      destWidth: windowW,
      destHeight: windowH,
      canvasId: 'canvas1',
      success: function (res) {
        let pathAll = that.data.allimgs;
        pathAll.push(res.tempFilePath);
        //console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {

          }
        })
      }
    });
  },
  //上传图片
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
        });
        //console.log(that.data.imgs)
      },
    });

  },
  chooseImageBottom: function (e) {
    var that = this;
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let imgs = that.data.imgsBottom;
        imgs.shift();
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length > 0) {
            that.setData({
              imgsBottom: imgs
            });
            console.log(imgs)
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        that.setData({
          imgsBottom: imgs,
        });
      },
    });

  },
  cut:function(){
    var that = this;
    var canvas = wx.createCanvasContext('canvas');
    var canvas1 = wx.createCanvasContext('canvas1');
    that.canvasdraw(canvas);
    that.canvasOdraw(canvas1);
    // setTimeout(function () {
    //   canvas.clearRect(0, 0, that.data.windowW, that.data.windowH);
    //   canvas.draw();
    // }, 1000);
    // setTimeout(function () {
    //   canvas1.clearRect(0, 0, that.data.windowW, that.data.windowH);
    //   canvas1.draw();
    // }, 1500);
  },
  jump:function(){
    var that=this;
    var imgs = that.data.allimgs;
    console.log(imgs)
    wx.navigateTo({
      url: "../jump/jump?chooseimg=" + JSON.stringify(imgs)
    })
  },
  find: function(str, cha, num){
    var x = str.indexOf(cha);
    for(var i = 0; i<num;i++){
    x = str.indexOf(cha, x + 1);
      }
      return x;
  },
  findCenter:function(a,b,c,d){
    var that=this;
    let x=(a-b)/2;
    let y=(c*0.5-d)/2;
    return [x,y];
  }
})