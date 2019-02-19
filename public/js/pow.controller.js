var $pow = $pow || {};

var myPowController = new $pow.ControllersFactory.Create({
    Identifier: "PowController",
    UsingService: ["PowService"],
    Methods: {
        ButtonClick: function(i_event, i_using, i_invokeView){
            i_using.PowService.GetTestData('https://jsonplaceholder.typicode.com/todos/1', function(i_response){
                i_invokeView(i_response);
            });
        }
    }
});