+(function(module){
'use strict';

let React           = require('react'),
    objectAssign    = require('object-assign'),
    resources       = require('./resources.react');

module.exports = {
    getChildContext() {
        return resources;
    },
    childContextTypes: {
        locales: React.PropTypes.string,
        messages: React.PropTypes.object,
        formats: React.PropTypes.object,
        lang: React.PropTypes.string
    },
    contextTypes: {
        locales: React.PropTypes.string,
        messages: React.PropTypes.object,
        formats: React.PropTypes.object,
        lang: React.PropTypes.string
    },
    l10n (messageName) {
        return resources.messages[messageName];
    },
    extend (obj){
        obj.childContextTypes = this.childContextTypes;
        obj.contextTypes = this.contextTypes;

        objectAssign(obj.prototype, {
            l10n: this.l10n,
            getChildContext: this.getChildContext
        });

    }
};

})(module);