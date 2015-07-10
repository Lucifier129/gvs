# gvs
Global variables sniffer

## 介绍

我们拥有许多在编译期检查全局变量的工具，如JSLint、JSHint、ESLint等，可以有效帮助我们找出意料之外的全局变量；然而前端环境生态繁杂，有很多第三方库、第三者代码，以及没有经过编译期检查的历史遗留代码。

与其将所有嫌疑代码文件`download`下来，集中检查，不如在控制台黏贴一小段脚本，在浏览器运行时里找到目标文件与目标位置。gvs，全局变量嗅探器，提供这个功能。

## 用法

* 将`gvs.js`代码黏贴到开发者工具的`console`中，得到全局变量 gvs
* `gvs.sniff`方法，获取当前页面上的所有自定义全局变量，以数组形式返回其属性名
* `gvs.debug`方法接受一个参数`target`
	- target 的 Boolean 转换为 false 时，即不传参或者传null、undefined、0、''等，默认嗅探并 debugger 所有全局变量
	- target 是字符串时，window[target] 被赋值时，进入 debugger
	- target 是字符串数组时，所有在数组里的字符串所对应的全局变量，都将被 debugger

## 原理

嗅探原理：获取全局变量的形式为创建一个空内容的iframe，其 contentWindow 是纯净的运行时环境，存在于 window 但不存在于 contentWindow 的属性为自定义全局变量

debug原理：ES5 提供了 Object.defineProperty 函数可以为 Object 类型 添加访问器属性(get/set)，当变量被赋值时，同步触发 setter 函数，在 setter 函数里 debugger 可以在控制台自动对焦到代码位置

TODO：Object.defineProperty(window, propName, accessor) 声明后，如果 propName 被以函数声明而非赋值的方式创建，将抛出 propName 不能重复声明的错误，所以 gvs 暂时无法定位以函数声明方式创建的全局变量
