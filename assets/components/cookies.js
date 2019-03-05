var $pow = $pow || {};
$pow.Components = $pow.Components || {};

$pow.Components.Cookies = (function () {
    var m_instance,
        CookiesHandler = (function () {
            function CookiesHandler()
            { }

            CookiesHandler.prototype.Get = function (i_key) {
                var o_res = null,
                    v_hasMatch = document.cookie.match(i_key + '[^;]+');

                if (v_hasMatch) {
                    o_res = unescape(v_hasMatch[0].substr(i_key.length + 1));
                }

                return o_res;
            }

            CookiesHandler.prototype.Set = function (i_cookieData) {
                if (!i_cookieData || !i_cookieData.key || !i_cookieData.value) console.log("No data was submmited");
                else {
                    var _defaultCookieOptions = getCookieDefaultOptions(),
                        _expires = "",
                        _path = i_cookieData.path ? i_cookieData.path : _defaultCookieOptions.path,
                        v_days = i_cookieData.expireDays ? i_cookieData.expireDays : _defaultCookieOptions.expireDays,
                        v_hours = i_cookieData.expireHours ? i_cookieData.expireHours : _defaultCookieOptions.expireHours,
                        v_minuts = i_cookieData.expireMinuts ? i_cookieData.expireMinuts : _defaultCookieOptions.expireMinuts,
                        v_seconds = i_cookieData.expireSeconds ? i_cookieData.expireSeconds : _defaultCookieOptions.expireSeconds,
                        v_days = v_days * 24 * 60 * 60 * 1000,
                        v_hours = v_hours * 60 * 60 * 1000,
                        v_minuts = v_minuts * 60 * 1000,
                        v_seconds = v_seconds * 1000,
                        c_endTimeStamp = v_days + v_hours + v_minuts + v_seconds;

                    var expirationDate = new Date();
                    expirationDate.setTime(date.getTime() + c_endTimeStamp);

                    setCookie(i_cookieData.key, i_cookieData.value, expirationDate.toUTCString(), _path);
                }
            }

            CookiesHandler.prototype.Earse = function (i_key) {
                setCookie(i_key, null, "Thu, 01 Jan 1970 00:00:01 GMT", "/");
            }

            function setCookie(i_key, i_value, i_expire, i_path) {
                document.cookie = "{0}={1}; expires={2}; path={3};".Format([i_key, i_value, i_expire, i_path]);
            }

            function getCookieDefaultOptions() {
                return {
                    expireDays: 0,
                    expireHours: 0,
                    expireMinuts: 20,
                    expireSeconds: 0,
                    path: "/"
                };
            }

            return CookiesHandler;
        })();

    return {
        GetInstance: function () {
            return new CookiesHandler();
        }
    };
})();