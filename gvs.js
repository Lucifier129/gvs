/**
 * 嗅探全局变量
 * 作者：Jade
 * 时间：2015.07.09
 */
(function(root, factory) {
    root["gvs"] = factory()
})(this, function() {

    function createEmptyIframe() {
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        return document.body.appendChild(iframe)
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

    /**
    * @return {Array} globals 当前页面的所有自定义全局变量
    */
    function sniff() {
        var globals = []
        var iframe = eachGV(function(propName) {
            globals.push(propName)
        })
        iframe.parentNode.removeChild(iframe)
        return globals
    }

    /**
    * @param {Array|String|Undefined} target 嗅探目标，不传参时嗅探所有全局变量
    */
    function debug(target) {
        var iframe = eachGV(function(propName, contentWindow) {
            if (!target || (Array.isArray(target) ? target.indexOf(propName) !== -1 : propName === target)) {
                defineDebug(contentWindow, propName)
            }
        })
        var xhr = new XMLHttpRequest()
        xhr.open('GET', window.location.href, false)
        xhr.onreadystatechange = function(e) {
        	if (this.readyState === 4 && this.status === 200) {
        		iframe.contentDocument.write(this.responseText)
        	}
        }
        xhr.send(null)
    }

    return {
        sniff: sniff,
        debug: debug
    }
})
