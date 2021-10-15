'use strict'
class SpineDropdown {
    CSS_HEAD = 's-dd'
    CSS_LIST = `${this.CSS_HEAD}-list`
    CSS_OPEN = `${this.CSS_HEAD}-open`
    constructor(stylesheet) {
        this.ss = document.querySelector(`link[href*=${stylesheet}]`)
        if (this.ss) {
            this.made = false
            this.ss = this.ss.sheet
            this.rules = [
                '.s-dd{position:relative}',
                '.s-dd::before{content: attr(data-selected)}',
                '.s-dd-open{max-height:10rem;z-index:999999;overflow:auto}',
                '.s-dd-list{max-height:0;overflow:hidden;position:absolute;user-select:none;width:100%}'
            ]
            for (const r of this.rules) { this.ss.insertRule(r) }
        } else { throw new ReferenceError(`${stylesheet} is not a referenced stylesheet in document`) }
    }
    make(list, target_id, options) {
        const el = document.getElementById(target_id)
        if (!el) { throw new ReferenceError(`${target_id} is not a referenced id in document`) }
        const li = list
        let _sel
        let _rep = false
        let _cls = ''
        let _clsB = ''

        function isValidInit() {
            function required(param) {
                if (param) { return true } else { throw new Error(`${param} parameter must be defined`) }
            }

            function throwTypeError(e, t) { throw new TypeError(`${e} is not ${t}`) }

            function isArray(v) { return Array.isArray(v) ? true : null }

            function isString(v) { return typeof v === 'string' || !v instanceof String ? true : null }

            function isObject(v) { return typeof v === 'object' || v instanceof Object ? true : null }

            function isBoolean(v) { return typeof v === 'boolean' || !v instanceof Boolean ? true : null }

            if (required(li)) { if (isArray(li)) { _sel = li[0] } else { throwTypeError(li, 'an array') } }
            if (options) {
                if (options && isObject(options)) {
                    if (options.hasOwnProperty('selected')) {
                        const o_s = options.selected
                        if (isString(o_s)) { _sel = o_s } else { throwTypeError(o_s, 'a string') }
                    }
                    if (options.hasOwnProperty('replace')) {
                        const o_r = options.replace
                        if (isBoolean(o_r)) { _rep = o_r } else { throwTypeError(o_r, 'boolean') }
                    }
                    if (options.hasOwnProperty('class')) {
                        const o_c = options.class
                        if (isString(o_c)) { _cls = o_c } else { throwTypeError(o_c, 'a string') }
                    }
                    if (options.hasOwnProperty('classBody')) {
                        const o_cb = options.classBody
                        if (isString(o_cb)) { _clsB = o_cb } else { throwTypeError(o_cb, 'a string') }
                    }
                } else { throwTypeError(options, 'an object') }
            }
            return true
        }
        if (isValidInit()) {
            const f = new DocumentFragment()
            const d = document.createElement('div')
            const dl = document.createElement('div')
            d.setAttribute('class', `${this.CSS_HEAD} ${_cls}`)
            d.setAttribute('data-selected', _sel)
            dl.setAttribute('class', `${this.CSS_LIST} ${_clsB}`)
            for (const o of li) {
                const dt = document.createElement('dt')
                dt.textContent = o
                dl.append(dt)
            }
            d.append(dl)
            f.append(d)
            if (_rep) { el.replaceWith(f) } else { el.appendChild(f) }
            this.made = true
        }
    }
    init() {
        if (this.made) {
            const CSS_HEAD = this.CSS_HEAD
            const CSS_LIST = this.CSS_LIST
            const CSS_OPEN = this.CSS_OPEN
            return new Promise(function(resolve, reject) {
                const dropdowns = document.getElementsByClassName(CSS_HEAD)
                try {
                    for (const dropdown of dropdowns) {
                        const el_list = dropdown.getElementsByClassName(CSS_LIST)[0]
                        if (el_list) {
                            const options = el_list.children
                            dropdown.addEventListener('click', function() { el_list.classList.toggle(CSS_OPEN) })
                            for (const option of options) { option.addEventListener('click', function() { dropdown.dataset.selected = this.textContent }) }
                            resolve(true)
                        } else { console.log(`Warning: missing '${CSS_LIST}' class from dropdown`) }
                    }
                } catch (e) { resolve(null) }
            })
        } else { throw new Error(`at least one dropdown must be made (use 'classInstance.make(<Array>, <String>, <Object>)')`) }
    }
}
module.exports = { SpineDropdown }