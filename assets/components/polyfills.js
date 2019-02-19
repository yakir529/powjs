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

if (typeof Object.assign != 'function') {
    Object.defineProperty(Object, "assign", {
        value: function assign(i_target, varArgs) {
            'use strict';
            if (i_target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var _dest = Object(i_target);

            for (var i = 1; i < arguments.length; i++) {
                var _nextSource = arguments[i];

                if (_nextSource != null) {
                    for (var nextKey in _nextSource) {
                        if (Object.prototype.hasOwnProperty.call(_nextSource, nextKey)) {
                            _dest[nextKey] = _nextSource[nextKey];
                        }
                    }
                }
            }
            return _dest;
        },
        writable: true,
        configurable: true
    });
}

if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj) {
        var descriptors = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                descriptors[prop] = Object.getOwnPropertyDescriptor(obj, prop);
            }
        }
        return descriptors;
    };
}