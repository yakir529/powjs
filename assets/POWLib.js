//----------------------------------------------------------------/ POW /----------------------------------------------------------------//
var $pow = $pow || {};

//----------------------------------------------------------------/ FACTORIES /----------------------------------------------------------------//
$pow.Store = (function () {
    var m_instance,
        StoreHandler = (function () {
            var m_storage = {};
            function StoreHandler() {
                this.Components = getComponents();
            }

            StoreHandler.prototype.Add = function (i_slug, i_data) {
                m_storage[i_slug] = i_data;
            }

            StoreHandler.prototype.Get = function (i_slug) {
                return m_storage[i_slug];
            }

            StoreHandler.prototype.IsExists = function (i_slug) {
                return m_storage[i_slug] || this.Components.IsExists(i_slug) ? true : false;
            }

            function getComponents() {
                return (function () {
                    var m_componentsInstance,
                        ComponentsHandler = (function () {
                            var m_componentsList = {};

                            function ComponentsHandler() {
                                m_componentsList = $pow.Components;
                            }

                            ComponentsHandler.prototype.GetInstanceOf = function (i_componentName) {
                                return m_componentsList[i_componentName].GetInstance();
                            }

                            ComponentsHandler.prototype.IsExists = function (i_componentName) {
                                return m_componentsList[i_componentName] ? true : false;
                            }

                            return ComponentsHandler;
                        })();

                    function createInstance() {
                        if (!m_componentsInstance) m_componentsInstance = new ComponentsHandler();
                        return m_componentsInstance;
                    }

                    return createInstance();
                })();
            }

            return StoreHandler;
        })();

    function createInstance() {
        if (!m_instance) m_instance = new StoreHandler();
        return m_instance;
    }

    return createInstance();
})();

$pow.ComponentsFactory = (function () {
    var m_instance,
        ComponentsFactoryInstance = (function () {
            function ComponentsFactoryInstance() { }

            ComponentsFactoryInstance.prototype.Create = function (i_componentName) {
                if (isValidComponent(i_componentName)) {
                    return $pow.Store.Components.GetInstanceOf(i_componentName);
                }
            }

            function isValidComponent(i_componentName) {
                return (typeof i_componentName !== "undefined"
                    && i_componentName
                    && i_componentName.length
                    && isComponentExists(i_componentName)) ?
                    true : false;
            }

            function isComponentExists(i_componentName) {
                return $pow.Store.IsExists(i_componentName);
            }

            return ComponentsFactoryInstance;
        })();

    function createInstance() {
        if (!m_instance) m_instance = new ComponentsFactoryInstance();
        return m_instance;
    }

    return createInstance();
})();

