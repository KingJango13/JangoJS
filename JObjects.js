(function(window) {
    function createEnum(obj) {
        let enum_ = {};
        let byValueEnum = {};
        let keys = [];
        for(let property in obj) {
            if(!Object.prototype.hasOwnProperty.call(obj, property)) continue;
            if(!(typeof obj[property] === "string" || typeof obj[property] === "number" || typeof obj[property] === "bigint")) continue;
            Object.defineProperty(enum_, property, {
                writable: false,
                enumerable: true,
                value: obj[property]
            });
            byValueEnum[obj[property]] = property;
            keys.push(property);
        }
        Object.defineProperty(enum_, "getNameForValue", {
            writable: false,
            enumerable: false,
            value: (function(value) {
                return byValueEnum[value];
            }).bind(enum_)
        });
        Object.defineProperty(enum_, "members", {
            writable: false,
            enumerable: false,
            value: function() {
                return Array.from(keys)
            }
        });
        
        return Object.freeze(enum_);
    }
    const EXPORTS = {
        createEnum
    };
    if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = EXPORTS;
    }
    window.jango = window.jango || {};
    window.jango.objects = EXPORTS;
})(this);