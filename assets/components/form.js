var $pow = $pow || {};
$pow.Components = $pow.Components || {};

$pow.Components.form = (function(){
    var FormHandler = (function(){
        function FormHandler(){}

        FormHandler.prototype.GetFormData = function(i_formSelector){
            var _form = document.querySelector(i_formSelector),
                o_formData = new FormData();

            if (_form){
                var _dataList = _form.querySelectorAll("input, textarea, select"); 
                _dataList.array.forEach(function(element) {
                    //TODO: continue here

                });
            }
        }

        return FormHandler;
    })();

    return {
        GetInstance: function(){
            return new Caller();
        }
    };
})();