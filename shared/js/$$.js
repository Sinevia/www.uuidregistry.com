/* 
 * Action.js - The JavaScript Application Framework
 * Copyright@2013 Sinevia Ltd All rights reserved
 */

/**
 * This is the main class for the framework
 * @type $$
 * @version 4.0
 */
var $$ = (function () {
    /* START: Data */
    var _config = {
        uniqueId: '$$',
        routeExtension: '.html',
        rootUrl: '',
        routes: [],
        required: []
    };

    this.config = function (config) {
        if (typeof config !== 'undefined') {
            $.extend(_config, config);
            return this;
        }
        return _config;
    };

    this.registry = function () {
        return new Registry(config.uniqueId);
    };
    /* END: Data */


    /* START: Private Scope */
    function trim(str, chr) {
        var rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^' + chr + '+|' + chr + '+$', 'g');
        return str.replace(rgxtrim, '');
    }

    function Registry(namespace) {
        var namespace = typeof namespace === "undefined" ? '' : "@" + namespace;
        var noLs = typeof window.localStorage == "undefined" ? false : true;
        
        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires += "; expires=" + date.toGMTString();
            }
            document.cookie = name + "=" + escape(value) + expires + "; path=/";
            console.log("cookie saved :" + value);
        }


        function getCookie(key) {
            var start, end;

            if (document.cookie.length > 0) {
                start = document.cookie.indexOf(key + "=");

                if (start != -1) {
                    start = start + key.length + 1;
                    end = document.cookie.indexOf(";", start);

                    if (end == -1) {
                        end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(start, end));
                }
            }
            return "";
        }

        function removeCookie(key) {
            this.set(key, '', -1);
        }
        /**
         * Gets a key from the key-vaue store, if it does not exist returns NULL
         * @param {string} key
         * @returns {Object}
         */
        this.get = function (key) {
            var key = key + namespace;
//            if (noLs) {
//                var value = getCookie(key);
//                if (value === "") {
//                    return null;
//                }
//                return JSON.parse(value);
//            }
            if (localStorage.getItem(key) !== null) {
                var expiresDate = localStorage.getItem(key + "&&expires");
                if (expiresDate === null) {
                    return null;
                }
                var expires = new Date(expiresDate);
                var now = new Date();
                var isExpired = now.getTime() > expires.getTime() ? true : false;
                if (isExpired) {
                    this.remove(key);
                    return null;
                }
                var value = window.localStorage.getItem(key);
                return JSON.parse(value);
            } else {
                return null;
            }
        };

        /**
         * Sets a value to a key
         * @param {string} key
         * @param {Object} value
         * @param {number} expires
         * @returns {void}
         */
        this.set = function (key, value, expires) {
            var expires = typeof expires === "undefined" ? 60000000000 : expires * 1000;
            var key = key + namespace;
//            if (noLs) {
//                setCookie(key, value);
//                return;
//            }
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                value = JSON.stringify(value);
                localStorage.setItem(key, value);
                var expiresTime = ((new Date()).getTime() + expires);
                var expires = new Date();
                expires.setTime(expiresTime);
                localStorage.setItem(key + "&&expires", expires);
            }
        };
        this.remove = function (key) {
            var key = key + namespace;
//            if (noLs) {
//                removeCookie(key);
//                return;
//            }
            localStorage.removeItem(key);
        };
        this.empty = function () {
            if (noLs) {
                return;
            }
            var keys = Object.keys(localStorage);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key.indexOf(namespace) > -1) {
                    localStorage.removeItem(key);
                }
            }
        };
    }
    /* END: Private Scope*/

    this.toRoute = function (route, data) {
        var rootUrl = trim(this.config().rootUrl, '/') + '/';
        var route = trim(route) + this.config().routeExtension;
        var url = rootUrl + route;
        if (typeof data !== 'undefined') {
            url += '?' + $.param(data);
        }
        window.location.href = url;
    };

    /**
     * Returns the current route
     * @returns {String}
     */
    this.route = function () {
        var url = this.url();
        var route = url.substr(this.config().rootUrl.length).split('.html').join('');
        route = trim(route, '/');
        return route;
    };

    /**
     * Returns the current URL
     * @returns {DOMString}
     */
    this.url = function () {
        return window.location.href;
    };

    /**
     * Returns the specified URL parameter, or null if does not exist
     * @param {String} parameter
     * @returns {String|null}
     */
    this.urlParam = function (parameter) {
        var parameters = this.urlParams();
        return typeof parameters[parameter] === "undefined" ? null : parameters[parameter];
    };

    /**
     * Returns the URL parameters
     * @returns {Array}
     */
    this.urlParams = function () {
        var s = window.location.search.substring(1).split('&');
        var p = {};
        if (!s.length) {
            return p;
        }
        for (var i = 0; i < s.length; i++) {
            var parts = s[i].split('=');
            p[unescape(parts[0])] = unescape(parts[1]);
        }
        return p;
    };

    this.initialize = function () {
        loadFavicon(this.config().rootUrl);

        for (var i = 0; i < this.config().required.length; i++) {
            var requiredFile = this.config().required[i];
            if (strStartsWith(requiredFile, 'http://') === false && strStartsWith(requiredFile, 'https://') === false && strStartsWith(requiredFile, '//') === false) {
                requiredFile = this.config().rootUrl + requiredFile;
            }
            if (strEndsWith(requiredFile, '.css') === true) {
                loadCss(requiredFile);
            } else {
                loadScript(requiredFile);
            }
        }

        $(function () {
            loadWidgets();
        });

        /**
         * Loads CSS file
         * @param {String} url
         * @returns {void}
         */
        function loadCss(url) {
            document.write('<link href="' + url + '" rel="stylesheet" />');
        }

        function loadFavicon(rootUrl) {
            document.write('<link rel="shortcut icon" type="image/x-icon" href="' + rootUrl + 'favicon.ico" />');
        }

        /**
         * Loads JavaScript file
         * @param {String} url
         * @returns {void}
         */
        function loadScript(url) {
            document.write('<script src="' + url + '"></script>');
        }

        /**
         * Loads widgets
         * @returns {void}
         */
        function loadWidgets() {
            $('div[data-widget-url]').each(function () {
                var url = $(this).data('widget-url');
                var mode = $(this).data('widget-mode');
                var cacheTime = parseInt($(this).data('widget-cache'));

                if (cacheTime > 0) {
                    var cache = this.registry().get('WidgetCache:' + url);
                    if (cache !== null) {
                        if (mode === 'replace') {
                            $(this).replaceWith(cache);
                        } else {
                            $(this).html(cache);
                        }
                        return;
                    }
                }
                $(this).load(url, function () {
                    if (cacheTime > 0) {
                        registry.set('WidgetCache:' + url, $(this).html(), cacheTime);
                    }
                    if (mode === 'replace') {
                        $(this).replaceWith($(this).html());
                    }
                });
            });
        }

        /**
         * Checks if string ends with specified substring
         * @param {String} str
         * @param {String} needle
         * @returns {Boolean}
         */
        function strEndsWith(str, needle) {
            return str.indexOf(needle, str.length - needle.length) !== -1;
        }

        /**
         * Checks if string starts with specified substring
         * @param {String} str
         * @param {String} needle
         * @returns {Boolean}
         */
        function strStartsWith(str, needle) {
            return str.indexOf(needle) === 0;
        }
    };

    return this;
})();
//
//
//
//$$.helper = {
//    snakeToCamel: function (str) {
//        return str.replace(/(\-\w)/g, function (m) {
//            return m[1].toUpperCase();
//        });
//    },
//    startsWith: function (str) {
//        return this.indexOf(str) === 0;
//    }
//};