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
        // 给闭包一个默认值，这样each就可以缺省参数
        if(typeof closure !== 'function'){
            // 允许closure为某个确认的值，这个时候将ArrayList中的每一个元素和这个确定的值比较
            var c = closure;
            closure = function(x){
                return x === c;
            };
        }

        var ret = [];
        // Array.apply(this.arguments)是一种将arguments列表转换成
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
