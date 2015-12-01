/**
 * Created by Ryso on 2015/12/1.
 */
// 回调函数实例
'use strict';
var foo = function(callback){
    (callback && typeof (callback) === 'function') && callback();
    debugger;
};
