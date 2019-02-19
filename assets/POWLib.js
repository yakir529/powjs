//----------------------------------------------------------------/ POW /----------------------------------------------------------------//
var $pow = $pow || {};

//----------------------------------------------------------------/ FACTORIES /----------------------------------------------------------------//
$pow.Store = (function(){
    var m_instance,
        StoreHandler = (function(){
            var m_storage = {};
            function StoreHandler(){
                this.Components = getComponents();
            }

            StoreHandler.prototype.Add = function(i_slug, i_data){
                m_storage[i_slug] = i_data;
            }

            StoreHandler.prototype.Get = function(i_slug){
                return m_storage[i_slug];
            }

            StoreHandler.prototype.IsExists = function(i_slug){
                return m_storage[i_slug] || this.Components.IsExists(i_slug)? true : false;
            }

            function getComponents(){
                return (function(){
                    var m_componentsInstance,
                        ComponentsHandler = (function(){
                            var m_componentsList = {};

                            function ComponentsHandler(){
                                m_componentsList = $pow.Components;
                            }

                            ComponentsHandler.prototype.GetInstanceOf = function(i_componentName){
                                return m_componentsList[i_componentName].GetInstance();
                            }

                            ComponentsHandler.prototype.IsExists = function(i_componentName){
                                return m_componentsList[i_componentName]? true : false;
                            }

                            return ComponentsHandler;
                        })();
                    
                    function createInstance(){
                        if (!m_componentsInstance) m_componentsInstance = new ComponentsHandler();
                        return m_componentsInstance;    
                    }
                
                    return createInstance();
                })();
            }

            return StoreHandler;
        })();

    function createInstance(){
        if (!m_instance) m_instance = new StoreHandler();
        return m_instance;    
    }

    return createInstance();
})();

$pow.ComponentsFactory = (function(){
    var m_instance,
        ComponentsFactoryInstance = (function(){
            function ComponentsFactoryInstance(){}

            ComponentsFactoryInstance.prototype.Create = function(i_componentName){
                if (isValidComponent(i_componentName)){
                    return $pow.Store.Components.GetInstanceOf(i_componentName);
                }
            }

            function isValidComponent(i_componentName){
                return (typeof i_componentName !== "undefined" 
                        && i_componentName 
                        && i_componentName.length
                        && isComponentExists(i_componentName))? 
                            true : false;
            }

            function isComponentExists(i_componentName){
                return $pow.Store.IsExists(i_componentName);
            }

            return ComponentsFactoryInstance;
        })();
        
    function createInstance(){
        if (!m_instance) m_instance = new ComponentsFactoryInstance();
        return m_instance;
    }

    return createInstance();
})();

$pow.ControllersFactory = (function(){
    var m_instance,
        ControllersFactoryInstance = (function(createController){
            function ControllersFactoryInstance(){}

            ControllersFactoryInstance.prototype.Create = function(i_definitions){
                if (isValidDefinitions(i_definitions)){
                    var _controller = createController(i_definitions);
                    $pow.Store.Add(i_definitions.Identifier, _controller);
                }
            }

            function isValidDefinitions(i_definitions){
                return (typeof i_definitions !== "undefined" 
                        && i_definitions 
                        && typeof i_definitions.Methods !== "undefined"
                        && typeof i_definitions.Identifier === "string")? 
                            true : false;
            }

            return ControllersFactoryInstance;
        })(createController),
        Controller = (function(){
            function Controller(i_definitions){
                this.Methods = i_definitions.Methods;
                this.Identifier = i_definitions.Identifier;
                this.UsingService = bindServices(i_definitions.UsingService);
            }

            function bindServices(i_using){
                //todo: attach each component as an internal object like -> Controller.http.post
                var o_using = {}
                if (i_using) {
                    var v_serviceInstance = {};
                    for (var key in i_using) {
                        v_serviceInstance = $pow.Store.Get(i_using[key]);
                        if (!v_serviceInstance) console.warn("bad service: " + i_using[key]);
                        else o_using[i_using[key]] = v_serviceInstance;
                    } 
                } 
                return o_using;
            }
            
            return Controller;
        })();
    
    function createController(i_definitions){
        return new Controller(i_definitions);    
    }

    function createInstance(){
        if (!m_instance) m_instance = new ControllersFactoryInstance();
        return m_instance;
    }

    return createInstance();
})();