$pow.ControllersFactory = (function () {
    var m_instance,
        ControllersFactoryInstance = (function (createController) {
            function ControllersFactoryInstance() { }

            ControllersFactoryInstance.prototype.Create = function (i_definitions) {
                if (isValidDefinitions(i_definitions)) {
                    var _controller = createController(i_definitions);
                    $pow.Store.Add(i_definitions.Identifier, _controller);
                }
            }

            function isValidDefinitions(i_definitions) {
                return (typeof i_definitions !== "undefined"
                    && i_definitions
                    && typeof i_definitions.Methods !== "undefined"
                    && typeof i_definitions.Identifier === "string") ?
                    true : false;
            }

            return ControllersFactoryInstance;
        })(createController),
        Controller = (function () {
            function Controller(i_definitions) {
                this.Methods = i_definitions.Methods;
                this.Identifier = i_definitions.Identifier;
                this.UsingService = bindServices(i_definitions.UsingService);
            }

            function bindServices(i_using) {
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

    function createController(i_definitions) {
        return new Controller(i_definitions);
    }

    function createInstance() {
        if (!m_instance) m_instance = new ControllersFactoryInstance();
        return m_instance;
    }

    return createInstance();
})();

$pow.View = (function () {
    var m_instance,
        ViewHandler = (function () {
            var EventConsumer = (function () {
                var m_eventName,m_selector,m_elementToAttach,m_invokeIMPL,m_delegate,m_bubble,m_identifier;

                function EventConsumer(i_definitions) { 
                    m_eventName = i_definitions.Event? i_definitions.Event : null;
                    m_selector = i_definitions.Selector? i_definitions.Selector : null;
                    m_elementToAttach = i_definitions.AttachTo? i_definitions.AttachTo : document;
                    m_invokeIMPL = i_definitions.Invoke? i_definitions.Invoke : null;
                    m_delegate = i_definitions.Delegate? i_definitions.Delegate : null;
                    m_bubble = i_definitions.Bubble? i_definitions.Bubble : false;
                    m_identifier = i_definitions.Identifier? i_definitions.Identifier : "";
                }

                EventConsumer.prototype.When = function (i_eventName) {
                    m_eventName = i_eventName;
                    return this;
                }

                EventConsumer.prototype.On = function (i_selector, i_elementToAttach) {
                    m_selector = i_selector;
                    if (typeof i_elementToAttach != "undefined" && i_elementToAttach) m_elementToAttach = i_elementToAttach;
                    return this;
                }

                EventConsumer.prototype.InvokeToDelegation = function (i_invokeIMPL) {
                    m_invokeIMPL = i_invokeIMPL;
                    return this;
                }
                
                EventConsumer.prototype.Delegate = function (i_controllerName, i_method, i_callbackIMPL) {
                    // function ready(i_fn) {
                    //     if (document.readyState != 'loading') i_fn();
                    //     else if (document.addEventListener) document.addEventListener('DOMContentLoaded', i_fn);
                    //     else {
                    //         document.attachEvent('onreadystatechange', function () {
                    //             if (document.readyState != 'loading') i_fn();
                    //         });
                    //     }
                    // }

                    var _controller = $pow.Store.Get(i_controllerName),
                        _usingServicesArr = Object.getOwnPropertyNames(_controller.UsingService),
                        _services = {};

                    for (var key = 0; key < _usingServicesArr.length; key++) {
                        _services[_usingServicesArr[key]] = _controller.UsingService[_usingServicesArr[key]].Methods;
                    }

                    if (document.addEventListener) {
                        m_elementToAttach.addEventListener(m_eventName, function (e) {
                            if (e.target === document.querySelector(m_selector)) {
                                var o_data = (typeof m_invokeIMPL === "function")? m_invokeIMPL(e) : {};
                                _controller.Methods[i_method].apply(e.target, [e, _services, o_data, i_callbackIMPL]);
                            }
                        }, m_bubble);
                    } else {
                        m_elementToAttach.attachEvent( 'on' + m_eventName, function( e ){ 
                            if (e.srcElement === document.querySelector(m_selector)) { 
                                var o_data = (typeof m_invokeIMPL === "function")? m_invokeIMPL(e) : {};
                                _controller.Methods[i_method].apply(e.target, [e, _services, o_data, i_callbackIMPL]);
                            }
                        });
                    }
                }

                return EventConsumer;
            })();

            function ViewHandler() { }

            function isValidDefinitions(i_definitions){
                return (typeof i_definitions != "undefined" 
                    && i_definitions 
                    && i_definitions.Identifier)? true : false;
            }

            ViewHandler.prototype.CreateEventConsumer = function (i_definition) {
                if (typeof i_definition === "string" && i_definition.length){
                    var _eventConsumer = new EventConsumer();
                    $pow.Store.Add(i_definition, _eventConsumer);
                } else if (isValidDefinitions(i_definition)) {
                    var _eventConsumer = new EventConsumer(i_definition);
                    $pow.Store.Add(i_definition.Identifier, _eventConsumer);
                }
                return _eventConsumer;
            }

            return ViewHandler;
        })();

    function createInstance() {
        if (!m_instance) m_instance = new ViewHandler();
        return m_instance;
    }

    return createInstance();
})()

$pow.ServicesFactory = (function () {
    var m_instance,
        ServicesFactoryInstance = (function (createService) {
            function ServicesFactoryInstance() { }

            ServicesFactoryInstance.prototype.Create = function (i_definitions) {
                if (isValidDefinitions(i_definitions)) {
                    var _service = createService(i_definitions);
                    $pow.Store.Add(i_definitions.Identifier, _service);
                    return _service;
                }
            }

            function isValidDefinitions(i_definitions) {
                return (typeof i_definitions !== "undefined"
                    && i_definitions
                    && typeof i_definitions.Methods !== "undefined"
                    && typeof i_definitions.Identifier === "string") ?
                    true : false;
            }

            return ServicesFactoryInstance;
        })(createService),
        Service = (function () {
            function Service(i_definitions) {
                this.Methods = {};
                this.Identifier = i_definitions.Identifier;
                this.UsingComponent = bindComponents(i_definitions.UsingComponent);
                Object.assign(this.Methods, i_definitions.Methods, { "UsingComponent": this.UsingComponent });
            }

            function bindComponents(i_using) {
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

    function createService(i_definitions) {
        return new Service(i_definitions);
    }

    function createInstance() {
        if (!m_instance) m_instance = new ServicesFactoryInstance();
        return m_instance;
    }

    return createInstance();
})();