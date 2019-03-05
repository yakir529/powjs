var $pow = $pow || {};
$pow.Components = $pow.Components || {};

$pow.Components.Form = (function(){
    var FormHandler = (function(){
        function FormHandler(){}

        FormHandler.prototype.GetFormData = function (i_formElemUniqeSelector, i_dataToAddArr) {
            var _form = document.querySelector(i_formElemUniqeSelector);
            if (!_form || _form.tagName != "FORM") console.warn("Element must be of type FORM");
            else {
                var _inputs = _form.querySelectorAll("input:not([type='button']), textarea"),
                    _thisFormData = getFormDataObj();

                for (var i in _inputs) {
                    if (!isNaN(i) && _inputs[i].hasAttribute("name")) {
                        if (typeof _inputs[i].files != "undefined" && _inputs[i].files) {
                            var _filesList = _inputs[i].files;
                            for (var f in _filesList) {
                                if (!isNaN(f)) {
                                    _thisFormData.append(_inputs[i].getAttribute("name"), _filesList[f]);
                                }
                            }
                        } else {
                            _thisFormData.append(_inputs[i].getAttribute("name"), _inputs[i].value);
                        }
                    }
                }

                if (typeof i_dataToAddArr != "undefined" && i_dataToAddArr.length) {
                    for (var k in i_dataToAddArr) {
                        if (typeof i_dataToAddArr[k].key != "undefined" && typeof i_dataToAddArr[k].value != "undefined") {
                            _thisFormData.append(i_dataToAddArr[k].key, i_dataToAddArr[k].value);
                        }
                    }
                }
                return _thisFormData;
            }
        }

        function getFormDataObj() {
            return new FormData();
        }

        return FormHandler;
    })();

    return {
        GetInstance: function(){
            return new Caller();
        }
    };
})();