$pow.ViewsFactory = (function(){
    var m_instance,
        ViewsFactoryInstance = (function(createView){
            function ViewsFactoryInstance(){}

            ViewsFactoryInstance.prototype.Create = function(i_definitions){
                if (isValidDefinitions(i_definitions)){
                    var _view = createView(i_definitions);
                    $pow.Store.Add(i_definitions.Identifier, _view);
                    return _view;
                }
            }

            function isValidDefinitions(i_definitions){
                var o_response = true;
                if (typeof i_definitions != "undefined" && i_definitions && i_definitions.Controller && i_definitions.Actions){
                    var _listenters = Object.getOwnPropertyNames(i_definitions.Actions);
                    for (var key in _listenters) {
                        if (!i_definitions.Actions[_listenters[key]].hasOwnProperty("Event") 
                            || !i_definitions.Actions[_listenters[key]].hasOwnProperty("AttachTo") 
                            || !i_definitions.Actions[_listenters[key]].hasOwnProperty("Selector")
                            || !i_definitions.Actions[_listenters[key]].hasOwnProperty("Delegate")) {
        
                            o_response = false;
                            break;
                        }
                    }
                }
                return o_response;
            }

            return ViewsFactoryInstance;
        })(createView),
        View = (function(){
            var m_controller = {};
        
            function View(i_definitions){
                this.m_definitions = i_definitions;
                bindController(this.m_definitions.Controller);
                bindActions(getController(this.m_definitions.Controller), this.m_definitions.Actions);
            }

            View.prototype.ListenTo = function(i_listenerOptions, i_controllerName){
                var _controller = getController(i_controllerName);
                bindActions(_controller? _controller : getController(this.m_definitions.Controller), i_listenerOptions);
            }
        
            function bindController(i_controllerName){
                m_controller[i_controllerName] = $pow.Store.Get(i_controllerName);
            }
        
            function getController(i_controllerName){
                return m_controller[i_controllerName];
            }
        
            function bindActions(i_controller, i_actionsList){
                function getCurrObjHelper(i_key){
                    return i_actionsList[_listentersArr[key]];
                }

                var _listentersArr = Object.getOwnPropertyNames(i_actionsList),
                    _usingServicesArr = Object.getOwnPropertyNames(i_controller.UsingService),
                    _services = {};
                
                i_actionsList.Controller = i_controller;
                
                for (var key = 0; key < _usingServicesArr.length; key++) {
                    _services[_usingServicesArr[key]] = i_controller.UsingService[_usingServicesArr[key]].Methods;
                }

                for (var key = 0; key < _listentersArr.length; key++) {
                    var v_currObj = getCurrObjHelper(key);
                    if (document.addEventListener) {
                        v_currObj["AttachTo"].addEventListener(v_currObj["Event"], function( e ){ 
                            if (e.target === document.querySelector(v_currObj["Selector"])) { 
                                i_actionsList.Controller.Methods[v_currObj["Delegate"]].apply(e.target, [e, _services, v_currObj["Invoke"]]);
                            }
                        }, v_currObj["Bubble"] || false);
                    } 
                    // else {
                    //     document.attachEvent( 'on' + type, function( event ){ 
                    //         if(event.srcElement === element || event.srcElement.id === element) { 
                    //             callback.apply(event.target, [event]); 
                    //         }
                    //     });
                    // }
                }
            }
        
            return View;
        })();
    
    function createView(i_definitions){
        return new View(i_definitions);    
    }

    function createInstance(){
        if (!m_instance) m_instance = new ViewsFactoryInstance();
        return m_instance;
    }

    return createInstance();
})();

$pow.ServicesFactory = (function(){
    var m_instance,
        ServicesFactoryInstance = (function(createService){
            function ServicesFactoryInstance(){}

            ServicesFactoryInstance.prototype.Create = function(i_definitions){
                if (isValidDefinitions(i_definitions)){
                    var _service = createService(i_definitions);
                    $pow.Store.Add(i_definitions.Identifier, _service);
                    return _service;
                }
            }

            function isValidDefinitions(i_definitions){
                return (typeof i_definitions !== "undefined" 
                        && i_definitions 
                        && typeof i_definitions.Methods !== "undefined"
                        && typeof i_definitions.Identifier === "string")? 
                            true : false;
            }

            return ServicesFactoryInstance;
        })(createService),
        Service = (function(){
            function Service(i_definitions){
                this.Methods = {};
                this.Identifier = i_definitions.Identifier;
                this.UsingComponent = bindComponents(i_definitions.UsingComponent);
                Object.assign(this.Methods, i_definitions.Methods, {"UsingComponent": this.UsingComponent});
            }

            function bindComponents(i_using){
                //todo: attach each component as an internal object like -> Controller.http.post
                var o_using = {}
                if (i_using) {
                    var v_componentInstance = {};
                    for (var key in i_using) {
                        v_componentInstance = $pow.ComponentsFactory.Create(i_using[key]);
                        if (!v_componentInstance) console.warn("bad component: " + i_using[key]);
                        else o_using[i_using[key]] = v_componentInstance;
                    } 
                } 
                return o_using;
            }

            return Service;
        })();
    
    function createService(i_definitions){
        return new Service(i_definitions);    
    }

    function createInstance(){
        if (!m_instance) m_instance = new ServicesFactoryInstance();
        return m_instance;
    }

    return createInstance();
})();