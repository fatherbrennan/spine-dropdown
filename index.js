'use strict'

class SpineDropdown {

    // Optional constructor
    constructor(stylesheet) {

        // Reserved class names
        this.CSS_HEAD = 's-dd'
        this.CSS_BODY = `${this.CSS_HEAD}-body`
        this.CSS_OPEN = `${this.CSS_HEAD}-open`

        // CSS to inject
        this.RULES = [
            '.s-dd{position:relative;}',
            '.s-dd::before{content:attr(data-selected);}',
            '.s-dd-open{visibility:visible;z-index:999999;overflow:auto;}',
            '.s-dd-body{visibility:hidden;overflow:hidden;position:absolute;user-select:none;width:100%;outline:0;}'
        ]

        // Get stylesheet
        this.STYLESHEET = stylesheet ? document.querySelector(`link[href*=${stylesheet}]`).sheet :
            (function() {

                // Create CSSStyleSheet
                const ss = document.createElement('style')
                document.head.prepend(ss)
                return ss.sheet

            })()

        if (this.STYLESHEET) {

            // Inject CSS
            for (const r of this.RULES) {
                this.STYLESHEET.insertRule(r)
            }

        } else {
            throw new ReferenceError(`${this.STYLESHEET} is not a referenced stylesheet in document`)

        }

    }

    // Create dropdown element method
    make(list, options) {
        const li = list
        let el = null
        let _sel = ''
        let _rep = false
        let _cls = ''
        let _clsB = ''

        // Error check params
        function isValidInit() {

            function required(param) {

                if (param) {
                    return true

                } else {
                    throw new Error(`${param} parameter must be defined`)

                }
            }

            function throwTypeError(e, t) {
                throw new TypeError(`${e} is not ${t}`)
            }

            function isArray(v) {
                return Array.isArray(v) ? true : null
            }

            function isString(v) {
                return typeof v === 'string' || !v instanceof String ? true : null
            }

            function isObject(v) {
                return typeof v === 'object' || v instanceof Object ? true : null
            }

            function isBoolean(v) {
                return typeof v === 'boolean' || !v instanceof Boolean ? true : null
            }

            if (required(li)) {

                if (isArray(li)) {
                    _sel = li[0]

                } else {
                    throwTypeError(li, 'an array')

                }

            }

            // Error check options object passed
            if (options) {
                const o = options

                if (o && isObject(o)) {

                    if (o.hasOwnProperty('target')) {
                        const o_t = o.target

                        if (isString(o_t)) {
                            el = document.getElementById(o_t)

                            if (!el) {
                                throw new ReferenceError(`${o_t} is not a referenced id in document`)

                            } else {

                                if (o.hasOwnProperty('replace')) {
                                    const o_r = o.replace

                                    if (isBoolean(o_r)) {
                                        _rep = o_r

                                    } else {
                                        throwTypeError(o_r, 'boolean')

                                    }

                                }

                            }

                        } else {
                            throwTypeError(o_t, 'a string')

                        }

                    }

                    if (o.hasOwnProperty('selected')) {
                        const o_s = o.selected

                        if (isString(o_s)) {
                            _sel = o_s

                        } else {
                            throwTypeError(o_s, 'a string')

                        }

                    }

                    if (o.hasOwnProperty('class')) {
                        const o_c = o.class

                        if (isString(o_c)) {
                            _cls = o_c

                        } else {
                            throwTypeError(o_c, 'a string')

                        }

                    }

                    if (o.hasOwnProperty('classBody')) {
                        const o_cb = o.classBody

                        if (isString(o_cb)) {
                            _clsB = o_cb

                        } else {
                            throwTypeError(o_cb, 'a string')

                        }

                    }

                } else {
                    throwTypeError(o, 'an object')

                }

            }

            return true

        }

        // Create dropdown in document fragment
        if (isValidInit()) {
            const f = new DocumentFragment()
            const d = document.createElement('div')
            const dl = document.createElement('div')

            // Create dropdown elements
            d.setAttribute('class', `${this.CSS_HEAD} ${_cls}`)
            d.setAttribute('data-selected', _sel)
            dl.setAttribute('class', `${this.CSS_BODY} ${_clsB}`)
            dl.setAttribute('tabindex', '0')

            // Append option elements to dropdown body
            for (const o of li) {
                const dt = document.createElement('dt')
                dt.textContent = o
                dl.append(dt)
            }

            d.append(dl)
            f.append(d)

            // If target option passed
            if (el) {

                // Replace or append dropdown in document
                if (_rep) {
                    el.replaceWith(f)

                } else {
                    el.appendChild(f)

                }

            } else {

                // Otherwise return dropdown as document fragment
                return f

            }

        }

    }

    // Add functionality to all document dropdowns (run once)
    init() {
        const CSS_HEAD = this.CSS_HEAD
        const CSS_BODY = this.CSS_BODY
        const CSS_OPEN = this.CSS_OPEN

        return new Promise(function(resolve, reject) {

            // Get all dropdowns in document by reserved class name
            const dropdowns = document.getElementsByClassName(CSS_HEAD)

            // If any dropdowns exist in document
            if (dropdowns.length > 0) {

                try {

                    for (const dropdown of dropdowns) {

                        // Get first dropdown body by reserved class name
                        const el_body = dropdown.getElementsByClassName(CSS_BODY)[0]

                        if (el_body) {
                            const options = el_body.children

                            // Add open and close functionality to the dropdown head
                            dropdown.addEventListener('mousedown', function(e) {
                                el_body.classList.toggle(CSS_OPEN)
                                e.preventDefault()
                                el_body.focus()

                            })

                            // Set focus after transitions have ended
                            dropdown.addEventListener('transitionend', function() {
                                el_body.focus()

                            })

                            // Hide dropdown body if clicked outside dropdown body
                            el_body.addEventListener('blur', function() {
                                this.classList.remove(CSS_OPEN)

                            })

                            // Add selected option to dropdown head
                            for (const option of options) {
                                option.addEventListener('mousedown', function() {
                                    dropdown.dataset.selected = this.textContent

                                })

                            }

                            resolve(true)

                        } else {

                            // Soft warn user that adding dropdown functionality failed
                            console.log(`Warning: missing spine-dropdown body`)

                        }

                    }

                } catch (e) {
                    resolve(null)

                }

            } else {
                resolve(null)
                console.log(`Warning: missing spine-dropdown`)

            }

        })

    }

}
module.exports = { SpineDropdown }