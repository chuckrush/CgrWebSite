/*
Date: 2011-12-15
Author: Rick Schott
Plug-in Name: ajaxify
Description: Plugin designed for HigherLogic's CMS to render ASP.NET UserControls through WCF

*/
; (function ($) {   

        $.fn.ajaxify = function (settings) {
        // Create some defaults, extending them with any options that were provided
        var options = {
            'contentId': '',
            'postData': {},
            'RESTUrl': '/Service/AjaxContent.svc/GetAJAXControl',
            'ajaxSpinnerId': '',
            'autoRefresh': false,
            'refreshInterval': 30000,
            'pauseInterval': 1500

        };

        $.extend(options, settings);

        function getQueryString() {
            var result = {};
            var queryString = location.search.substring(1);
            var re = /([^&=]+)=([^&]*)/g;
            var m;

            while (m = re.exec(queryString)) {
                result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }

            return result;
        };
        function includeArrayObject(arr, obj) {
            return (arr.indexOf(obj) != -1);
        };

        function init(options) {           
           
             var qsParams = getQueryString();
            if (options.postData.ajaxControlViewModel.ControlParams instanceof Array) {
               
                jQuery.each(qsParams, function (name, value) {
                    var newObject = { Key: name, Value: value };
                    if (!includeArrayObject(options.postData.ajaxControlViewModel.ControlParams, newObject)) {
                        options.postData.ajaxControlViewModel.ControlParams.push(newObject);
                    }
                });
            }
            else
            {
                jQuery.each(qsParams, function (name, value) {
                    options.postData.ajaxControlViewModel.ControlParams[name] = value;
                });
            }

            //if params overridden but still 0, use defaults
            var __pause = 1500;
            var __refreshInterval = 30000;
            if (options.pauseInterval == 0) { options.pauseInterval = __pause; }
            if (options.refreshInterval == 0) { options.refreshInterval = __refreshInterval; }

            setTimeout(function () {
                $.ajax({
                    type: "POST",
                    url: options.RESTUrl,
                    data: JSON.stringify(options.postData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        if (msg.hasOwnProperty('d')) {
                            msg = msg.d;
                        }
                        setTimeout(function () {
                           
                            $('#' + options.ajaxSpinnerId).hide();
                            $('#' + options.contentId).html(msg).fadeTo('slow', 1);

                            if (options.autoRefresh) {
                                setInterval(function () {
                                    $('#' + options.ajaxSpinnerId).show();
                                    $('#' + options.contentId).fadeTo("slow", 0.4);
                                   
                                    reload(options);

                                }, options.refreshInterval);
                            }

                        }, options.pauseInterval); //can adjust if web service returns too fast


                    }
                });
            }, 0); //force browser async threading
        };

        function reload(options) {
            $.ajax({
                type: "POST",
                url: options.RESTUrl,
                data: JSON.stringify(options.postData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    if (msg.hasOwnProperty('d')) {
                        msg = msg.d;
                    }
                    setTimeout(function () {
                        $('#' + options.ajaxSpinnerId).hide();
                        $('#' + options.contentId).html(msg).fadeTo('slow', 1);

                    }, options.pauseInterval); //can adjust if web service returns too fast


                }
            });
        };

        init(options);
    };


})(jQuery);
         
         

/*
http://www.JSON.org/json2.js
2011-10-19

Public Domain.

NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

See http://www.JSON.org/js.html


This code should be minified before deployment.
See http://javascript.crockford.com/jsmin.html

USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
NOT CONTROL.


This file creates a global JSON object containing two methods: stringify
and parse.

JSON.stringify(value, replacer, space)
value       any JavaScript value, usually an object or array.

replacer    an optional parameter that determines how object
values are stringified for objects. It can be a
function or an array of strings.

space       an optional parameter that specifies the indentation
of nested structures. If it is omitted, the text will
be packed without extra whitespace. If it is a number,
it will specify the number of spaces to indent at each
level. If it is a string (such as '\t' or '&nbsp;'),
it contains the characters used to indent at each level.

This method produces a JSON text from a JavaScript value.

When an object value is found, if the object contains a toJSON
method, its toJSON method will be called and the result will be
stringified. A toJSON method does not serialize: it returns the
value represented by the name/value pair that should be serialized,
or undefined if nothing should be serialized. The toJSON method
will be passed the key associated with the value, and this will be
bound to the value

For example, this would serialize Dates as ISO strings.

Date.prototype.toJSON = function (key) {
function f(n) {
// Format integers to have at least two digits.
return n < 10 ? '0' + n : n;
}

return this.getUTCFullYear()   + '-' +
f(this.getUTCMonth() + 1) + '-' +
f(this.getUTCDate())      + 'T' +
f(this.getUTCHours())     + ':' +
f(this.getUTCMinutes())   + ':' +
f(this.getUTCSeconds())   + 'Z';
};

You can provide an optional replacer method. It will be passed the
key and value of each member, with this bound to the containing
object. The value that is returned from your method will be
serialized. If your method returns undefined, then the member will
be excluded from the serialization.

If the replacer parameter is an array of strings, then it will be
used to select the members to be serialized. It filters the results
such that only members with keys listed in the replacer array are
stringified.

Values that do not have JSON representations, such as undefined or
functions, will not be serialized. Such values in objects will be
dropped; in arrays they will be replaced with null. You can use
a replacer function to replace those with JSON values.
JSON.stringify(undefined) returns undefined.

The optional space parameter produces a stringification of the
value that is filled with line breaks and indentation to make it
easier to read.

If the space parameter is a non-empty string, then that string will
be used for indentation. If the space parameter is a number, then
the indentation will be that many spaces.

Example:

text = JSON.stringify(['e', {pluribus: 'unum'}]);
// text is '["e",{"pluribus":"unum"}]'


text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

text = JSON.stringify([new Date()], function (key, value) {
return this[key] instanceof Date ?
'Date(' + this[key] + ')' : value;
});
// text is '["Date(---current time---)"]'


JSON.parse(text, reviver)
This method parses a JSON text to produce an object or array.
It can throw a SyntaxError exception.

The optional reviver parameter is a function that can filter and
transform the results. It receives each of the keys and values,
and its return value is used instead of the original value.
If it returns what it received, then the structure is not modified.
If it returns undefined then the member is deleted.

Example:

// Parse the text. Values that look like ISO date strings will
// be converted to Date objects.

myData = JSON.parse(text, function (key, value) {
var a;
if (typeof value === 'string') {
a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
if (a) {
return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
+a[5], +a[6]));
}
}
return value;
});

myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
var d;
if (typeof value === 'string' &&
value.slice(0, 5) === 'Date(' &&
value.slice(-1) === ')') {
d = new Date(value.slice(5, -1));
if (d) {
return d;
}
}
return value;
});


This is a reference implementation. You are free to copy, modify, or
redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
lastIndex, length, parse, prototype, push, replace, slice, stringify,
test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({ '': j }, '')
                    : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
} ());


/*!
* jQuery blockUI plugin
* Version 2.39 (23-MAY-2011)
* @requires jQuery v1.2.3 or later
*
* Examples at: http://malsup.com/jquery/block/
* Copyright (c) 2007-2010 M. Alsup
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Thanks to Amir-Hossein Sobhi for some excellent contributions!
*/

