(function(window) {
    function isNByteUnsigned(value, byteCt) {
        try {
            value = BigInt(value);
        } catch(error) {
            return false;
        }
        return value > 0n && value < (1n << (BigInt(byteCt) * 8n));

    }
    function isNByteSigned(value, byteCt) {
        try {
            value = BigInt(value);
        } catch(error) {
            return false;
        }
        let bound = 1n << BigInt((byteCt * 8) - 1);
        return value > -bound && value < (bound - 1n);
    }
    function isUInt8(value) {
        return isNByteUnsigned(value, 1);
    }
    function isInt8(value) {
        return isNByteSigned(value, 1);
    }
    function isUInt16(value) {
        return isNByteUnsigned(value, 2);
    }
    function isInt16(value) {
        return isNByteSigned(value, 2);
    }
    function isUInt32(value) {
        return isNByteUnsigned(value, 4);
    }
    function isInt32(value) {
        return isNByteSigned(value, 4);
    }
    function isUInt64(value) {
        return isNByteUnsigned(value, 8);
    }
    function isInt64(value) {
        return isNByteSigned(value, 8);
    }
    function ArrayReader(array) {
        if(!(this instanceof ArrayReader)) return new ArrayReader(array);
        if(!Array.isArray(array)) throw new TypeError(this[Symbol.toStringTag] + " must be constructed from an array");
        this.data = Array.from(array);
        this.index = 0;
        Object.defineProperty(this, "length", {
            writable: false,
            value: array.length
        });
        Object.defineProperty(this, "done", {
            get() {
                return this.index >= this.length
            }
        })
    }
    ArrayReader.prototype = {
        get [Symbol.toStringTag]() {
            return "ArrayReader";
        },
        *[Symbol.iterator]() {
            for(let i = 0; i < this.length; i++) {
                yield this.read();
            }
        }
    };
    ArrayReader.prototype.read = function(count = 1) {
        if (typeof count !== "number" || count < 1)
            throw "Argument count on ArrayReader.prototype.read should be a positive integer";
        if (this.done) return undefined;
        if (count === 1) return this.data[this.index++];
        let chunk = [];
        for (let i = 0; i < count; i++) {
            chunk.push(this.read());
        }
        return chunk;
    }

    const EXPORTS = Object.freeze({
        isUInt8,
        isInt8,
        isUInt16,
        isInt16,
        isUInt32,
        isInt32,
        isUInt64,
        isInt64,
        ArrayReader
    });
    if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = EXPORTS;
    }
    globalThis.jango = globalThis.jango || {};
    globalThis.jango.bits = EXPORTS;
})(this);