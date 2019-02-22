var $pow = $pow || {};

$pow.View.CreateEventConsumer("buttonClickConsumer").When("click").On(".test").InvokeToDelegation(function(e){
    return {
        number: 1
    };
}).Delegate("PowController", "ButtonClick", function(i_response){
    var _dataElem = document.createElement("div");
    _dataElem.innerText = i_response;
    document.body.appendChild(_dataElem);
});