; (function ($) {

	if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1/.test($.fn.jquery)) {
		alert('blockUI requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
		return;
	}

	$.fn._fadeIn = $.fn.fadeIn;

	var noOp = function () { };

	// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
	// retarded userAgent strings on Vista)
	var mode = document.documentMode || 0;
	var setExpr = $.browser.msie && (($.browser.version < 8 && !mode) || mode < 8);
	var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent) && !mode;

	// global $ methods for blocking/unblocking the entire page
	$.blockUI = function (opts) { install(window, opts); };
	$.unblockUI = function (opts) { remove(window, opts); };

	// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
	$.growlUI = function (title, message, timeout, onClose) {
		var $m = $('<div class="growlUI"></div>');
		if (title) $m.append('<h1>' + title + '</h1>');
		if (message) $m.append('<h2>' + message + '</h2>');
		if (timeout == undefined) timeout = 3000;
		$.blockUI({
			message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
			timeout: timeout, showOverlay: false,
			onUnblock: onClose,
			css: $.blockUI.defaults.growlCSS
		});
	};

	// plugin method for blocking element content
	$.fn.block = function (opts) {
		return this.unblock({ fadeOut: 0 }).each(function () {
			if ($.css(this, 'position') == 'static')
				this.style.position = 'relative';
			if ($.browser.msie)
				this.style.zoom = 1; // force 'hasLayout'
			install(this, opts);
		});
	};

	// plugin method for unblocking element content
	$.fn.unblock = function (opts) {
		return this.each(function () {
			remove(this, opts);
		});
	};

	$.blockUI.version = 2.39; // 2nd generation blocking at no extra cost!

	// override these in your code to change the default behavior and style
	$.blockUI.defaults = {
		// message displayed when blocking (use null for no message)
		message: '<h1>Please wait...</h1>',

		title: null,   // title string; only used when theme == true
		draggable: true,  // only used when theme == true (requires jquery-ui.js to be loaded)

		theme: false, // set to true to use with jQuery UI themes

		// styles for the message when blocking; if you wish to disable
		// these and use an external stylesheet then do this in your code:
		// $.blockUI.defaults.css = {};
		css: {
			padding: 0,
			margin: 0,
			width: '30%',
			top: '40%',
			left: '35%',
			textAlign: 'center',
			color: '#000',
			border: '3px solid #aaa',
			backgroundColor: '#fff',
			cursor: 'wait'
		},

		// minimal style set used when themes are used
		themedCSS: {
			width: '30%',
			top: '40%',
			left: '35%'
		},

		// styles for the overlay
		overlayCSS: {
			backgroundColor: '#000',
			opacity: 0.6,
			cursor: 'wait'
		},

		// styles applied when using $.growlUI
		growlCSS: {
			width: '350px',
			top: '10px',
			left: '',
			right: '10px',
			border: 'none',
			padding: '5px',
			opacity: 0.6,
			cursor: 'default',
			color: '#fff',
			backgroundColor: '#000',
			'-webkit-border-radius': '10px',
			'-moz-border-radius': '10px',
			'border-radius': '10px'
		},

		// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
		// (hat tip to Jorge H. N. de Vasconcelos)
		iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

		// force usage of iframe in non-IE browsers (handy for blocking applets)
		forceIframe: false,

		// z-index for the blocking overlay
		baseZ: 1000,

		// set these to true to have the message automatically centered
		centerX: true, // <-- only effects element blocking (page block controlled via css above)
		centerY: true,

		// allow body element to be stetched in ie6; this makes blocking look better
		// on "short" pages.  disable if you wish to prevent changes to the body height
		allowBodyStretch: true,

		// enable if you want key and mouse events to be disabled for content that is blocked
		bindEvents: true,

		// be default blockUI will supress tab navigation from leaving blocking content
		// (if bindEvents is true)
		constrainTabKey: true,

		// fadeIn time in millis; set to 0 to disable fadeIn on block
		fadeIn: 200,

		// fadeOut time in millis; set to 0 to disable fadeOut on unblock
		fadeOut: 400,

		// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
		timeout: 0,

		// disable if you don't want to show the overlay
		showOverlay: true,

		// if true, focus will be placed in the first available input field when
		// page blocking
		focusInput: true,

		// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
		applyPlatformOpacityRules: true,

		// callback method invoked when fadeIn has completed and blocking message is visible
		onBlock: null,

		// callback method invoked when unblocking has completed; the callback is
		// passed the element that has been unblocked (which is the window object for page
		// blocks) and the options that were passed to the unblock call:
		//	 onUnblock(element, options)
		onUnblock: null,

		// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
		quirksmodeOffsetHack: 4,

		// class name of the message block
		blockMsgClass: 'blockMsg'
	};

	// private data and functions follow...

	var pageBlock = null;
	var pageBlockEls = [];

	function install(el, opts) {
		var full = (el == window);
		var msg = opts && opts.message !== undefined ? opts.message : undefined;
		opts = $.extend({}, $.blockUI.defaults, opts || {});
		opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
		var css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
		var themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
		msg = msg === undefined ? opts.message : msg;

		// remove the current block (if there is one)
		if (full && pageBlock)
			remove(window, { fadeOut: 0 });

		// if an existing element is being used as the blocking content then we capture
		// its current place in the DOM (and current display style) so we can restore
		// it when we unblock
		if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
			var node = msg.jquery ? msg[0] : msg;
			var data = {};
			$(el).data('blockUI.history', data);
			data.el = node;
			data.parent = node.parentNode;
			data.display = node.style.display;
			data.position = node.style.position;
			if (data.parent)
				data.parent.removeChild(node);
		}

		$(el).data('blockUI.onUnblock', opts.onUnblock);
		var z = opts.baseZ;

		// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
		// layer1 is the iframe layer which is used to supress bleed through of underlying content
		// layer2 is the overlay layer which has opacity and a wait cursor (by default)
		// layer3 is the message content that is displayed while blocking

		var lyr1 = ($.browser.msie || opts.forceIframe)
		? $('<iframe class="blockUI" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>')
		: $('<div class="blockUI" style="display:none"></div>');

		var lyr2 = opts.theme
		? $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + (z++) + ';display:none"></div>')
		: $('<div class="blockUI blockOverlay" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

		var lyr3, s;
		if (opts.theme && full) {
			s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:fixed">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
		}
		else if (opts.theme) {
			s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:absolute">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
		}
		else if (full) {
			s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:' + (z + 10) + ';display:none;position:fixed"></div>';
		}
		else {
			s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:' + (z + 10) + ';display:none;position:absolute"></div>';
		}
		lyr3 = $(s);

		// if we have a message, style it
		if (msg) {
			if (opts.theme) {
				lyr3.css(themedCSS);
				lyr3.addClass('ui-widget-content');
			}
			else
				lyr3.css(css);
		}

		// style the overlay
		if (!opts.theme && (!opts.applyPlatformOpacityRules || !($.browser.mozilla && /Linux/.test(navigator.platform))))
			lyr2.css(opts.overlayCSS);
		lyr2.css('position', full ? 'fixed' : 'absolute');

		// make iframe layer transparent in IE
		if ($.browser.msie || opts.forceIframe)
			lyr1.css('opacity', 0.0);

		//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
		var layers = [lyr1, lyr2, lyr3], $par = full ? $('body') : $(el);
		$.each(layers, function () {
			this.appendTo($par);
		});

		if (opts.theme && opts.draggable && $.fn.draggable) {
			lyr3.draggable({
				handle: '.ui-dialog-titlebar',
				cancel: 'li'
			});
		}

		// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
		var expr = setExpr && (!$.boxModel || $('object,embed', full ? null : el).length > 0);
		if (ie6 || expr) {
			// give body 100% height
			if (full && opts.allowBodyStretch && $.boxModel)
				$('html,body').css('height', '100%');

			// fix ie6 issue when blocked element has a border width
			if ((ie6 || !$.boxModel) && !full) {
				var t = sz(el, 'borderTopWidth'), l = sz(el, 'borderLeftWidth');
				var fixT = t ? '(0 - ' + t + ')' : 0;
				var fixL = l ? '(0 - ' + l + ')' : 0;
			}

			// simulate fixed position
			$.each([lyr1, lyr2, lyr3], function (i, o) {
				var s = o[0].style;
				s.position = 'absolute';
				if (i < 2) {
					full ? s.setExpression('height', 'Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:' + opts.quirksmodeOffsetHack + ') + "px"')
					 : s.setExpression('height', 'this.parentNode.offsetHeight + "px"');
					full ? s.setExpression('width', 'jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
					 : s.setExpression('width', 'this.parentNode.offsetWidth + "px"');
					if (fixL) s.setExpression('left', fixL);
					if (fixT) s.setExpression('top', fixT);
				}
				else if (opts.centerY) {
					if (full) s.setExpression('top', '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
					s.marginTop = 0;
				}
				else if (!opts.centerY && full) {
					var top = (opts.css && opts.css.top) ? parseInt(opts.css.top) : 0;
					var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + ' + top + ') + "px"';
					s.setExpression('top', expression);
				}
			});
		}

		// show the message
		if (msg) {
			if (opts.theme)
				lyr3.find('.ui-widget-content').append(msg);
			else
				lyr3.append(msg);
			if (msg.jquery || msg.nodeType)
				$(msg).show();
		}

		if (($.browser.msie || opts.forceIframe) && opts.showOverlay)
			lyr1.show(); // opacity is zero
		if (opts.fadeIn) {
			var cb = opts.onBlock ? opts.onBlock : noOp;
			var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
			var cb2 = msg ? cb : noOp;
			if (opts.showOverlay)
				lyr2._fadeIn(opts.fadeIn, cb1);
			if (msg)
				lyr3._fadeIn(opts.fadeIn, cb2);
		}
		else {
			if (opts.showOverlay)
				lyr2.show();
			if (msg)
				lyr3.show();
			if (opts.onBlock)
				opts.onBlock();
		}

		// bind key and mouse events
		bind(1, el, opts);

		if (full) {
			pageBlock = lyr3[0];
			pageBlockEls = $(':input:enabled:visible', pageBlock);
			if (opts.focusInput)
				setTimeout(focus, 20);
		}
		else
			center(lyr3[0], opts.centerX, opts.centerY);

		if (opts.timeout) {
			// auto-unblock
			var to = setTimeout(function () {
				full ? $.unblockUI(opts) : $(el).unblock(opts);
			}, opts.timeout);
			$(el).data('blockUI.timeout', to);
		}
	};

	// remove the block
	function remove(el, opts) {
		var full = (el == window);
		var $el = $(el);
		var data = $el.data('blockUI.history');
		var to = $el.data('blockUI.timeout');
		if (to) {
			clearTimeout(to);
			$el.removeData('blockUI.timeout');
		}
		opts = $.extend({}, $.blockUI.defaults, opts || {});
		bind(0, el, opts); // unbind events

		if (opts.onUnblock === null) {
			opts.onUnblock = $el.data('blockUI.onUnblock');
			$el.removeData('blockUI.onUnblock');
		}

		var els;
		if (full) // crazy selector to handle odd field errors in ie6/7
			els = $('body').children().filter('.blockUI').add('body > .blockUI');
		else
			els = $('.blockUI', el);

		if (full)
			pageBlock = pageBlockEls = null;

		if (opts.fadeOut) {
			els.fadeOut(opts.fadeOut);
			setTimeout(function () { reset(els, data, opts, el); }, opts.fadeOut);
		}
		else
			reset(els, data, opts, el);
	};

	// move blocking element back into the DOM where it started
	function reset(els, data, opts, el) {
		els.each(function (i, o) {
			// remove via DOM calls so we don't lose event handlers
			if (this.parentNode)
				this.parentNode.removeChild(this);
		});

		if (data && data.el) {
			data.el.style.display = data.display;
			data.el.style.position = data.position;
			if (data.parent)
				data.parent.appendChild(data.el);
			$(el).removeData('blockUI.history');
		}

		if (typeof opts.onUnblock == 'function')
			opts.onUnblock(el, opts);
	};

	// bind/unbind the handler
	function bind(b, el, opts) {
		var full = el == window, $el = $(el);

		// don't bother unbinding if there is nothing to unbind
		if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
			return;
		if (!full)
			$el.data('blockUI.isBlocked', b);

		// don't bind events when overlay is not in use or if bindEvents is false
		if (!opts.bindEvents || (b && !opts.showOverlay))
			return;

		// bind anchors and inputs for mouse and key events
		var events = 'mousedown mouseup keydown keypress';
		b ? $(document).bind(events, opts, handler) : $(document).unbind(events, handler);

		// former impl...
		//	   var $e = $('a,:input');
		//	   b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
	};

	// event handler to suppress keyboard/mouse events when blocking
	function handler(e) {
		// allow tab navigation (conditionally)
		if (e.keyCode && e.keyCode == 9) {
			if (pageBlock && e.data.constrainTabKey) {
				var els = pageBlockEls;
				var fwd = !e.shiftKey && e.target === els[els.length - 1];
				var back = e.shiftKey && e.target === els[0];
				if (fwd || back) {
					setTimeout(function () { focus(back) }, 10);
					return false;
				}
			}
		}
		var opts = e.data;
		// allow events within the message content
		if ($(e.target).parents('div.' + opts.blockMsgClass).length > 0)
			return true;

		// allow events for content that is not being blocked
		return $(e.target).parents().children().filter('div.blockUI').length == 0;
	};

	function focus(back) {
		if (!pageBlockEls)
			return;
		var e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
		if (e)
			e.focus();
	};

	function center(el, x, y) {
		var p = el.parentNode, s = el.style;
		var l = ((p.offsetWidth - el.offsetWidth) / 2) - sz(p, 'borderLeftWidth');
		var t = ((p.offsetHeight - el.offsetHeight) / 2) - sz(p, 'borderTopWidth');
		if (x) s.left = l > 0 ? (l + 'px') : '0';
		if (y) s.top = t > 0 ? (t + 'px') : '0';
	};

	function sz(el, p) {
		return parseInt($.css(el, p)) || 0;
	};

})(jQuery);

/*!
* jQuery corner plugin: simple corner rounding
* Examples and documentation at: http://jquery.malsup.com/corner/
* version 2.11 (15-JUN-2010)
* Requires jQuery v1.3.2 or later
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* Authors: Dave Methvin and Mike Alsup
*/

