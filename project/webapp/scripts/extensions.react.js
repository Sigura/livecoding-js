+(function(module){
'use strict';

module.exports = {
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
    }
};

})(module);