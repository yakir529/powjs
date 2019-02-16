//----------------------------------------------------------------/ POW /----------------------------------------------------------------//
var $pow = $pow || {};

//----------------------------------------------------------------/ POLYFILLS /----------------------------------------------------------------//
if (!window.Promise || typeof window.Promise == "undefined") {
    !function (e, n) { "object" == typeof exports && "undefined" != typeof module ? n() : "function" == typeof define && define.amd ? define(n) : n() }(0, function () { "use strict"; function e(e) { var n = this.constructor; return this.then(function (t) { return n.resolve(e()).then(function () { return t }) }, function (t) { return n.resolve(e()).then(function () { return n.reject(t) }) }) } function n() { } function t(e) { if (!(this instanceof t)) throw new TypeError("Promises must be constructed via new"); if ("function" != typeof e) throw new TypeError("not a function"); this._state = 0, this._handled = !1, this._value = undefined, this._deferreds = [], u(e, this) } function o(e, n) { for (; 3 === e._state;) e = e._value; 0 !== e._state ? (e._handled = !0, t._immediateFn(function () { var t = 1 === e._state ? n.onFulfilled : n.onRejected; if (null !== t) { var o; try { o = t(e._value) } catch (f) { return void i(n.promise, f) } r(n.promise, o) } else (1 === e._state ? r : i)(n.promise, e._value) })) : e._deferreds.push(n) } function r(e, n) { try { if (n === e) throw new TypeError("A promise cannot be resolved with itself."); if (n && ("object" == typeof n || "function" == typeof n)) { var o = n.then; if (n instanceof t) return e._state = 3, e._value = n, void f(e); if ("function" == typeof o) return void u(function (e, n) { return function () { e.apply(n, arguments) } }(o, n), e) } e._state = 1, e._value = n, f(e) } catch (r) { i(e, r) } } function i(e, n) { e._state = 2, e._value = n, f(e) } function f(e) { 2 === e._state && 0 === e._deferreds.length && t._immediateFn(function () { e._handled || t._unhandledRejectionFn(e._value) }); for (var n = 0, r = e._deferreds.length; r > n; n++) o(e, e._deferreds[n]); e._deferreds = null } function u(e, n) { var t = !1; try { e(function (e) { t || (t = !0, r(n, e)) }, function (e) { t || (t = !0, i(n, e)) }) } catch (o) { if (t) return; t = !0, i(n, o) } } var c = setTimeout; t.prototype["catch"] = function (e) { return this.then(null, e) }, t.prototype.then = function (e, t) { var r = new this.constructor(n); return o(this, new function (e, n, t) { this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof n ? n : null, this.promise = t }(e, t, r)), r }, t.prototype["finally"] = e, t.all = function (e) { return new t(function (n, t) { function o(e, f) { try { if (f && ("object" == typeof f || "function" == typeof f)) { var u = f.then; if ("function" == typeof u) return void u.call(f, function (n) { o(e, n) }, t) } r[e] = f, 0 == --i && n(r) } catch (c) { t(c) } } if (!e || "undefined" == typeof e.length) throw new TypeError("Promise.all accepts an array"); var r = Array.prototype.slice.call(e); if (0 === r.length) return n([]); for (var i = r.length, f = 0; r.length > f; f++) o(f, r[f]) }) }, t.resolve = function (e) { return e && "object" == typeof e && e.constructor === t ? e : new t(function (n) { n(e) }) }, t.reject = function (e) { return new t(function (n, t) { t(e) }) }, t.race = function (e) { return new t(function (n, t) { for (var o = 0, r = e.length; r > o; o++) e[o].then(n, t) }) }, t._immediateFn = "function" == typeof setImmediate && function (e) { setImmediate(e) } || function (e) { c(e, 0) }, t._unhandledRejectionFn = function (e) { void 0 !== console && console && console.warn("Possible Unhandled Promise Rejection:", e) }; var l = function () { if ("undefined" != typeof self) return self; if ("undefined" != typeof window) return window; if ("undefined" != typeof global) return global; throw Error("unable to locate global object") }(); "Promise" in l ? l.Promise.prototype["finally"] || (l.Promise.prototype["finally"] = e) : l.Promise = t });
}

