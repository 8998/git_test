/**
 * Created by Ryso on 2015/11/25.
 */
'use strict';
var space = (function(){
    var factorial = function(n){
        if(n <= 1){
            return 1;
        }else{

        }
    };
    function fibonacci( n ){
        return ( n <= 2 ) ? 1 : fibonacci( n-1 ) + fibonacci( n-2 );
    }

    function t(n){
        console.time("a");
        console.log( fibonacci( n ));
        console.timeEnd("a");
    }

})();