function WebService(endpointUrl) {
    var _data = {};

    this.data = function (data) {
        _data = data;
        return this;
    };
    this.call = function () {
        console.log(_data);
        var promise = $.ajax({
            type: 'POST',
            url: endpointUrl + '?ts=' + Math.round(+new Date() / 1000),
            crossDomain: true,
            cache: false,
            dataType: 'jsonp',
            data: _data
        });

        _data = {}; // Cleanup

        return promise;
    };

    this.uploadFile = function (form) {
        var formData = new FormData(form);
        var promise = $.ajax({
            url: endpointUrl + '?ts=' + Math.round(+new Date() / 1000) + '&' +$.param(_data),
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST'
        });
        return promise;
    };
}



function WebServiceV1(endpointUrl) {
    this.debug = false;

    this.RESPONSE_AUTH_FAILURE = "-1";
    this.RESPONSE_OK = "0";

    var endpointUrl = endpointUrl;
    var successCallback = null;
    var beforeSuccessCallback = null;
    var errorCallback = null;
    var beforeErrorCallback = null;
    var endCallback = null;

    this.success = function (fn) {
        successCallback = fn;
        return this;
    };
    this.error = function (fn) {
        errorCallback = fn;
        return this;
    };
    this.end = function (fn) {
        endCallback = fn;
        return this;
    };
    this.beforeError = function (fn) {
        beforeErrorCallback = fn;
        return this;
    };
    this.beforeSuccess = function (fn) {
        beforeSuccessCallback = fn;
        return this;
    };


    this.call = function (data) {
        var success = successCallback === null ? function () {
        } : successCallback;
        var error = errorCallback === null ? function () {
        } : errorCallback;
        var end = endCallback === null ? function () {
        } : endCallback;
        var beforeError = beforeSuccessCallback === null ? function () {
        } : beforeSuccessCallback;
        var beforeSuccess = beforeErrorCallback === null ? function () {
        } : beforeErrorCallback;

        $.ajax({
            type: 'POST',
            url: endpointUrl + '?ts=' + Math.round(+new Date() / 1000),
            crossDomain: true,
            cache: false,
            dataType: 'jsonp',
            data: data
        }).success(function (data) {
            beforeSuccess(data);
            success(data);
        }).error(function (xhr, status, err) {
            beforeError(err);
            console.log(err);
            error(err);
        }).complete(function () {
            end();
        });

        successCallback = null;
        errorCallback = null;
        endCallback = null;
        beforeErrorCallback = null;
        beforeSuccessCallback = null;
    };

    /**
     * Calls the API with the specified command and the given
     * parameters
     * @param {string} cmd
     * @param {Object} data
     * @param {function} callback_success
     * @param {function} callback_error
     * @param {function} callback_complete
     * @returns {void}
     */
    this.get = function (data, callback_success, callback_error, callback_complete) {
        // Add token
        //if ($$.getCurrentUser() !== null) {
        //    data['token'] = $$.registry.get('token');
        //}
        $.ajax({
            type: 'POST',
            url: this.endpointUrl + '?ts=' + Math.round(+new Date() / 1000),
            crossDomain: true,
            cache: false,
            dataType: 'jsonp',
            data: data
        }).success(function (data) {
            //if (typeof data['token'] !== 'undefined') {
            //    $$.registry.set('token', data['token']);
            //}
            callback_success(data);
        }).error(function (xhr, status, error) {
            console.log(error);
            if (typeof callback_error !== "undefined") {
                callback_error();
            }
        }).complete(function () {
            if (typeof callback_complete !== "undefined") {
                callback_complete();
            }
        });
    };
}