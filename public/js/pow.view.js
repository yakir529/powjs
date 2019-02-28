var $pow = $pow || {};

var myEventConsumer = $pow.View.CreateEventConsumer("buttonClickConsumer").RegisterTo.ClickEvent().OnElement(".test").YieldData(function(e){
        return { number: 1 };
    }).DelegateTo("PowController", "ButtonClick", function(i_response){
        var _dataElem = document.createElement("div");
        _dataElem.innerText = i_response;
        document.body.appendChild(_dataElem);
    });
