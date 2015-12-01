/**
 * Created by Ryso on 2015/12/1.
 */

 /**	new TouchAction({
					action : [tap | double | long | swipe | swipeRight | swipeLeft | swipeUp | swipeDown],

					el : 触发的节点,

					callback : 完成时的回调函数,

					ontouchmove : 滑动回调函数,

					ontouchstart : 点击时回调
				})
 */

var TouchAction = function (arg){
    (arg instanceof Object) && this.init(arg);
};


TouchAction.prototype = {

    init : function (arg){
        this.arg = arg;
        // 上一次touchstart的时间
        this.savePrevDate = 0;
        // 长按变量
        this.saveLongDate = 0;
        // 长按的id
        this.id;
        // 滑动的x轴距离
        this.saveX = 0;
        // 滑动的y轴距离
        this.saveY = 0;
        // 滑动方向
        this.direction;
        // 事件执行完成的回调函数
        this.callback = arg.callback;
        // swipe滑动变量
        this.saveSwipeDate = {};
        // 点击回调 只执行一次
        this.isStart = true;
        // 抬起回调 只执行一次
        this.isEnd = true;

        this.addEvent(arg);
    },


    addEvent : function (arg){

        var t = this,
        // 事件列表
            action = arg.action,
        // 节点
            el = arg.el,
        // 手指抬起
            touchend = function (fn, arg){
                el.on('touchend', function (e){
                    t.isStart = true;
                    if(!fn) return;
                    fn.call(t, e, el, arg);
                });
            },
        // 手指按下
            touchstart = function (fn, arg){
                el.on('touchstart', function (e){
                    // 点击时清空上次滑动的记录
                    t.saveX = 0;
                    t.saveY = 0;
                    // 点击回调
                    fn.call(t, e, el, arg);
                });
            },
        // 滑动事件
            touchmove = function (fn){
                // 删除多次注册的事件
                el.unbind('touchmove');
                el.on('touchmove', function (e){
                    e.preventDefault();
                    fn.call(t, e, this);
                });
            },
        // 滑动方法集合
            swipe = function (arg){
                // touchstart时获取初始位置
                touchstart(t.moveStart);
                touchmove(t.moveMethod);
                touchend(t.swipeCallBack, arg);
            };


        // 循环事件列表
        for(var i=0, length=arg.action.length; i<length; i++){
            switch (action[i]){
                case 'tap' :
                    // 点击回调
                    touchstart(t.touchMethod, 'tap');
                    // 抬起回调
                    touchend();
                    break;

                case 'double' :
                    touchstart(t.doubleMethod, 'double');
                    break;

                case 'long' :
                    touchstart(t.longMethod, 'long');
                    touchend(t.modifyDobuleStart);
                    break;

                case 'swipe' :
                case 'swipeLeft' :
                case 'swipeRight' :
                case 'swipeUp' :
                case 'swipeDown' :
                    swipe(action[i]);
            }
        };
    },


    // 点击回调
    touchMethod : function (e, el){
        if(this.isStart){
            this.arg.ontouchstart && this.arg.ontouchstart.call(el, e);
            this.isStart = false;
        }
    },


    // 回调函数
    callback : function (e, el){
        this.arg.callback && this.arg.callback.call(el, e);
    },


    // 双击事件
    doubleMethod : function (e, el){
        // 第一次给savePrevDate赋值
        if(!this.savePrevDate) this.savePrevDate = this.runTime();

        // 点击回调
        this.touchMethod();

        var savePrevDate = this.savePrevDate;
        var time;

        // 如果点击过 并且已抬起再次点击
        if(savePrevDate){
            time = this.runTime();

            // 2次点击时间差
            if(time-savePrevDate<=200 && time-savePrevDate>0){
                this.callback && this.callback.call(el, e);
            }

            // 把最后一次点击的时候赋给savePrevDate
            this.savePrevDate = time;
        }
    },


    // 长按事件
    longMethod : function (e, el, arg){
        // 点击回调
        this.touchMethod();
        var t = this;
        var time = function (){
            t.id && clearTimeout(t.id);
            t.saveLongDate++;
            // 点击时间超过3s
            if(t.saveLongDate>2){
                // 事件完成后的回调函数
                t.callback && t.callback.call(el, e, arg);
                return false;
            }

            t.id = setTimeout(arguments.callee, 1000);
        };

        time();
    },


    // 滑动
    moveMethod : function (e, el){
        // e.preventDefault();
        var ontouchmove = this.arg.ontouchmove;
        var savePrevDate;

        // 滑动的回调函数
        ontouchmove && ontouchmove.call(el, e);

        // savePrevDate 手指按下时赋值 抬起时取消该值
        // 所以savePrevDate没值退出
        if(!this.saveSwipeDate) return false;

        // 获取坐标差值
        var xy = this.difference(e);

        this.swipe(xy);
    },


    // 随便滚动
    swipe : function (xy){
        // 保存x, y轴滑动的距离
        this.saveX = xy.x;
        this.saveY = xy.y;
    },


    // 滑动的回调函数
    swipeCallBack : function (e, el, arg){
        var t = this;
        var distance = 10;
        var fn = function (){
            t.callback && t.callback.call(el, e, arg);
        };

        switch (arg){
            case 'swipe' :
                (Math.abs(t.saveX)>distance || Math.abs(t.saveY)>=distance) && fn();
                break;

            case 'swipeLeft' :
                t.saveX<-distance && fn();
                break;

            case 'swipeRight' :
                t.saveX>distance && fn();
                break;

            case 'swipeUp' :
                t.saveY<-distance && fn();
                break;

            case 'swipeDown' :
                t.saveY>=distance && fn();
        };
    },


    // 点击回调
    callTouchstart : function (el, e){
        this.arg.ontouchstart && this.arg.ontouchstart.call(el, e);
    },


    // 返回当前时间戳
    runTime : function (){
        return new Date().getTime();
    },


    // touchEnd时 修改isTrue值
    modifyDobuleStart : function (){
        var t = this;
        t.id && clearTimeout(t.id);
        // 恢复初始状态
        t.saveLongDate = 0;
    },


    // touchmove 点击时保存初始值
    moveStart : function (e, el){
        var xy = this.getClient(e);
        var savePrevDate = this.saveSwipeDate;

        // 点击回调
        this.touchMethod(e, el);

        savePrevDate.y = xy.y;
        savePrevDate.x = xy.x;
    },


    // 获取坐标
    getClient : function (e){
        e = e.touches[0];

        // 保存坐标值
        var data = {};
        data.y = e.clientY;
        data.x = e.clientX;

        return data;
    },


    // 获取差值
    difference : function (e){
        // 保存差值
        var data = {};
        // 获取坐标
        var xy = this.getClient(e);

        data.y = xy.y - this.saveSwipeDate.y;
        data.x = xy.x - this.saveSwipeDate.x;

        return data;
    }
};














