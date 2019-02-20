var $pow = $pow || {};

var myPowView = new $pow.ViewsFactory.Create({
    Controller: "PowController",
    Actions: {
        GetRequestExample: {
            Event: "click",
            Selector: ".test",
            AttachTo: document.body,
            Bubble: false,
            Delegate: "ButtonClick",
            Invoke: function(i_response){
                var _dataElem = document.createElement("div");
                _dataElem.innerText = i_response;
                document.body.appendChild(_dataElem);
            }
        }
    }
});

myPowView.ListenTo({
    ExtButtonClickListener: {
        Event: "click",
        Selector: ".test2",
        AttachTo: document.body,
        Bubble: false,
        Delegate: "ButtonClick",
        Invoke: function(i_response){
            var _dataElem = document.createElement("div");
            _dataElem.innerText = i_response;
            document.body.appendChild(_dataElem);
        }
    }
});