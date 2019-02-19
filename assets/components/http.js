var $pow = $pow || {};
$pow.Components = $pow.Components || {};

$pow.Components.http = (function(){
    var Caller = (function(){
        function Caller(){ }

        Caller.prototype.Post = function(i_path, i_dataToSend, i_callback){
            if (isValidCall("post", i_path, i_dataToSend, i_callback)) {
                var xhr = new XMLHttpRequest();
                
                xhr.open('POST', i_path);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        i_callback(xhr.responseText);
                    }
                };
                
                if (i_dataToSend) xhr.send(encodeURI(i_dataToSend));
                else xhr.send();
            }
        }
        
        Caller.prototype.Get = function(i_path, i_callback){
            if (isValidCall("get", i_path, null, i_callback)) {
                var xhr = new XMLHttpRequest();
                
                xhr.open('GET', i_path);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        i_callback(xhr.responseText);
                    }
                };
                xhr.send(encodeURI(i_path));
            }
        }

        function isValidCall(i_callType, i_path, i_dataToSend, i_callback){
            return (i_path 
                    && typeof i_path == "string" 
                    && (!i_callback 
                        || (i_callback 
                            && typeof i_callback == "function")))? true : false;
        }

        return Caller;
    })();

    return {
        GetInstance: function(){
            return new Caller();
        }
    };
})();