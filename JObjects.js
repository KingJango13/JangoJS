(function(window) {
    /**
     * 
     * @param {object} obj 
     * @param {PropertyKey} property 
     * @returns {boolean}
     */
    function hasOwn(obj, property) {
        return Object.prototype.hasOwnProperty.call(obj, property);
    }
    function Tuple(array) {
        if(!(this instanceof Tuple)) return new Tuple(array);
        if(!Array.isArray(array)) throw "Tuple can only be constructed from an array";
        for(let i = 0; i < array.length; i++) {
            this[i] = array[i];
        }
        Object.defineProperty(this, "length", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: array.length
        });
        return Object.preventExtensions(this);
    }
    Tuple.prototype = {};
    Tuple.prototype[Symbol.iterator] = function*() {
        for(let i = 0; i < this.length; i++) {
            yield this[i];
        }
    }
    let enums = {};
    function Enum(obj) {
        if(!(this instanceof Enum)) return new Enum(obj);
        let members = [];
        let byValue = {};
        let hash = "DEADBEEF";
        while(hash in enums) {
            hash = Math.floor(Math.random() * 0x100000000).toString(16) + Math.floor(Math.random() * 0x100000000).toString(16);
        }
        Object.defineProperty(this, "__ENUM_HASH__", {
            enumerable: false,
            writable: false,
            value: hash
        });
        for(let property in obj) {
            if(!hasOwn(obj, property)) continue;
            let val = obj[property];
            if(!(typeof val === "string" || typeof val === "number")) continue;
            members.push(property);
            this[property] = val;
            byValue[val] = property;
        }
        enums[hash] = {
            data: Object.freeze(this),
            members: members,
            byValue
        }
        return enums[hash];
    }
    Enum.prototype = {};
    Enum.prototype.members = function() {
        return Array.from(enums[this.__ENUM_HASH__].members);
    }
    Enum.prototype.getNameForValue = function(value) {
        if(!(typeof value === "string" || typeof value === "number"))
            throw `Enums can only have values of type string or type number\nType received: ${typeof value}`;
        return enums[this.__ENUM_HASH__].byValue[value];
    }
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
        createEnum,
        Tuple,
        Enum
    };
    if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = EXPORTS;
    }
    window.jango = window.jango || {};
    window.jango.objects = EXPORTS;
})(this);