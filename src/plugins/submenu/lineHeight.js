/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 20197 JiHong Lee.
 * MIT license.
 */
'use strict';

export default {
    name: 'lineHeight',
    add: function (core, targetElement) {
        const context = core.context;
        context.lineHeight = {
            _sizeList: null,
            currentSize: -1
        };

        /** set submenu */
        let listDiv = this.setSubmenu.call(core);
        let listUl = listDiv.querySelector('ul');

        /** add event listeners */
        listUl.addEventListener('click', this.pickup.bind(core));

        context.lineHeight._sizeList = listUl.querySelectorAll('li button');

        /** append html */
        targetElement.parentNode.appendChild(listDiv);

        /** empty memory */
        listDiv = null, listUl = null;
    },

    setSubmenu: function () {
        const option = this.context.option;
        const lang = this.lang;
        const listDiv = this.util.createElement('DIV');

        listDiv.className = 'se-submenu se-list-layer';

        const sizeList = !option.lineHeights ? [
            {text: '1', value: 1},
            {text: '1.15', value: 1.15},
            {text: '1.5', value: 1.5},
            {text: '2', value: 2}
        ] : option.lineHeights;

        let list = '<div class="se-list-inner">' +
                '<ul class="se-list-basic">' +
                    '<li><button type="button" class="default_value se-btn-list" title="' + lang.toolbar.default + '">(' + lang.toolbar.default + ')</button></li>';
        for (let i = 0, len = sizeList.length, text, size; i < len; i++) {
            size = sizeList[i];
            list += '<li><button type="button" class="se-btn-list" data-value="' + size.value + '" title="' + size.text + '">' + size.text + '</button></li>';
        }
        list += '</ul></div>';

        listDiv.innerHTML = list;

        return listDiv;
    },

    on: function () {
        const lineHeightContext = this.context.lineHeight;
        const sizeList = lineHeightContext._sizeList;
        const currentSize = this.util.getFormatElement(this.getSelectionNode()).style.lineHeight + '';

        if (currentSize !== lineHeightContext.currentSize) {
            for (let i = 0, len = sizeList.length; i < len; i++) {
                if (currentSize === sizeList[i].getAttribute('data-value')) {
                    this.util.addClass(sizeList[i], 'active');
                } else {
                    this.util.removeClass(sizeList[i], 'active');
                }
            }

            lineHeightContext.currentSize = currentSize;
        }
    },

    pickup: function (e) {
        if (!/^BUTTON$/i.test(e.target.tagName)) return false;
        
        e.preventDefault();
        e.stopPropagation();

        const value = e.target.getAttribute('data-value') || '';
        const formats = this.getSelectedElements();

        for (let i = 0, len = formats.length; i < len; i++) {
            formats[i].style.lineHeight = value;
        }

        // history stack
        this.history.push();
        this.submenuOff();
    }
};
