var $pow = $pow || {};

var myPowService = new $pow.ServicesFactory.Create({
    Identifier: "PowService",
    UsingComponent: ["http"],
    Methods: {
        GetTestData: function(i_path, i_invoke){
            this.UsingComponent.http.Get(i_path, function(i_response){
                i_invoke(i_response);
            });
        }
    }
});