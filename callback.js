/**
 * Created by Ryso on 2015/12/1.
 */
// �ص�����ʵ��
'use strict';
var foo = function(callback){
    (callback && typeof (callback) === 'function') && callback();
    debugger;
};
