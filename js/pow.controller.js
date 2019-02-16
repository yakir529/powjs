var $pow = $pow || {};

var myPowController = new $pow.ControllersFactory.Create({
    Identifier: "PowController",
    Using: ["http"],
    Methods: {
        ButtonClick: function(i_event, i_using, i_invokeView){
            i_using.http.Get('https://jsonplaceholder.typicode.com/todos/1', function(i_response){
                i_invokeView(i_response);
            });
        }
    }
});