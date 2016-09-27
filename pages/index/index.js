//获取应用实例
var app = getApp()
Page({
  data : {
    mydata : new Array(16),
    slidetime : 20,
    direction : 0,
    startPos : {},
    gameover : {
      status : true,
      message : "你输了"
    },
    userinfo : {}
  },
  //滑动开始
  start : function( event ){
    var touch = event.touches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
    this.data.startPos = { x:touch.pageX, y:touch.pageY, time:new Date() }; //取第一个touch的坐标值
    this.data.direction = 0;
  },
  //移动
  move : function(event){
    //当屏幕有多个touch或者页面被缩放过，就不执行move操作
    if(event.touches.length > 1 || event.scale && event.scale !== 1) return;

    var time = new Date() - this.data.startPos.time;
    if( time >= this.data.slidetime && this.data.direction == 0 ) {
      var touch = event.touches[0];
      var x = touch.pageX - this.data.startPos.x;
      var y = touch.pageY - this.data.startPos.y;

      if( Math.abs(x) > Math.abs(y) ) { //左右
        if( x > 0 ) { //右
          this.data.direction = 'right';
        } else { //左
          this.data.direction = 'left';
        }
      } else { //上下
        if( y > 0 ) {
          this.data.direction = 'down';
        } else {
          this.data.direction = 'up';
        }
      }
    }
  },
  end : function() {
    var flag = this.gamveOver();
    if( flag == 1 ) {
      this.setData({
        gameover : {
          status : false,
          message : '你是个天才!'
        }
      });
    } else if( flag == -1 ) {
      this.setData({
        gameover : {
          status : false,
          message : '你是个笨蛋!'
        }
      });
    }

    if( this.data.direction == "left" ) {
      this.mergeMove(3,2,1,0);
      this.mergeMove(7,6,5,4);
      this.mergeMove(11,10,9,8);
      this.mergeMove(15,14,13,12);
    } else if( this.data.direction == "right" ) {
      this.mergeMove(0,1,2,3);
      this.mergeMove(4,5,6,7);
      this.mergeMove(8,9,10,11);
      this.mergeMove(12,13,14,15);
    } else if( this.data.direction == "down" ) {
      this.mergeMove(0,4,8,12);
      this.mergeMove(1,5,9,13);
      this.mergeMove(2,6,10,14);
      this.mergeMove(3,7,11,15);
    } else if( this.data.direction == "up" ) {
      this.mergeMove(12,8,4,0);
      this.mergeMove(13,9,5,1);
      this.mergeMove(14,10,6,2);
      this.mergeMove(15,11,7,3);
    }

    this.randNum();
  },
  onLoad : function () {
    //初始化数组
    this.data.mydata.fill(0);
    
    //随机生成二个数字
    this.randNum();
    this.randNum();

    //获取用户信息
    this.data.userinfo = app.globalData.userInfo;
  },
  restart : function() {
    var arr = new Array(16);
    arr.fill(0);

    this.setData({
      mydata : arr,
      gameover : {
        status : true
      }
    });

    //随机生成二个数字
    this.randNum();
    this.randNum();
  },
  randNum : function() {
    var arr = [];
    this.data.mydata.map(function(item,i){
      if( item == 0 ) {
        arr.push(i);
      }
    });

    var num = Math.random() > 0.7 ? 4 : 2;
    var index = arr[Math.floor(Math.random() * arr.length)];
    this.changeData(index,num);
  },
  mergeMove : function( d1,d2,d3,d4 ) {
    var arr = [d1,d2,d3,d4];
    //合并
    var pre,next;
    for( var i = arr.length - 1;i > 0;i-- ) {
      pre = this.data.mydata[ arr[i] ];
      if( pre == 0 ) {
        continue;
      }
      
      for( var j = i - 1; j >= 0;j-- ) {
        next = this.data.mydata[ arr[j] ];
        if( next == 0 ) {
          continue;
        } else if( pre != next ) {
          break;
        } else {
          this.changeData( arr[i] ,next * 2);
          this.changeData( arr[j] ,0);
          break;
        }
      }
    }

    //移位
    for( var i = arr.length - 1;i > 0;i-- ) {
      pre = this.data.mydata[ arr[i] ];
      if( pre == 0 ) {
        for( var j = i - 1; j >= 0;j-- ) {
          next = this.data.mydata[ arr[j] ];
          if( next == 0 ) {
            continue;
          } else {
            this.changeData( arr[i] ,next);
            this.changeData( arr[j] ,0);
          }
          
          break;
        }
      }
    }
  },
  changeData : function( index,num ) {
    var changedData = {};
    changedData['mydata[' + index + ']'] = num;

    this.setData(changedData);
  },
  gamveOver : function() {
    //格子满了
    var temp = [];
    var max = 0;
    for( var i = 0;i < this.data.mydata.length;i++ ) {
      if( this.data.mydata[i] == 0 ) {
        temp.push( i );
      }
      
      if( this.data.mydata[i] > max ) {
        max = this.data.mydata[i];
      }
    }
    
    //有一个格子为2048
    if( max >= 2048 ) {
      return 1;
    }
    
    if( temp.length == 0 ){ //格子满的情况
      var up,down,left,right;
      for( var i = 0;i < this.data.mydata.length;i++ ) {
        up = i - 4;
        down = i + 4;
        left = i - 1;
        right = i + 1;
        
        if( up >= 0 && up < this.data.mydata.length && this.data.mydata[up] == this.data.mydata[i] ) {
          return false;
        }
        if( down >= 0 && down < this.data.mydata.length && this.data.mydata[down] == this.data.mydata[i] ) {
          return false;
        }
        
        if( i % 4 != 0 && left >= 0 && left < this.data.mydata.length && this.data.mydata[left] == this.data.mydata[i] ) {
          return false;
        }
        if( (i + 1) % 4 != 0 && right >= 0 && right < this.data.mydata.length && this.data.mydata[right] == this.data.mydata[i] ) {
          return false;
        }
      }
      
      return -1;
    }
  }
})