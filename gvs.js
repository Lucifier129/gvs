/**
 * 嗅探全局变量
 * 作者：Jade
 * 时间：2015.07.09
 */
(function(root, factory) {
    // if (typeof exports === 'object' && typeof module === 'object')
    //     module.exports = factory()
    // else if (typeof define === 'function' && (define.amd || define.cmd))
    //     define(factory)
    // else if (typeof exports === 'object')
    //     exports["gvs"] = factory()
    // else
        root["gvs"] = factory()
})(this, function() {

    function createEmptyIframe() {
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        return document.body.appendChild(iframe)
    }

    function requestScripts(list) {
        return (list || []).map(function(url) {
            return '<script type="text/javascript" src="' + url + '"><\/script>'
        }).join('\n')
    }

    function getUrls() {
        var urls = []
        var scripts = document.getElementsByTagName('script')
        for (var i = scripts.length - 1; i >= 0; i--) {
            var src = scripts[i].src
            if (src && urls.indexOf(src) === -1) {
                urls.unshift(src)
            }
        }
        return urls
    }

    function eachGV(handle) {
        var iframe = createEmptyIframe()
        var contentWindow = iframe.contentWindow
        Object.getOwnPropertyNames(window).forEach(function(propName) {
            if (!contentWindow.hasOwnProperty(propName)) {
            	handle(propName, contentWindow)
            }
        })
        return iframe
    }

    function defineDebug(obj, propName) {
    	var value
    	Object.defineProperty(obj, propName, {
    		get: function() {
    			return value
    		},
    		set: function(v) {
    			value = v
    			debugger
    		}
    	})
    }

    function sniff() {
    	var globals = []
    	var iframe = eachGV(function(propName) {
    		globals.push(propName)
    	})
    	iframe.parentNode.removeChild(iframe)
    	return globals
    }

    var defaultFilters = ['gvs']

    function debug(filters, urls) {
    	filters = (filters || []).concat(defaultFilters)
    	var scripts = urls || getUrls()
    	var iframe = eachGV(function(propName, contentWindow) {
    		if (filters.indexOf(propName) === -1) {
    			defineDebug(contentWindow, propName)
    		}
    	})
    	iframe.contentDocument.write(requestScripts(scripts))
    }

    return {
        sniff: sniff,
        debug: debug
    }
})
