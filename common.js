/**
 * Created by Ryso on 2015/11/21.
 */

'use strict';
function Ryso(){}
Ryso.prototype = {
    R: function(id){
        return document.getElementById(id) || document.getElementsByClassName(id);
    },
    getScrollTop: function() {
        var scrollTop = 0; 
        if (document.documentElement && document.documentElement.scrollTop) { 
            scrollTop = document.documentElement.scrollTop; 
        } else if (document.body) { 
            scrollTop = document.body.scrollTop; 
        } 
        return scrollTop; 
    },
    insEach: function(closure){
        if(typeof closure === 'undefined'){
            closure = function(x){
                return x;
            };
        }
        // ���հ�һ��Ĭ��ֵ������each�Ϳ���ȱʡ����
        if(typeof closure !== 'function'){
            // ����closureΪĳ��ȷ�ϵ�ֵ�����ʱ��ArrayList�е�ÿһ��Ԫ�غ����ȷ����ֵ�Ƚ�
            var c = closure;
            closure = function(x){
                return x === c;
            };
        }

        var ret = [];
        // Array.apply(this.arguments)��һ�ֽ�arguments�б�ת����
        Array.apply(this.arguments).slice(1);
        for(var i = 0; i < this.length; i++){
            var rval = closure.apply(this,[this[i]].concat(args).concat(i));
            if(rval || rval === 0 ){
                ret.push(rval);
            }
        }
        return ret;
    }

};
