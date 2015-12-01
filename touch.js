/**
 * Created by Ryso on 2015/12/1.
 */

 /**	new TouchAction({
					action : [tap | double | long | swipe | swipeRight | swipeLeft | swipeUp | swipeDown],

					el : �����Ľڵ�,

					callback : ���ʱ�Ļص�����,

					ontouchmove : �����ص�����,

					ontouchstart : ���ʱ�ص�
				})
 */

var TouchAction = function (arg){
    (arg instanceof Object) && this.init(arg);
};


TouchAction.prototype = {

    init : function (arg){
        this.arg = arg;
        // ��һ��touchstart��ʱ��
        this.savePrevDate = 0;
        // ��������
        this.saveLongDate = 0;
        // ������id
        this.id;
        // ������x�����
        this.saveX = 0;
        // ������y�����
        this.saveY = 0;
        // ��������
        this.direction;
        // �¼�ִ����ɵĻص�����
        this.callback = arg.callback;
        // swipe��������
        this.saveSwipeDate = {};
        // ����ص� ִֻ��һ��
        this.isStart = true;
        // ̧��ص� ִֻ��һ��
        this.isEnd = true;

        this.addEvent(arg);
    },


    addEvent : function (arg){

        var t = this,
        // �¼��б�
            action = arg.action,
        // �ڵ�
            el = arg.el,
        // ��ָ̧��
            touchend = function (fn, arg){
                el.on('touchend', function (e){
                    t.isStart = true;
                    if(!fn) return;
                    fn.call(t, e, el, arg);
                });
            },
        // ��ָ����
            touchstart = function (fn, arg){
                el.on('touchstart', function (e){
                    // ���ʱ����ϴλ����ļ�¼
                    t.saveX = 0;
                    t.saveY = 0;
                    // ����ص�
                    fn.call(t, e, el, arg);
                });
            },
        // �����¼�
            touchmove = function (fn){
                // ɾ�����ע����¼�
                el.unbind('touchmove');
                el.on('touchmove', function (e){
                    e.preventDefault();
                    fn.call(t, e, this);
                });
            },
        // ������������
            swipe = function (arg){
                // touchstartʱ��ȡ��ʼλ��
                touchstart(t.moveStart);
                touchmove(t.moveMethod);
                touchend(t.swipeCallBack, arg);
            };


        // ѭ���¼��б�
        for(var i=0, length=arg.action.length; i<length; i++){
            switch (action[i]){
                case 'tap' :
                    // ����ص�
                    touchstart(t.touchMethod, 'tap');
                    // ̧��ص�
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


    // ����ص�
    touchMethod : function (e, el){
        if(this.isStart){
            this.arg.ontouchstart && this.arg.ontouchstart.call(el, e);
            this.isStart = false;
        }
    },


    // �ص�����
    callback : function (e, el){
        this.arg.callback && this.arg.callback.call(el, e);
    },


    // ˫���¼�
    doubleMethod : function (e, el){
        // ��һ�θ�savePrevDate��ֵ
        if(!this.savePrevDate) this.savePrevDate = this.runTime();

        // ����ص�
        this.touchMethod();

        var savePrevDate = this.savePrevDate;
        var time;

        // �������� ������̧���ٴε��
        if(savePrevDate){
            time = this.runTime();

            // 2�ε��ʱ���
            if(time-savePrevDate<=200 && time-savePrevDate>0){
                this.callback && this.callback.call(el, e);
            }

            // �����һ�ε����ʱ�򸳸�savePrevDate
            this.savePrevDate = time;
        }
    },


    // �����¼�
    longMethod : function (e, el, arg){
        // ����ص�
        this.touchMethod();
        var t = this;
        var time = function (){
            t.id && clearTimeout(t.id);
            t.saveLongDate++;
            // ���ʱ�䳬��3s
            if(t.saveLongDate>2){
                // �¼���ɺ�Ļص�����
                t.callback && t.callback.call(el, e, arg);
                return false;
            }

            t.id = setTimeout(arguments.callee, 1000);
        };

        time();
    },


    // ����
    moveMethod : function (e, el){
        // e.preventDefault();
        var ontouchmove = this.arg.ontouchmove;
        var savePrevDate;

        // �����Ļص�����
        ontouchmove && ontouchmove.call(el, e);

        // savePrevDate ��ָ����ʱ��ֵ ̧��ʱȡ����ֵ
        // ����savePrevDateûֵ�˳�
        if(!this.saveSwipeDate) return false;

        // ��ȡ�����ֵ
        var xy = this.difference(e);

        this.swipe(xy);
    },


    // ������
    swipe : function (xy){
        // ����x, y�Ử���ľ���
        this.saveX = xy.x;
        this.saveY = xy.y;
    },


    // �����Ļص�����
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


    // ����ص�
    callTouchstart : function (el, e){
        this.arg.ontouchstart && this.arg.ontouchstart.call(el, e);
    },


    // ���ص�ǰʱ���
    runTime : function (){
        return new Date().getTime();
    },


    // touchEndʱ �޸�isTrueֵ
    modifyDobuleStart : function (){
        var t = this;
        t.id && clearTimeout(t.id);
        // �ָ���ʼ״̬
        t.saveLongDate = 0;
    },


    // touchmove ���ʱ�����ʼֵ
    moveStart : function (e, el){
        var xy = this.getClient(e);
        var savePrevDate = this.saveSwipeDate;

        // ����ص�
        this.touchMethod(e, el);

        savePrevDate.y = xy.y;
        savePrevDate.x = xy.x;
    },


    // ��ȡ����
    getClient : function (e){
        e = e.touches[0];

        // ��������ֵ
        var data = {};
        data.y = e.clientY;
        data.x = e.clientX;

        return data;
    },


    // ��ȡ��ֵ
    difference : function (e){
        // �����ֵ
        var data = {};
        // ��ȡ����
        var xy = this.getClient(e);

        data.y = xy.y - this.saveSwipeDate.y;
        data.x = xy.x - this.saveSwipeDate.x;

        return data;
    }
};