/**
*  corner() takes a single string argument:  $('#myDiv').corner("effect corners width")
*
*  effect:  name of the effect to apply, such as round, bevel, notch, bite, etc (default is round). 
*  corners: one or more of: top, bottom, tr, tl, br, or bl.  (default is all corners)
*  width:   width of the effect; in the case of rounded corners this is the radius. 
*           specify this value using the px suffix such as 10px (yes, it must be pixels).
*/
; (function ($) {

    var style = document.createElement('div').style,
    moz = style['MozBorderRadius'] !== undefined,
    webkit = style['WebkitBorderRadius'] !== undefined,
    radius = style['borderRadius'] !== undefined || style['BorderRadius'] !== undefined,
    mode = document.documentMode || 0,
    noBottomFold = $.browser.msie && (($.browser.version < 8 && !mode) || mode < 8),

    expr = $.browser.msie && (function () {
        var div = document.createElement('div');
        try { div.style.setExpression('width', '0+0'); div.style.removeExpression('width'); }
        catch (e) { return false; }
        return true;
    })();

    $.support = $.support || {};
    $.support.borderRadius = moz || webkit || radius; // so you can do:  if (!$.support.borderRadius) $('#myDiv').corner();

    function sz(el, p) {
        return parseInt($.css(el, p)) || 0;
    };
    function hex2(s) {
        var s = parseInt(s).toString(16);
        return (s.length < 2) ? '0' + s : s;
    };
    function gpc(node) {
        while (node) {
            var v = $.css(node, 'backgroundColor'), rgb;
            if (v && v != 'transparent' && v != 'rgba(0, 0, 0, 0)') {
                if (v.indexOf('rgb') >= 0) {
                    rgb = v.match(/\d+/g);
                    return '#' + hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
                }
                return v;
            }
            if (node.nodeName.toLowerCase() == 'html')
                break;
            node = node.parentNode; // keep walking if transparent
        }
        return '#ffffff';
    };

    function getWidth(fx, i, width) {
        switch (fx) {
            case 'round': return Math.round(width * (1 - Math.cos(Math.asin(i / width))));
            case 'cool': return Math.round(width * (1 + Math.cos(Math.asin(i / width))));
            case 'sharp': return Math.round(width * (1 - Math.cos(Math.acos(i / width))));
            case 'bite': return Math.round(width * (Math.cos(Math.asin((width - i - 1) / width))));
            case 'slide': return Math.round(width * (Math.atan2(i, width / i)));
            case 'jut': return Math.round(width * (Math.atan2(width, (width - i - 1))));
            case 'curl': return Math.round(width * (Math.atan(i)));
            case 'tear': return Math.round(width * (Math.cos(i)));
            case 'wicked': return Math.round(width * (Math.tan(i)));
            case 'long': return Math.round(width * (Math.sqrt(i)));
            case 'sculpt': return Math.round(width * (Math.log((width - i - 1), width)));
            case 'dogfold':
            case 'dog': return (i & 1) ? (i + 1) : width;
            case 'dog2': return (i & 2) ? (i + 1) : width;
            case 'dog3': return (i & 3) ? (i + 1) : width;
            case 'fray': return (i % 2) * width;
            case 'notch': return width;
            case 'bevelfold':
            case 'bevel': return i + 1;
        }
    };

    $.fn.corner = function (options) {
        // in 1.3+ we can fix mistakes with the ready state
        if (this.length == 0) {
            if (!$.isReady && this.selector) {
                var s = this.selector, c = this.context;
                $(function () {
                    $(s, c).corner(options);
                });
            }
            return this;
        }

        return this.each(function (index) {
            var $this = $(this),
            // meta values override options
            o = [$this.attr($.fn.corner.defaults.metaAttr) || '', options || ''].join(' ').toLowerCase(),
            keep = /keep/.test(o),                       // keep borders?
            cc = ((o.match(/cc:(#[0-9a-f]+)/) || [])[1]),  // corner color
            sc = ((o.match(/sc:(#[0-9a-f]+)/) || [])[1]),  // strip color
            width = parseInt((o.match(/(\d+)px/) || [])[1]) || 10, // corner width
            re = /round|bevelfold|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dogfold|dog/,
            fx = ((o.match(re) || ['round'])[0]),
            fold = /dogfold|bevelfold/.test(o),
            edges = { T: 0, B: 1 },
            opts = {
                TL: /top|tl|left/.test(o), TR: /top|tr|right/.test(o),
                BL: /bottom|bl|left/.test(o), BR: /bottom|br|right/.test(o)
            },
            // vars used in func later
            strip, pad, cssHeight, j, bot, d, ds, bw, i, w, e, c, common, $horz;

            if (!opts.TL && !opts.TR && !opts.BL && !opts.BR)
                opts = { TL: 1, TR: 1, BL: 1, BR: 1 };

            // support native rounding
            if ($.fn.corner.defaults.useNative && fx == 'round' && (radius || moz || webkit) && !cc && !sc) {
                if (opts.TL)
                    $this.css(radius ? 'border-top-left-radius' : moz ? '-moz-border-radius-topleft' : '-webkit-border-top-left-radius', width + 'px');
                if (opts.TR)
                    $this.css(radius ? 'border-top-right-radius' : moz ? '-moz-border-radius-topright' : '-webkit-border-top-right-radius', width + 'px');
                if (opts.BL)
                    $this.css(radius ? 'border-bottom-left-radius' : moz ? '-moz-border-radius-bottomleft' : '-webkit-border-bottom-left-radius', width + 'px');
                if (opts.BR)
                    $this.css(radius ? 'border-bottom-right-radius' : moz ? '-moz-border-radius-bottomright' : '-webkit-border-bottom-right-radius', width + 'px');
                return;
            }

            strip = document.createElement('div');
            $(strip).css({
                overflow: 'hidden',
                height: '1px',
                minHeight: '1px',
                fontSize: '1px',
                backgroundColor: sc || 'transparent',
                borderStyle: 'solid'
            });

            pad = {
                T: parseInt($.css(this, 'paddingTop')) || 0, R: parseInt($.css(this, 'paddingRight')) || 0,
                B: parseInt($.css(this, 'paddingBottom')) || 0, L: parseInt($.css(this, 'paddingLeft')) || 0
            };

            if (typeof this.style.zoom != undefined) this.style.zoom = 1; // force 'hasLayout' in IE
            if (!keep) this.style.border = 'none';
            strip.style.borderColor = cc || gpc(this.parentNode);
            cssHeight = $(this).outerHeight();

            for (j in edges) {
                bot = edges[j];
                // only add stips if needed
                if ((bot && (opts.BL || opts.BR)) || (!bot && (opts.TL || opts.TR))) {
                    strip.style.borderStyle = 'none ' + (opts[j + 'R'] ? 'solid' : 'none') + ' none ' + (opts[j + 'L'] ? 'solid' : 'none');
                    d = document.createElement('div');
                    $(d).addClass('jquery-corner');
                    ds = d.style;

                    bot ? this.appendChild(d) : this.insertBefore(d, this.firstChild);

                    if (bot && cssHeight != 'auto') {
                        if ($.css(this, 'position') == 'static')
                            this.style.position = 'relative';
                        ds.position = 'absolute';
                        ds.bottom = ds.left = ds.padding = ds.margin = '0';
                        if (expr)
                            ds.setExpression('width', 'this.parentNode.offsetWidth');
                        else
                            ds.width = '100%';
                    }
                    else if (!bot && $.browser.msie) {
                        if ($.css(this, 'position') == 'static')
                            this.style.position = 'relative';
                        ds.position = 'absolute';
                        ds.top = ds.left = ds.right = ds.padding = ds.margin = '0';

                        // fix ie6 problem when blocked element has a border width
                        if (expr) {
                            bw = sz(this, 'borderLeftWidth') + sz(this, 'borderRightWidth');
                            ds.setExpression('width', 'this.parentNode.offsetWidth - ' + bw + '+ "px"');
                        }
                        else
                            ds.width = '100%';
                    }
                    else {
                        ds.position = 'relative';
                        ds.margin = !bot ? '-' + pad.T + 'px -' + pad.R + 'px ' + (pad.T - width) + 'px -' + pad.L + 'px' :
                                        (pad.B - width) + 'px -' + pad.R + 'px -' + pad.B + 'px -' + pad.L + 'px';
                    }

                    for (i = 0; i < width; i++) {
                        w = Math.max(0, getWidth(fx, i, width));
                        e = strip.cloneNode(false);
                        e.style.borderWidth = '0 ' + (opts[j + 'R'] ? w : 0) + 'px 0 ' + (opts[j + 'L'] ? w : 0) + 'px';
                        bot ? d.appendChild(e) : d.insertBefore(e, d.firstChild);
                    }

                    if (fold && $.support.boxModel) {
                        if (bot && noBottomFold) continue;
                        for (c in opts) {
                            if (!opts[c]) continue;
                            if (bot && (c == 'TL' || c == 'TR')) continue;
                            if (!bot && (c == 'BL' || c == 'BR')) continue;

                            common = { position: 'absolute', border: 'none', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: strip.style.borderColor };
                            $horz = $('<div/>').css(common).css({ width: width + 'px', height: '1px' });
                            switch (c) {
                                case 'TL': $horz.css({ bottom: 0, left: 0 }); break;
                                case 'TR': $horz.css({ bottom: 0, right: 0 }); break;
                                case 'BL': $horz.css({ top: 0, left: 0 }); break;
                                case 'BR': $horz.css({ top: 0, right: 0 }); break;
                            }
                            d.appendChild($horz[0]);

                            var $vert = $('<div/>').css(common).css({ top: 0, bottom: 0, width: '1px', height: width + 'px' });
                            switch (c) {
                                case 'TL': $vert.css({ left: width }); break;
                                case 'TR': $vert.css({ right: width }); break;
                                case 'BL': $vert.css({ left: width }); break;
                                case 'BR': $vert.css({ right: width }); break;
                            }
                            d.appendChild($vert[0]);
                        }
                    }
                }
            }
        });
    };

    $.fn.uncorner = function () {
        if (radius || moz || webkit)
            this.css(radius ? 'border-radius' : moz ? '-moz-border-radius' : '-webkit-border-radius', 0);
        $('div.jquery-corner', this).remove();
        return this;
    };

    // expose options
    $.fn.corner.defaults = {
        useNative: true, // true if plugin should attempt to use native browser support for border radius rounding
        metaAttr: 'data-corner' // name of meta attribute to use for options
    };

})(jQuery);

/**
* @projectDescription Monitor Font Size Changes with jQuery
*
* @version 1.0
* @author Dave Cardwell
*
* jQuery-Em - $Revision: 24 $ ($Date: 2007-08-19 11:24:56 +0100 (Sun, 19 Aug 2007) $)
* http://davecardwell.co.uk/javascript/jquery/plugins/jquery-em/
*
* Copyright ©2007 Dave Cardwell <http://davecardwell.co.uk/>
*
* Released under the MIT licence:
* http://www.opensource.org/licenses/mit-license.php
*/

// Upon $(document).ready()
jQuery(function ($) {
    // Configuration
    var eventName = 'emchange';


    // Set up default options.
    $.em = $.extend({
        /**
        * The jQuery-Em version string.
        *
        * @example $.em.version;
        * @desc '1.0a'
        *
        * @property
        * @name version
        * @type String
        * @cat Plugins/Em
        */
        version: '1.0',

        /**
        * The number of milliseconds to wait when polling for changes to the
        * font size.
        *
        * @example $.em.delay = 400;
        * @desc Defaults to 200.
        *
        * @property
        * @name delay
        * @type Number
        * @cat Plugins/Em
        */
        delay: 200,

        /**
        * The element used to detect changes to the font size.
        *
        * @example $.em.element = $('<div />')[0];
        * @desc Default is an empty, absolutely positioned, 100em-wide <div>.
        *
        * @private
        * @property
        * @name element
        * @type Element
        * @cat Plugins/Em
        */
        element: $('<div />').css({ left: '-100em',
            position: 'absolute',
            width: '100em'
        })
                             .prependTo('body')[0],

        /**
        * The action to perform when a change in the font size is detected.
        *
        * @example $.em.action = function() { ... }
        * @desc The default action is to trigger a global event.
        * You probably shouldn't change this behaviour as other plugins may
        * rely on it, but the option is here for completion.
        *
        * @example $(document).bind('emchange', function(e, cur, prev) {...})
        * @desc Any functions triggered on this event are passed the current
        * font size, and last known font size as additional parameters.
        *
        * @private
        * @property
        * @name action
        * @type Function
        * @cat Plugins/Em
        * @see current
        * @see previous
        */
        action: function () {
            var currentWidth = $.em.element.offsetWidth / 100;

            // If the font size has changed since we last checked¦
            if (currentWidth != $.em.current) {
                /**
                * The previous pixel value of the user agents font size. See
                * $.em.current for caveats. Will initially be undefined until
                * the change event is triggered.
                *
                * @example $.em.previous;
                * @result 16
                *
                * @property
                * @name previous
                * @type Number
                * @cat Plugins/Em
                * @see current
                */
                $.em.previous = $.em.current;

                /**
                * The current pixel value of the user agents font size. As
                * with $.em.previous, this value *may* be subject to minor
                * browser rounding errors that mean you might not want to
                * rely upon it as an absolute value.
                *
                * @example $.em.current;
                * @result 14
                *
                * @property
                * @name current
                * @type Number
                * @cat Plugins/Em
                * @see previous
                */
                $.em.current = currentWidth;

                $.event.trigger(eventName, [$.em.current, $.em.previous]);
            }
        }
    }, $.em);


    /**
    * Bind a function to the emchange event of each matched element.
    *
    * @example $("p").emchange( function() { alert("Hello"); } );
    *
    * @name emchange
    * @type jQuery
    * @param Function fn A function to bind to the emchange event.
    * @cat Plugins/Em
    */

    /**
    * Trigger the emchange event of each matched element.
    *
    * @example $("p").emchange()
    *
    * @name emchange
    * @type jQuery
    * @cat Plugins/Em
    */
    $.fn[eventName] = function (fn) {
        return fn ? this.bind(eventName, fn)
                                               : this.trigger(eventName);
    };


    // Store the initial pixel value of the user agents font size.
    $.em.current = $.em.element.offsetWidth / 100;

    /**
    * While polling for font-size changes, $.em.iid stores the intervalID in
    * case you should want to cancel with clearInterval().
    *
    * @example window.clearInterval( $.em.iid );
    * 
    * @property
    * @name iid
    * @type Number
    * @cat Plugins/Em
    */
    $.em.iid = setInterval($.em.action, $.em.delay);
});

/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
* Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
* Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
*
* $LastChangedDate: 2007-12-20 09:02:08 -0600 (Thu, 20 Dec 2007) $
* $Rev: 4265 $
*
* Version: 3.0
* 
* Requires: $ 1.2.2+
*/

(function ($) {

    $.event.special.mousewheel = {
        setup: function () {
            var handler = $.event.special.mousewheel.handler;

            // Fix pageX, pageY, clientX and clientY for mozilla
            if ($.browser.mozilla)
                $(this).bind('mousemove.mousewheel', function (event) {
                    $.data(this, 'mwcursorposdata', {
                        pageX: event.pageX,
                        pageY: event.pageY,
                        clientX: event.clientX,
                        clientY: event.clientY
                    });
                });

            if (this.addEventListener)
                this.addEventListener(($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
            else
                this.onmousewheel = handler;
        },

        teardown: function () {
            var handler = $.event.special.mousewheel.handler;

            $(this).unbind('mousemove.mousewheel');

            if (this.removeEventListener)
                this.removeEventListener(($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
            else
                this.onmousewheel = function () { };

            $.removeData(this, 'mwcursorposdata');
        },

        handler: function (event) {
            var args = Array.prototype.slice.call(arguments, 1);

            event = $.event.fix(event || window.event);
            // Get correct pageX, pageY, clientX and clientY for mozilla
            $.extend(event, $.data(this, 'mwcursorposdata') || {});
            var delta = 0, returnValue = true;

            if (event.wheelDelta) delta = event.wheelDelta / 120;
            if (event.detail) delta = -event.detail / 3;
            //		if ( $.browser.opera  ) delta = -event.wheelDelta;

            event.data = event.data || {};
            event.type = "mousewheel";

            // Add delta to the front of the arguments
            args.unshift(delta);
            // Add event to the front of the arguments
            args.unshift(event);

            return $.event.handle.apply(this, args);
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function (fn) {
            return this.unbind("mousewheel", fn);
        }
    });

})(jQuery);

/* Copyright (c) 2009 Kelvin Luck (kelvin AT kelvinluck DOT com || http://www.kelvinluck.com)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
* 
* See http://kelvinluck.com/assets/jquery/jScrollPane/
* $Id: jScrollPane.js 93 2010-06-01 08:17:28Z kelvin.luck $
*/

/**
* Replace the vertical scroll bars on any matched elements with a fancy
* styleable (via CSS) version. With JS disabled the elements will
* gracefully degrade to the browsers own implementation of overflow:auto.
* If the mousewheel plugin has been included on the page then the scrollable areas will also
* respond to the mouse wheel.
*
* @example jQuery(".scroll-pane").jScrollPane();
*
* @name jScrollPane
* @type jQuery
* @param Object	settings	hash with options, described below.
*								scrollbarWidth	-	The width of the generated scrollbar in pixels
*								scrollbarMargin	-	The amount of space to leave on the side of the scrollbar in pixels
*								wheelSpeed		-	The speed the pane will scroll in response to the mouse wheel in pixels
*								showArrows		-	Whether to display arrows for the user to scroll with
*								arrowSize		-	The height of the arrow buttons if showArrows=true
*								animateTo		-	Whether to animate when calling scrollTo and scrollBy
*								dragMinHeight	-	The minimum height to allow the drag bar to be
*								dragMaxHeight	-	The maximum height to allow the drag bar to be
*								animateInterval	-	The interval in milliseconds to update an animating scrollPane (default 100)
*								animateStep		-	The amount to divide the remaining scroll distance by when animating (default 3)
*								maintainPosition-	Whether you want the contents of the scroll pane to maintain it's position when you re-initialise it - so it doesn't scroll as you add more content (default true)
*								tabIndex		-	The tabindex for this jScrollPane to control when it is tabbed to when navigating via keyboard (default 0)
*								enableKeyboardNavigation - Whether to allow keyboard scrolling of this jScrollPane when it is focused (default true)
*								animateToInternalLinks - Whether the move to an internal link (e.g. when it's focused by tabbing or by a hash change in the URL) should be animated or instant (default false)
*								scrollbarOnLeft	-	Display the scrollbar on the left side?  (needs stylesheet changes, see examples.html)
*								reinitialiseOnImageLoad - Whether the jScrollPane should automatically re-initialise itself when any contained images are loaded (default false)
*								topCapHeight	-	The height of the "cap" area between the top of the jScrollPane and the top of the track/ buttons
*								bottomCapHeight	-	The height of the "cap" area between the bottom of the jScrollPane and the bottom of the track/ buttons
*								observeHash		-	Whether jScrollPane should attempt to automagically scroll to the correct place when an anchor inside the scrollpane is linked to (default true)
* @return jQuery
* @cat Plugins/jScrollPane
* @author Kelvin Luck (kelvin AT kelvinluck DOT com || http://www.kelvinluck.com)
*/
/*Added: Yoofi Efeosa Ocran/HL*/
/*Date : 10/12/2011*/
/*Notes: To expose the drag height*/
var dragAreaHeight;
var barHeight;

(function ($) {

    $.jScrollPane = {
        active: []
    };
    $.fn.jScrollPane = function (settings) {
        settings = $.extend({}, $.fn.jScrollPane.defaults, settings);
        mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

        var rf = function () { return false; };

        /*support mobile devices*/
        /*Added: Yoofi Efeosa Ocran/HL*/
        /*Date : 12/14/2011*/
        document.addEventListener("touchstart", function (e) {
            var touch = e.changedTouches[0];
        }, false);

        return this.each(
		function () {
		    var $this = $(this);
		    var paneEle = this;
		    var currentScrollPosition = 0;
		    var paneWidth;
		    var paneHeight;
		    var trackHeight;
		    var trackOffset = settings.topCapHeight;
		    var $container;

		    if ($(this).parent().is('.jScrollPaneContainer')) {
		        $container = $(this).parent();
		        currentScrollPosition = settings.maintainPosition ? $this.position().top : 0;
		        var $c = $(this).parent();
		        paneWidth = $c.innerWidth();
		        paneHeight = $c.outerHeight();
		        $('>.jScrollPaneTrack, >.jScrollArrowUp, >.jScrollArrowDown, >.jScrollCap', $c).remove();
		        $this.css({ 'top': 0 });
		    } else {
		        $this.data('originalStyleTag', $this.attr('style'));
		        // Switch the element's overflow to hidden to ensure we get the size of the element without the scrollbars [http://plugins.jquery.com/node/1208]
		        $this.css('overflow', 'hidden');
		        this.originalPadding = $this.css('paddingTop') + ' ' + $this.css('paddingRight') + ' ' + $this.css('paddingBottom') + ' ' + $this.css('paddingLeft');
		        this.originalSidePaddingTotal = (parseInt($this.css('paddingLeft')) || 0) + (parseInt($this.css('paddingRight')) || 0);
		        paneWidth = $this.innerWidth();
		        paneHeight = $this.innerHeight();
		        $container = $('<div></div>')
					.attr({ 'className': 'jScrollPaneContainer' })
					.css(
						{
						    'height': paneHeight + 'px',
						    'width': paneWidth + 'px'
						}
					);
		        if (settings.enableKeyboardNavigation) {
		            $container.attr(
						'tabindex',
						settings.tabIndex
					);
		        }
		        $this.wrap($container);
		        $container = $this.parent();
		        // deal with text size changes (if the jquery.em plugin is included)
		        // and re-initialise the scrollPane so the track maintains the
		        // correct size
		        $(document).bind(
					'emchange',
					function (e, cur, prev) {
					    $this.jScrollPane(settings);
					}
				);

		    }
		    trackHeight = paneHeight;

		    if (settings.reinitialiseOnImageLoad) {
		        // code inspired by jquery.onImagesLoad: http://plugins.jquery.com/project/onImagesLoad
		        // except we re-initialise the scroll pane when each image loads so that the scroll pane is always up to size...
		        // TODO: Do I even need to store it in $.data? Is a local variable here the same since I don't pass the reinitialiseOnImageLoad when I re-initialise?
		        var $imagesToLoad = $.data(paneEle, 'jScrollPaneImagesToLoad') || $('img', $this);
		        var loadedImages = [];

		        if ($imagesToLoad.length) {
		            $imagesToLoad.each(function (i, val) {
		                $(this).bind('load readystatechange', function () {
		                    if ($.inArray(i, loadedImages) == -1) { //don't double count images
		                        loadedImages.push(val); //keep a record of images we've seen
		                        $imagesToLoad = $.grep($imagesToLoad, function (n, i) {
		                            return n != val;
		                        });
		                        $.data(paneEle, 'jScrollPaneImagesToLoad', $imagesToLoad);
		                        var s2 = $.extend(settings, { reinitialiseOnImageLoad: false });
		                        $this.jScrollPane(s2); // re-initialise
		                    }
		                }).each(function (i, val) {
		                    if (this.complete || this.complete === undefined) {
		                        //needed for potential cached images
		                        this.src = this.src;
		                    }
		                });
		            });
		        };
		    }

		    var p = this.originalSidePaddingTotal;
		    var realPaneWidth = paneWidth - settings.scrollbarWidth - settings.scrollbarMargin - p;

		    var cssToApply = {
		        'height': 'auto',
		        'width': realPaneWidth + 'px'
		    }

		    if (settings.scrollbarOnLeft) {
		        cssToApply.paddingLeft = settings.scrollbarMargin + settings.scrollbarWidth + 'px';
		    } else {
		        cssToApply.paddingRight = settings.scrollbarMargin + 'px';
		    }

		    $this.css(cssToApply);

		    var contentHeight = $this.outerHeight();
		    var percentInView = paneHeight / contentHeight;

		    var isScrollable = percentInView < .99;
		    $container[isScrollable ? 'addClass' : 'removeClass']('jScrollPaneScrollable');

		    if (isScrollable) {
		        $container.append(
					$('<div></div>').addClass('jScrollCap jScrollCapTop').css({ height: settings.topCapHeight }),
					$('<div></div>').attr({ 'className': 'jScrollPaneTrack' }).css({ 'width': settings.scrollbarWidth + 'px' }).append(
						$('<div></div>').attr({ 'className': 'jScrollPaneDrag' }).css({ 'width': settings.scrollbarWidth + 'px' }).append(
							$('<div></div>').attr({ 'className': 'jScrollPaneDragTop' }).css({ 'width': settings.scrollbarWidth + 'px' }),
							$('<div></div>').attr({ 'className': 'jScrollPaneDragBottom' }).css({ 'width': settings.scrollbarWidth + 'px' })
						)
					),
					$('<div></div>').addClass('jScrollCap jScrollCapBottom').css({ height: settings.bottomCapHeight })
				);

		        var $track = $('>.jScrollPaneTrack', $container);
		        var $drag = $('>.jScrollPaneTrack .jScrollPaneDrag', $container);

		        // added: Yoofi Ocran/10-17-2011
		        $($drag).corner();

		        if (!mobile) {
		            $drag.hide();
		        }
		        else {
		            $drag.fadeTo('fast', .6);
		        }

		        var currentArrowDirection;
		        var currentArrowTimerArr = []; // Array is used to store timers since they can stack up when dealing with keyboard events. This ensures all timers are cleaned up in the end, preventing an acceleration bug.
		        var currentArrowInc;
		        var whileArrowButtonDown = function () {
		            if (currentArrowInc > 4 || currentArrowInc % 4 == 0) {
		                positionDrag(dragPosition + currentArrowDirection * mouseWheelMultiplier);
		            }
		            currentArrowInc++;
		        };

		        if (settings.enableKeyboardNavigation) {
		            $container.bind(
						'keydown.jscrollpane',
						function (e) {
						    switch (e.keyCode) {
						        case 38: //up
						            currentArrowDirection = -1;
						            currentArrowInc = 0;
						            whileArrowButtonDown();
						            currentArrowTimerArr[currentArrowTimerArr.length] = setInterval(whileArrowButtonDown, 100);
						            return false;
						        case 40: //down
						            currentArrowDirection = 1;
						            currentArrowInc = 0;
						            whileArrowButtonDown();
						            currentArrowTimerArr[currentArrowTimerArr.length] = setInterval(whileArrowButtonDown, 100);
						            return false;
						        case 33: // page up
						        case 34: // page down
						            // TODO
						            return false;
						        default:
						    }
						}
					).bind(
						'keyup.jscrollpane',
						function (e) {
						    if (e.keyCode == 38 || e.keyCode == 40) {
						        for (var i = 0; i < currentArrowTimerArr.length; i++) {
						            clearInterval(currentArrowTimerArr[i]);
						        }
						        return false;
						    }
						}
					);
		        }

		        if (settings.showArrows) {

		            var currentArrowButton;
		            var currentArrowInterval;

		            var onArrowMouseUp = function (event) {
		                $('html').unbind('mouseup', onArrowMouseUp);
		                currentArrowButton.removeClass('jScrollActiveArrowButton');
		                clearInterval(currentArrowInterval);
		            };
		            var onArrowMouseDown = function () {
		                $('html').bind('mouseup', onArrowMouseUp);
		                currentArrowButton.addClass('jScrollActiveArrowButton');
		                currentArrowInc = 0;
		                whileArrowButtonDown();
		                currentArrowInterval = setInterval(whileArrowButtonDown, 100);
		            };
		            $container
						.append(
							$('<a></a>')
								.attr(
									{
									    'href': 'javascript:;',
									    'className': 'jScrollArrowUp',
									    'tabindex': -1
									}
								)
								.css(
									{
									    'width': settings.scrollbarWidth + 'px',
									    'top': settings.topCapHeight + 'px'
									}
								)
								.html('Scroll up')
								.bind('mousedown', function () {
								    currentArrowButton = $(this);
								    currentArrowDirection = -1;
								    onArrowMouseDown();
								    this.blur();
								    return false;
								})
								.bind('click', rf),
							$('<a></a>')
								.attr(
									{
									    'href': 'javascript:;',
									    'className': 'jScrollArrowDown',
									    'tabindex': -1
									}
								)
								.css(
									{
									    'width': settings.scrollbarWidth + 'px',
									    'bottom': settings.bottomCapHeight + 'px'
									}
								)
								.html('Scroll down')
								.bind('mousedown', function () {
								    currentArrowButton = $(this);
								    currentArrowDirection = 1;
								    onArrowMouseDown();
								    this.blur();
								    return false;
								})
								.bind('click', rf)
						);
		            var $upArrow = $('>.jScrollArrowUp', $container);
		            var $downArrow = $('>.jScrollArrowDown', $container);
		        }

		        if (settings.arrowSize) {
		            trackHeight = paneHeight - settings.arrowSize - settings.arrowSize;
		            trackOffset += settings.arrowSize;
		        } else if ($upArrow) {
		            var topArrowHeight = $upArrow.height();
		            settings.arrowSize = topArrowHeight;
		            trackHeight = paneHeight - topArrowHeight - $downArrow.height();
		            trackOffset += topArrowHeight;
		        }
		        trackHeight -= settings.topCapHeight + settings.bottomCapHeight;
		        $track.css({ 'height': trackHeight + 'px', top: trackOffset + 'px' })

		        var $pane = $(this).css({ 'position': 'absolute', 'overflow': 'visible' });

		        var currentOffset;
		        var maxY;
		        var mouseWheelMultiplier;
		        // store this in a seperate variable so we can keep track more accurately than just updating the css property..
		        var dragPosition = 0;
		        var dragMiddle = percentInView * paneHeight / 2;

		        // pos function borrowed from tooltip plugin and adapted...
		        var getPos = function (event, c) {
		            var p = c == 'X' ? 'Left' : 'Top';
		            return event['page' + c] || (event['client' + c] + (document.documentElement['scroll' + p] || document.body['scroll' + p])) || 0;
		        };

		        var ignoreNativeDrag = function () { return false; };

		        var initDrag = function () {
		            ceaseAnimation();
		            currentOffset = $drag.offset(false);
		            currentOffset.top -= dragPosition;
		            maxY = trackHeight - $drag[0].offsetHeight;
		            mouseWheelMultiplier = 2 * settings.wheelSpeed * maxY / contentHeight;
		        };

		        var onStartDrag = function (event) {
		            initDrag();
		            dragMiddle = getPos(event, 'Y') - dragPosition - currentOffset.top;

		            if (!mobile) {
		                $('html').bind('mouseup', onStopDrag).bind('mousemove', updateScroll).bind('mouseleave', onStopDrag)
		            } else {
		                $('html').bind('touchend', onStopDrag).bind('touchmove', updateScroll)
		            }

		            if ($.browser.msie) {
		                $('html').bind('dragstart', ignoreNativeDrag).bind('selectstart', ignoreNativeDrag);
		            }
		            return false;
		        };
		        var onStopDrag = function () {
		            if (!mobile) {
		                $('html').unbind('mouseup', onStopDrag).unbind('mousemove', updateScroll);
		            } else {
		                $('html').unbind('touchend', onStopDrag).unbind('touchmove', updateScroll);
		            }
		            dragMiddle = percentInView * paneHeight / 2;
		            if ($.browser.msie) {
		                $('html').unbind('dragstart', ignoreNativeDrag).unbind('selectstart', ignoreNativeDrag);
		            }
		        };

		        var positionDrag = function (destY) {
		            $container.scrollTop(0);
		            destY = destY < 0 ? 0 : (destY > maxY ? maxY : destY);
		            dragPosition = destY;
		            $drag.css({ 'top': destY + 'px' });
		            var p = destY / maxY;
		            $this.data('jScrollPanePosition', (paneHeight - contentHeight) * -p);
		            $pane.css({ 'top': ((paneHeight - contentHeight) * p) + 'px' });
		            $this.trigger('scroll');
		            if (settings.showArrows) {
		                $upArrow[destY == 0 ? 'addClass' : 'removeClass']('disabled');
		                $downArrow[destY == maxY ? 'addClass' : 'removeClass']('disabled');
		            }

		            // added:Yoofi Ocran/10-17-2011
		            // modified: 12-14-2011
		            // show the scroll bar when the user mouseover the scrollpane                                        
		            var t;

		            $pane.mouseenter(function () {
		                window.clearTimeout(t);
		                $drag.stop(true, true).fadeTo('fast', .6);
		            });

		            $pane.mouseleave(function () {
		                t = setTimeout(function () { $drag.fadeOut(); }, 1500);
		            });

		            $drag.mouseenter(function () {
		                window.clearTimeout(t);
		            });

		            dragAreaHeight = dragPosition;
		        };

		        var updateScroll = function (e) {
		            positionDrag(getPos(e, 'Y') - currentOffset.top - dragMiddle);
		        };

		        var dragH = Math.max(Math.min(percentInView * (paneHeight - settings.arrowSize * 2), settings.dragMaxHeight), settings.dragMinHeight);
		        barHeight = dragH;

		        if (!mobile) {
		            $drag.css({ 'height': dragH + 'px' }).bind('mousedown', onStartDrag);
		        }
		        else {
		            $drag.css({ 'height': dragH + 'px' }).bind('touchstart', onStartDrag);
		        }

		        var trackScrollInterval;
		        var trackScrollInc;
		        var trackScrollMousePos;
		        var doTrackScroll = function () {
		            if (trackScrollInc > 8 || trackScrollInc % 4 == 0) {
		                positionDrag((dragPosition - ((dragPosition - trackScrollMousePos) / 2)));
		            }
		            trackScrollInc++;
		        };
		        var onStopTrackClick = function () {
		            clearInterval(trackScrollInterval);
		            if (!mobile) {
		                $('html').unbind('mouseup', onStopTrackClick).unbind('mousemove', onTrackMouseMove);
		            }
		            else {
		                $('html').unbind('touchend', onStopTrackClick).unbind('touchstart touchmove', onTrackMouseMove);
		            }
		        };
		        var onTrackMouseMove = function (event) {
		            trackScrollMousePos = getPos(event, 'Y') - currentOffset.top - dragMiddle;
		        };
		        var onTrackClick = function (event) {
		            initDrag();
		            onTrackMouseMove(event);
		            trackScrollInc = 0;
		            if (!mobile) {
		                $('html').bind('mouseup', onStopTrackClick).bind('mousemove', onTrackMouseMove);
		            }
		            else {
		                $('html').bind("touchend", onStopTrackClick).bind("touchstart touchmove", onTrackMouseMove);
		            }
		            trackScrollInterval = setInterval(doTrackScroll, 100);
		            doTrackScroll();
		            return false;
		        };

		        if (!mobile) {
		            $track.bind('mousedown', onTrackClick);
		        }
		        else {
		            $track.bind("touchstart", onTrackClick);
		        }

		        $container.bind(
					'mousewheel',
					function (event, delta) {
					    delta = delta || (event.wheelDelta ? event.wheelDelta / 120 : (event.detail) ?
-event.detail / 3 : 0);
					    initDrag();
					    ceaseAnimation();
					    var d = dragPosition;
					    positionDrag(dragPosition - delta * mouseWheelMultiplier);
					    var dragOccured = d != dragPosition;
					    return !dragOccured;
					}
				);

		        var _animateToPosition;
		        var _animateToInterval;
		        function animateToPosition() {
		            var diff = (_animateToPosition - dragPosition) / settings.animateStep;
		            if (diff > 1 || diff < -1) {
		                positionDrag(dragPosition + diff);
		            } else {
		                positionDrag(_animateToPosition);
		                ceaseAnimation();
		            }
		        }
		        var ceaseAnimation = function () {
		            if (_animateToInterval) {
		                clearInterval(_animateToInterval);
		                delete _animateToPosition;
		            }
		        };
		        var scrollTo = function (pos, preventAni) {
		            if (typeof pos == "string") {
		                // Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
		                // errors from the lookup...
		                try {
		                    $e = $(pos, $this);
		                } catch (err) {
		                    return;
		                }
		                if (!$e.length) return;
		                pos = $e.offset().top - $this.offset().top;
		            }
		            ceaseAnimation();
		            var maxScroll = contentHeight - paneHeight;
		            pos = pos > maxScroll ? maxScroll : pos;
		            $this.data('jScrollPaneMaxScroll', maxScroll);
		            var destDragPosition = pos / maxScroll * maxY;
		            if (preventAni || !settings.animateTo) {
		                positionDrag(destDragPosition);
		            } else {
		                $container.scrollTop(0);
		                _animateToPosition = destDragPosition;
		                _animateToInterval = setInterval(animateToPosition, settings.animateInterval);
		            }
		        };
		        $this[0].scrollTo = scrollTo;

		        $this[0].scrollBy = function (delta) {
		            var currentPos = -parseInt($pane.css('top')) || 0;
		            scrollTo(currentPos + delta);
		        };

		        initDrag();

		        scrollTo(-currentScrollPosition, true);

		        // Deal with it when the user tabs to a link or form element within this scrollpane
		        $('*', this).bind(
					'focus',
					function (event) {
					    var $e = $(this);

					    // loop through parents adding the offset top of any elements that are relatively positioned between
					    // the focused element and the jScrollPaneContainer so we can get the true distance from the top
					    // of the focused element to the top of the scrollpane...
					    var eleTop = 0;

					    var preventInfiniteLoop = 100;

					    while ($e[0] != $this[0]) {
					        eleTop += $e.position().top;
					        $e = $e.offsetParent();
					        if (!preventInfiniteLoop--) {
					            return;
					        }
					    }

					    var viewportTop = -parseInt($pane.css('top')) || 0;
					    var maxVisibleEleTop = viewportTop + paneHeight;
					    var eleInView = eleTop > viewportTop && eleTop < maxVisibleEleTop;
					    if (!eleInView) {
					        var destPos = eleTop - settings.scrollbarMargin;
					        if (eleTop > viewportTop) { // element is below viewport - scroll so it is at bottom.
					            destPos += $(this).height() + 15 + settings.scrollbarMargin - paneHeight;
					        }
					        scrollTo(destPos);
					    }
					}
				)


		        if (settings.observeHash) {
		            if (location.hash && location.hash.length > 1) {
		                setTimeout(function () {
		                    scrollTo(location.hash);
		                }, $.browser.safari ? 100 : 0);
		            }

		            // use event delegation to listen for all clicks on links and hijack them if they are links to
		            // anchors within our content...
		            $(document).bind('click', function (e) {
		                $target = $(e.target);
		                if ($target.is('a')) {
		                    var h = $target.attr('href');
		                    if (h && h.substr(0, 1) == '#' && h.length > 1) {
		                        setTimeout(function () {
		                            scrollTo(h, !settings.animateToInternalLinks);
		                        }, $.browser.safari ? 100 : 0);
		                    }
		                }
		            });
		        }

		        // Deal with dragging and selecting text to make the scrollpane scroll...
		        function onSelectScrollMouseDown(e) {
		            $(document).bind('mousemove.jScrollPaneDragging', onTextSelectionScrollMouseMove);
		            $(document).bind('mouseup.jScrollPaneDragging', onSelectScrollMouseUp);

		        }

		        var textDragDistanceAway;
		        var textSelectionInterval;

		        function onTextSelectionInterval() {
		            direction = textDragDistanceAway < 0 ? -1 : 1;
		            $this[0].scrollBy(textDragDistanceAway / 2);
		        }

		        function clearTextSelectionInterval() {
		            if (textSelectionInterval) {
		                clearInterval(textSelectionInterval);
		                textSelectionInterval = undefined;
		            }
		        }

		        function onTextSelectionScrollMouseMove(e) {
		            var offset = $this.parent().offset().top;
		            var maxOffset = offset + paneHeight;
		            var mouseOffset = getPos(e, 'Y');
		            textDragDistanceAway = mouseOffset < offset ? mouseOffset - offset : (mouseOffset > maxOffset ? mouseOffset - maxOffset : 0);
		            if (textDragDistanceAway == 0) {
		                clearTextSelectionInterval();
		            } else {
		                if (!textSelectionInterval) {
		                    textSelectionInterval = setInterval(onTextSelectionInterval, 100);
		                }
		            }
		        }

		        function onSelectScrollMouseUp(e) {
		            $(document)
					  .unbind('mousemove.jScrollPaneDragging')
					  .unbind('mouseup.jScrollPaneDragging');
		            clearTextSelectionInterval();
		        }

		        $container.bind('mousedown.jScrollPane', onSelectScrollMouseDown);


		        $.jScrollPane.active.push($this[0]);

		    } else {
		        $this.css(
					{
					    'height': paneHeight + 'px',
					    'width': paneWidth - this.originalSidePaddingTotal + 'px',
					    'padding': this.originalPadding
					}
				);
		        $this[0].scrollTo = $this[0].scrollBy = function () { };
		        // clean up listeners
		        $this.parent().unbind('mousewheel').unbind('mousedown.jScrollPane').unbind('keydown.jscrollpane').unbind('keyup.jscrollpane');
		    }

		}
	)
    };

    $.fn.jScrollPaneRemove = function () {
        $(this).each(function () {
            $this = $(this);
            var $c = $this.parent();
            if ($c.is('.jScrollPaneContainer')) {
                $this.css(
				{
				    'top': '',
				    'height': '',
				    'width': '',
				    'padding': '',
				    'overflow': '',
				    'position': ''
				}
			);
                $this.attr('style', $this.data('originalStyleTag'));
                $c.after($this).remove();
            }
        });
    }

    $.fn.dragAreaHeight = function () {
        return dragAreaHeight;
    };

    $.fn.barHeight = function () {
        return barHeight;
    };

    $.fn.jScrollPane.defaults = {
        scrollbarWidth: 10,
        scrollbarMargin: 5,
        wheelSpeed: 18,
        showArrows: false,
        arrowSize: 0,
        animateTo: false,
        dragMinHeight: 1,
        dragMaxHeight: 99999,
        animateInterval: 100,
        animateStep: 3,
        maintainPosition: true,
        scrollbarOnLeft: false,
        reinitialiseOnImageLoad: false,
        tabIndex: 0,
        enableKeyboardNavigation: true,
        animateToInternalLinks: false,
        topCapHeight: 0,
        bottomCapHeight: 0,
        observeHash: true
    };

    // clean up the scrollTo expandos
    $(window)
	.bind('unload', function () {
	    var els = $.jScrollPane.active;
	    for (var i = 0; i < els.length; i++) {
	        els[i].scrollTo = els[i].scrollBy = null;
	    }
	}
);

})(jQuery);

/*
 * timeago: a jQuery plugin, version: 0.9.3 (2011-01-21)
 * @requires jQuery v1.2.3 or later
 *
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
        distanceMillis = Math.abs(distanceMillis);
      }

      var seconds = distanceMillis / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 48 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.floor(days)) ||
        days < 60 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.floor(days / 30)) ||
        years < 2 && substitute($l.year, 1) ||
        substitute($l.years, Math.floor(years));

      return $.trim([prefix, words, suffix].join(" "));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
      var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));

/**
 * jQuery custom checkboxes
 * 
 * Copyright (c) 2008 Khavilo Dmitry (http://widowmaker.kiev.ua/checkbox/)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.3.0 Beta 1
 * @version 1.3.1 Alpha
 * @author Khavilo Dmitry
 * @modified Yoofi Efeosa Ocran/Oraca
 * @mailto wm.morgun@gmail.com
**/

(function ($) {
    /* Little trick to remove event bubbling that causes events recursion */
    var CB = function (e) {
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    };

    $.fn.checkbox = function (options) {
        /* IE6 background flicker fix */
        try { document.execCommand('BackgroundImageCache', false, true); } catch (e) { }

        /* Default settings */
        var settings = {
            cls: 'jquery-checkbox',  /* checkbox  */
            empty: 'empty.png',  /* checkbox  */
            print: false
        };

        /* Processing settings */
        settings = $.extend(settings, options || {});

        /* Logging purposes */
        var writeLog = function (object) {
            object.value = object.checked;

            if (settings.print) window.status = object.value;
        };

        /* Adds check/uncheck & disable/enable events */
        var addEvents = function (object) {
            var checked = object.checked;
            var disabled = object.disabled;
            var $object = $(object);

            if (object.stateInterval)
                clearInterval(object.stateInterval);

            object.stateInterval = setInterval(
                        function () {
                            if (object.disabled != disabled)
                                $object.trigger((disabled = !!object.disabled) ? 'disable' : 'enable');
                            if (object.checked != checked)
                                $object.trigger((checked = !!object.checked) ? 'check' : 'uncheck');
                        },
                        10 /* in miliseconds. Low numbers this can decrease performance on slow computers, high will increase responce time */
                  );
            return $object;
        };
        //try { console.log(this); } catch(e) {}

        /* Wrapping all passed elements */
        return this.each(function () {
            var ch = this; /* Reference to DOM Element*/
            var $ch = addEvents(ch); /* Adds custom events and returns, jQuery enclosed object */

            /* Removing wrapper if already applied  */
            if (ch.wrapper) ch.wrapper.remove();

            /* Creating wrapper for checkbox and assigning "hover" event */
            ch.wrapper = $('<span class="' + settings.cls + '"><span class="mark"><img src="/App_Themes/Common/images/' + settings.empty + '" /></span></span>');
            ch.wrapperInner = ch.wrapper.children('span:eq(0)');
            ch.wrapper.hover(
            //function(e) { ch.wrapperInner.addClass(settings.cls + '-hover'); CB(e); },
            //function(e) { ch.wrapperInner.removeClass(settings.cls + '-hover'); CB(e); }
                  );

            /* Wrapping checkbox */
            $ch.css({ position: 'absolute', zIndex: -1, visibility: 'hidden' }).after(ch.wrapper);

            /* Ttying to find "our" label */
            var label = false;
            if ($ch.attr('id')) {
                label = $('label[for=' + $ch.attr('id') + ']');
                if (!label.length) label = false;
            }
            if (!label) {
                /* Trying to utilize "closest()" from jQuery 1.3+ */
                label = $ch.closest ? $ch.closest('label') : $ch.parents('label:eq(0)');
                if (!label.length) label = false;
            }
            /* Labe found, applying event hanlers */
            if (label) {
                label.hover(
                              function (e) { ch.wrapper.trigger('mouseover', [e]); },
                              function (e) { ch.wrapper.trigger('mouseout', [e]); }
                        );
                label.click(function (e) {
                    $ch.trigger('click', [e]); CB(e); return false;
                }
                  );
            }
            ch.wrapper.click(function (e) {
                $ch.trigger('click', [e]); CB(e); return false;
            });
            $ch.click(function (e) {
                try {
                    if (options.target == null) return;
                    var button = $("input[id$=" + options.target + "]")[0];

                    if ($(this).is(':checked')) { button.disabled = false; }
                    else { button.disabled = true; }
                    CB(e);
                }
                catch (e) { }
            });
            $ch.bind('disable', function () { ch.wrapperInner.addClass(settings.cls + '-disabled'); }).bind('enable', function () { ch.wrapperInner.removeClass(settings.cls + '-disabled'); });
            $ch.bind('check', function () {
                writeLog(ch); ch.wrapper.addClass(settings.cls + '-checked');
            })
                .bind('uncheck', function () { writeLog(ch); ch.wrapper.removeClass(settings.cls + '-checked'); });

            /* Disable image drag-n-drop for IE */
            $('img', ch.wrapper).bind('dragstart', function () { return false; }).bind('mousedown', function () { return false; });

            /* Firefox antiselection hack */
            if (window.getSelection)
                ch.wrapper.css('MozUserSelect', 'none');

            writeLog(ch);

            /* Applying checkbox state when loading*/
            if (ch.checked) {
                ch.wrapper.addClass(settings.cls + '-checked');
            }

            if (ch.disabled) {
                ch.wrapperInner.addClass(settings.cls + '-disabled');
            }
        });
    }
})(jQuery);

(function ($) {
    $.fn.extend({
        positionMe: function (data) {
            /*Global var*/
            Ac_fd_t = null;
            var me = this;
            var elm = $("div[id$=" + data.Attach + "]");
            var useNavHelp = (jQuery.trim(data.NavHelpBtmCallBack) == "") ? "0" : "1";
            me.attr("useNav", useNavHelp);

            /*
            If we are attaching to an element, then the location needs to be figured out. If not, then we need
            to just need to make sure that it is inline with its content and override any external css. If 
            attaching, then the feed is also dockable and draggable so allow here
            */
            if (jQuery.trim(data.Attach) != "") {
                var position = $(elm).offset();
                var threshhold;

                if (!data.ForceShow) {
                    threshhold = screen.width - (data.maxWidth + Math.floor(position.left) + elm.width() + 1);
                } else {
                    threshhold = 10;
                }

                /*set the position*/
                me.attr("threshold", threshhold);

                /*check to make sure we have screen real estate. 17 is for the main browsers scroll bar */
                if (threshhold > 0) {
                    /*position the Activity Feed*/
                    $(me).positionactivity(data, elm);
                }
                else {
                    /*not enough screen space to show the Navigation Help so refuse*/
                    return false;
                }

                /*window resize*/
                $(window).resize(function () {
                    $(me).re_positionactivity(data, elm);
                });

                /*create the docking image when the feed is actually docked*/
                var dockPlaced = new Image();
                dockPlaced.src = data.IconDockPlaced;
                $(dockPlaced).css("cursor", "pointer");
                $(dockPlaced).css("position", "absolute");
                $(dockPlaced).css("left", (Math.floor(position.left) + (Number(elm.width()))) + "px");
                $(dockPlaced).css("top", ((position.top == 0) ? 5 : position.top) + "px");
                $(dockPlaced).click(function () {
                    $(me).fadeIn();
                    $(dockPlaced).hide();
                });
                $(dockPlaced).hide();
                $('html').append(dockPlaced);

                /*create the docking image*/
                var dock = new Image();
                dock.src = data.IconDock;
                $(dock).css("cursor", "pointer");
                $(dock).css("padding", "2px 0 2px 0");
                $(dock).click(function () {
                    $(me).fadeOut(function () {
                        $(dockPlaced).fadeIn();
                    });
                });
                me.find('.dockAc_feed').append(dock);

                /*create the drag area and image*/
                var drg = new Image();
                drg.src = data.IconDrag;
                $(drg).css("padding", "3px 0 3px 0");
                $(drg).css("cursor", "n-resize");
                $(drg).mousedown(function (e) {
                    /*disable dragging of the image*/
                    e.preventDefault();
                    resizeActivity(data, e.pageX, e.pageY);
                });
                $(drg).mouseup(function (e) {

                });
                me.find('.dragAc_feed').append(drg);
            }
            else {
                me.css("position", "relative");
                me.css("height", data.minHeight);
            }

            /*adjust the content div*/
            me.find('.mainAc_feed').css("height", data.minHeight + "px");
            me.attr("scrollbtm", "0");
            me.attr("show", "0");

            /*
            create the animation and attach to the control
            but hide it from view
            */
            var img = new Image();
            img.src = data.Animation;
            $(img).css("text-align", "center");
            $(img).css("top", "0");
            $(img).css("padding-left", "8px");

            var div = document.createElement("div");
            $(div).append(img);
            $(div).addClass("Animload");
            if (data.Back != "" && data.FeedTextColor != "" && data.Border != "") {
                if (jQuery.trim(data.Attach) != "") {
                    $(div).css("border-right", ".1em solid " + data.Border);
                }
                $(div).css("text-align", "center");
                $(div).css("position", "relative");
                $(div).css("padding-bottom", "0");
                $(div).css("color", data.FeedTextColor);
                $(div).css("backgroundColor", data.Back);
                $(div).css("cursor", "default");

                me.find('.dragAc_feed').css("border-top", ".1em solid " + data.Border);
                me.find('.dragAc_feed').css("border-bottom", ".1em solid " + data.Border);
            }
            $(div).insertBefore(me.find('.dragAc_feed'));
            $(div).hide();

            /*make a first call*/
            me.call(data, true);
            me.delay(data);

            /*detect scroll position */
            me.find('.mainAc_feed').scroll(function () {
                $(me).closenavhelp(data);

                dragArea = $(me).find('.mainAc_feed').dragAreaHeight();
                barHeight = Math.round(me.find('.mainAc_feed').barHeight());

                if ((me.height() - 29) - (dragArea + barHeight) < data.AnimThreshHold) {

                    if (me.attr("scrollbtm") == "0") {
                        me.attr("scrollbtm", "1");
                        me.call(data, false);
                    }
                }
            });

            /*display and notify subscribers:Init, Update, Dispose*/
            $.each(data.Subscribed, function (indx, _dta) {

            });

            /* create help notification*/
            create_help(data);

            /*Bind the mousedown event to the document so we can turn off the help nav.*/
            $(document).click(function (e) {
                /*get all the helps*/
                detectAutoClose(data, e.pageX, e.pageY)
            });

            /* You must return jQuery object */
            return $();
        },

        /* 
        make the ajax
        */
        call: function (data, isFirst) {
            var me = $("div[id$=" + data.Me + "]");

            /*check if function, throw error if not*/
            var isSucFunc = (typeof eval(data.SuccessCallBack) == 'function') ? true : false;
            var isFailFunc = (typeof eval(data.FailureCallBack) == 'function') ? true : false;
            var searchDate;

            if (isFirst) {
                searchDate = data.StartFrom;
            }
            else {
                /*format: 2011-10-01 00:07:18.457*/
                var _date = new Date();
                searchDate = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate() + ' ' + _date.getHours() + ':' + _date.getMinutes() + ':' + (((_date.getSeconds() - (Number(data.Refresh) / 1000)) > 0) ? (_date.getSeconds() - (Number(data.Refresh) / 1000)) : '00') + '.000';
            }

            /*make sure we don't exceed the container's limit*/
            if (me.find('.mainAc_feed').children().length > data.MaxCount) return;

            $(".Animload").show();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: data.EndPoint,
                data: '{"maxReturn":"' + data.MaxReturn + '","includeFriends":' + data.WithFriends + ',"includeMine":' + data.WithMine + ',"sinceDateTime":"' + searchDate + '","includeSystem":' + true + '}',
                dataType: "json",
                success: function (msg) {
                    (isSucFunc) ? ActivityFeedAjaxSucceeded(data, msg) : eval(data.SuccessCallBack + "(data, msg)");
                },
                error: (isFailFunc) ? ActivityFeedAjaxFailed : eval(data.FailureCallBack)
            });
        },

        /* 
        update the content
        */
        update: function (data, result) {
            Paint(data, result);
        },

        /* 
        set the interval time to retrieve records
        */
        delay: function (data) {
            setInterval(function () {
                $(this).call(data, false);
                /*me.find('.mainAc_feed').find('.illusion').effect("highlight", {}, 2200);
                me.delay(1500).find('.mainAc_feed').removeClass("illusion");*/
            }, data.Refresh);
        },

        /* get the mouseover helper object*/
        getnavhelp: function (data, e, value) {
            var position = $("div[id$=" + data.Me + "]").position();
            var help = $("div[id$=" + data.Me + "-help]");

            help.stop().hide();

            $("div[id$=" + data.Me + "]").setnavhelp(data, eval(data.NavHelpTopCallBack + "(value)"), eval(data.NavHelpBtmCallBack + "(value)"));

            help.css("left", (position.left - 350) + 'px');
            help.css("top", (e.pageY - 17) + "px");
            help.fadeIn('slow', function () {
                h = (parseInt($(this).find(".btmAc_feedc64x div:first-child").height()) + 10) + "px";
                help.find(".btmAc_feedc64x").css("height", h);
            });

            return help;
        },

        /* 
        update the content
        */
        setnavhelp: function (data, literalup, literaldwn) {
            var help = $("div[id$=" + data.Me + "-help]");
            var top = $(help).find(".topAc_feedc64x div:first-child").html(literalup);
            var btm = $(help).find(".btmAc_feedc64x div:first-child").html(literaldwn);
        },

        /* 
        close nav help
        */
        closenavhelp: function (data) {
            var help = $("div[id$=" + data.Me + "-help]");
            help.hide();
        },

        /*
        Position the Nav Helper (tooltip)
        */
        positionactivity: function (data, elm) {
            var me = $("div[id$=" + data.Me + "]");
            var threshhold = Number(me.attr("threshold"));
            var position = $(elm).offset();

            me.attr("scrollbtm", "0");

            /*set the position*/
            me.css("left", (Math.floor(position.left) + (Number(elm.width()))) + "px");
            me.css("top", ((position.top == 0) ? 5 : position.top) + "px");

            /*if forcing to appear then show browser overflow*/
            if (data.ForceShow)
                me.css("width", data.maxWidth + "px");

            /*adjust the content div*/
            me.find('.mainAc_feed').css("height", Number(me.height()) + "px");

            /*recalc the width: check to make sure we have screen real estate. 17 is for the main browsers scroll bar */
            w = ((threshhold + (Number(me.width()) - 17)) <= data.maxWidth) ? (threshhold + (Number(me.width()) - 17)) : data.maxWidth;
            data.maxWidth = w;
            me.css("width", w + "px");
        },

        /*
        Re-Position the Nav Helper (tooltip) on window resize
        */
        re_positionactivity: function (data, elm) {
            var me = $("div[id$=" + data.Me + "]");
            var threshhold = Number(me.attr("threshold"));
            var position = $(elm).offset();

            /*set the position*/
            me.css("left", (Math.floor(position.left) + (Number(elm.width()))) + "px");
            me.css("top", ((position.top == 0) ? 5 : position.top) + "px");
        }
    });

    /*
    built in success callback. This can be overridden with the
    user passing in their own call back. If that is done, then
    the user must extend the jquery for this control to add the
    results back to the control
    */
    function ActivityFeedAjaxSucceeded(data, result) {
        /*update the content    */
        var me = $("div[id$=" + data.Me + "]");
        me.update(data, result);
        me.attr("scrollbtm", "0");

        /*set to false again so scrolling to bottom will initialize*/
        isscrollTobtm = false;
        $(".Animload").hide();
    }

    /*
    built in failure callback. This can be overridden with the
    user passing in their own call back. If that is done, then
    the user must extend the jquery for this control to add the
    results back to the control
    */
    function ActivityFeedAjaxFailed(result) {
    }

    /*private method: allow expanding of ActivityFeed*/
    function resizeActivity(data, x, y) {
        var me = $("div[id$=" + data.Me + "]");
    }

    /*private method: check when to close*/
    function detectAutoClose(data, x, y) {
        var helps = $(document).find(".topAc_feedc64x").parent();
        var hlft = parseInt(helps.css("left").replace('px', ''));
        var hwdth = parseInt(helps.width()) - 19;
        var htop = parseInt(helps.css("top").replace('px', ''));
        var hhgt = parseInt(helps.height());

        var main = $("div[id$=" + data.Me + "]");
        var mlft = parseInt($(main).css("left"));
        var mwdth = parseInt(main.width());
        var mtop = parseInt(main.css("top").replace('px', ''));
        var mhgt = parseInt(main.height());

        if (((x >= hlft && x <= (hlft + hwdth)) && (y >= htop && y <= (htop + hhgt))) || ((x >= mlft && x <= (mlft + mwdth)) && (y >= mtop && y <= (mtop + mhgt)))) {
            return false;
        }
        else {
            helps.fadeOut('slow');
        }
    }

    /*
    private method: build the data
    */
    function Paint(data, results) {
        /*check whether true json objects are being passed back or they fields are pseudo and in the variable 'd'*/
        var ret = (results.d == null || results.d == 'undefined') ? results : $.parseJSON(results.d);
        var isAfter = false;

        me = $("div[id$=" + data.Me + "]");

        /*isAfter is used to add a class that can be used to set a highlight when new feeds come in. This is still in dev
        as it is not stable yet 10-27-2010*/
        if (me.find('.mainAc_feed').children().length > 0)
            isAfter = true;

        /*show if there is content*/
        if (ret.length > 0) {
            if (me.attr("show") == "0") {
                me.fadeIn(1400, function () {
                    me.attr("show", "1");
                });
            }
        }

        $.each(ret, function (index, value) {
            var actvty;
            var imagehyper;
            var namehyper;

            /*create the profile image*/
            var img = new Image();
            img.src = value.ProfilePhoto;
            $(img).css("left", "0");
            $(img).css("position", "absolute");
            $(img).css("top", "0");
            $(img).css("padding-left", "8px");
            $(img).css("padding-top", "12px");
            $(img).css("width", "28px").css("height", "28px");

            /*create links to add to the feed if the Nav-helper is not being used*/
            if (me.attr("useNav") == "1") {
                actvty = value.Activity;
                imagehyper = img;
                namehyper = value.ProfileName;
            }
            else {
                actvty = jQuery("<a />").attr("href", value.ItemLink).text(value.Activity);
                imagehyper = jQuery("<a />").attr("href", value.ProfileLink).append(img);
                namehyper = jQuery("<a />").attr("href", value.ProfileLink).text(value.ProfileName);
            }

            /*div to sit inside the scroll area*/
            var nm = document.createElement("strong");
            $(nm).prepend(namehyper);
            if (data.NameColor != "") {
                $(nm).css("fontWeight", "bold");
                $(nm).css("color", data.NameColor);
            }

            var p = document.createElement("p");
            $(p).append("<br/>");
            $(p).append(nm);
            $(p).append("&nbsp;&nbsp;");
            $(p).append(actvty);

            var span = document.createElement("span");
            $(span).addClass("timespan");
            $(span).append(value.TimeSpan);
            $(p).append("<br/>");
            $(p).append(span);

            if (data.FeedTextColor != "") {
                $(p).css("line-height", "110%");
                $(p).css("width", "82%");
                $(p).css("margin-top", "0px");
            }
            var div = document.createElement("div");
            $(div).append(imagehyper);
            $(div).append(p);
            if (data.FeedTextColor != "" && data.Border != "") {
                $(div).css("padding", "0 0 0 43px");
                $(div).css("position", "relative");
                $(div).css("fontSize", ".85em");
                $(div).css("fontFamily", "Tahoma, Geneva, sans-serif");
                $(div).css("color", data.FeedTextColor);
                $(div).css("cursor", "pointer");
                $(div).css("width", "100%");
                $(div).css("border-bottom", ".1em solid " + data.Border);
            }

            $(div).bind("mouseover", function () {
                if (data.Hover != "") {
                    $(this).css("backgroundColor", data.Hover);
                }
                else {
                    $(this).addClass("ovr");
                }
            });
            $(div).bind("mousedown", function (e) {
                if (me.attr("useNav") == "1") {
                    me.getnavhelp(data, e, value);
                }
            });
            $(div).bind("mouseout", function () {
                if (data.Hover != "") {
                    $(this).css("backgroundColor", "");
                }
                else {
                    $(this).removeClass("ovr");
                }
            });

            /*allow the newly built to be highlighted and then removed*/
            if (isAfter)
                $(div).addClass("illusion");

            /*append all to the scroll area*/
            me.find('.mainAc_feed').append(div);
        });

        $pane = me.find('.mainAc_feed').jScrollPane({ scrollbarWidth: data.ScrollSize });
    }

    /* 
    create the help notification when mouse down or over 
    on the ActivityFeed
    */
    function create_help(data) {
        /*help body*/
        var help = document.createElement("div");
        $(help).addClass(data.Class + "-help");
        $(help).attr('id', data.Me + '-help');
        $(help).css("width", "350px");
        $(help).css("margin", "0px");
        $(help).css("position", "absolute");    /*changed after to relative*/
        $(help).hide();

        /*top*/
        var top = document.createElement("div");
        $(top).addClass("topAc_feedc64x");
        $(top).css("position", "relative"); /*added after*/
        $(top).css("left", "0px"); /*added after*/
        $(top).css("bottom", "0px"); /*added after*/
        $(top).css("width", "100%");
        $(top).css("margin", "0 0 0 0");
        $(top).css("background-image", "url(" + data.HelpNavTop + ")");
        $(top).css("background-repeat", "no-repeat");
        $(top).css("background-position", "left top");

        var top_content = document.createElement("div");
        $(top_content).css("width", "331px");
        $(top_content).css("margin", "0 0 0 7px");

        $(top).append(top_content);
        $(help).append(top);

        /*bottom*/
        var btm = document.createElement("div");
        $(btm).css("position", "relative"); /*added after*/
        $(btm).css("left", "0px"); /*added after*/
        $(btm).css("bottom", "0px"); /*added after*/
        $(btm).addClass("btmAc_feedc64x");
        $(btm).css("width", "100%");
        $(btm).css("margin", "0 0 0 0");
        $(btm).css("background-image", "url(" + data.HelpNavBtm + ")");
        $(btm).css("background-position", "right bottom");
        $(btm).css("background-repeat", "no-repeat");

        var btm_content = document.createElement("div");
        $(btm_content).css("width", "331px");
        $(btm_content).css("margin", "0 0 0 7px");

        $(btm).append(btm_content);
        $(help).append(btm);

        /*add to body*/
        $('body').append(help);
    }
})(jQuery);

