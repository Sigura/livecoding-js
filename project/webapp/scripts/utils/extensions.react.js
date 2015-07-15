'use strict';

export default {
    valueLinkBuilder: function(paramName) {
        return {
            value: this.state[paramName],
            requestChange: (val) => this.handleChange({
                target: {
                    name: paramName,
                    value: val
                }
            })
        };
    },

    classSet: function(obj) {
        let result = Object.keys(obj)
            .filter(key => obj[key])
            .join(' ');

        return result;
    },

    l10n (messageName) {
      return this.context.messages[messageName];
    }

};