if (!String.prototype.Format) {
    /*/ add string format method as buffer so no need to use the + operator in numerus times (optimal when you need more then 5 + operators) /*/
    String.prototype.Format = function () {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var argumentsToReturn = typeof arguments[0];

        argumentsToReturn = (("string" === argumentsToReturn || "number" === argumentsToReturn) ? arguments : arguments[0]);

        return str.replace(/\{([0-9]+)\}/g, function (key, val) {
            return argumentsToReturn[val];
        });
    };
}

if (!String.prototype.ToBoolean) {
    String.prototype.ToBoolean = function () {
        return this.toLowerCase() === 'true';
    };
}

//----------------------------------------------------------------/ FACTORIES /----------------------------------------------------------------//
$pow.Injector = (function(){
    var m_instance,
        InjectionHandler = (function(){
            function InjectionHandler(){}

            InjectionHandler.prototype.GetComponents = function(){
                return {
                    "http": (function(){
                        var Caller = (function(){
                                function Caller(){ }
                    
                                Caller.prototype.Post = function(i_path, i_dataToSend, i_callback){
                                    if (isValidCall("post", i_path, i_dataToSend, i_callback)) {
                                        var xhr = new XMLHttpRequest();
                                        
                                        xhr.open('POST', i_path);
                                        xhr.onload = function() {
                                            if (xhr.status === 200) {
                                                i_callback(xhr.responseText);
                                            }
                                        };
                                        
                                        if (i_dataToSend) xhr.send(encodeURI(i_dataToSend));
                                        else xhr.send();
                                    }
                                }
                                
                                Caller.prototype.Get = function(i_path, i_callback){
                                    if (isValidCall("get", i_path, null, i_callback)) {
                                        var xhr = new XMLHttpRequest();
                                        
                                        xhr.open('GET', i_path);
                                        xhr.onload = function() {
                                            if (xhr.status === 200) {
                                                i_callback(xhr.responseText);
                                            }
                                        };
                                        xhr.send(encodeURI(i_path));
                                    }
                                }
                    
                                function isValidCall(i_callType, i_path, i_dataToSend, i_callback){
                                    return (i_path 
                                            && typeof i_path == "string" 
                                            && (!i_callback 
                                                || (i_callback 
                                                    && typeof i_callback == "function")))? true : false;
                                }
                    
                                return Caller;
                            })();
                    
                        return {
                            GetInstance: function(){
                                return new Caller();
                            }
                        };
                    })()
                };
            }

            return InjectionHandler;
        })();

    function createInstance(){
        if (!m_instance) m_instance = new InjectionHandler();
        return m_instance;    
    }

    return createInstance();
})();

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
                                m_componentsList = $pow.Injector.GetComponents();
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
                this.Using = bindComponents(i_definitions.Using);
            }

            function bindComponents(i_using){
                //todo: attach each component as an internal object like -> Controller.http.post
                var o_using = {}
                if (i_using) {
                    var v_componentInstance = {};
                    for (const key in i_using) {
                        v_componentInstance = $pow.ComponentsFactory.Create(i_using[key]);
                        if (!v_componentInstance) console.warn("bad component: " + i_using[key]);
                        else o_using[i_using[key]] = v_componentInstance;
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
                    for (const key in _listenters) {
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
                var _listenters = Object.getOwnPropertyNames(i_actionsList);
                i_actionsList.Controller = i_controller;
        
                for (const key in _listenters) {
                    if (document.addEventListener) {
                        i_actionsList[_listenters[key]]["AttachTo"].addEventListener(i_actionsList[_listenters[key]]["Event"], function( e ){ 
                            if (e.target === document.querySelector(i_actionsList[_listenters[key]]["Selector"])) { 
                                i_actionsList.Controller.Methods[i_actionsList[_listenters[key]]["Delegate"]].apply(e.target, [e, i_actionsList.Controller.Using, i_actionsList[_listenters[key]]["Invoke"]]);
                            }
                        }, i_actionsList[_listenters[key]]["Bubble"] || false);
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