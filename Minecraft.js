(function(window){
    const NBTTagType = Object.freeze({
        END: 0,
        BYTE: 1,
        SHORT: 2,
        INT: 3,
        LONG: 4,
        FLOAT: 5,
        DOUBLE: 6,
        BYTE_ARRAY: 7,
        STRING: 8,
        LIST: 9,
        COMPOUND: 10,
        INT_ARRAY: 11,
        LONG_ARRAY: 12,
        SHORT_ARRAY: 13
    });
    function getNBTTagTypeName(tagType) {
        if(typeof tagType !== "number") throw "tagType must be a number";
        if(tagType < 0 || tagType > 13) throw "Invalid tagType";
        return "END BYTE SHORT INT LONG FLOAT DOUBLE BYTE_ARRAY STRING LIST COMPOUND INT_ARRAY LONG_ARRAY SHORT_ARRAY".split(" ")[tagType];
    }
    /**
     * 
     * @param {Uint8Array} byteArray
     * @returns {Promise<number[]>}
     */
    async function gzipDecompress(byteArray) {
        /**
         * @type {ReadableStream<Uint8Array>}
         */
        let stream = (new Blob(byteArray, {type: "application/zip"})).stream().pipeThrough(new DecompressionStream("gzip"));
        let reader = stream.getReader();
        let bytes = [];
        while(true) {
            let readResult = await reader.read();
            if(readResult.done) break;
            bytes.push.apply(bytes, readResult.value);
        }
        return bytes;
    }

    function NBTTag() {
        if(!(this instanceof NBTTag)) return new NBTTag();
        let t = "NONE";
        if(this instanceof NBTByte) {
            t = "BYTE";
        } else if(this instanceof NBTShort) {
            t = "SHORT";
        } else if(this instanceof NBTInt) {
            t = "INT";
        } else if(this instanceof NBTLong) {
            t = "LONG";
        } else if(this instanceof NBTFloat) {
            t = "FLOAT";
        } else if(this instanceof NBTDouble) {
            t = "DOUBLE";
        } else if(this instanceof NBTByteArray) {
            t = "BYTE_ARRAY";
        } else if(this instanceof NBTString) {
            t = "STRING";
        } else if(this instanceof NBTList) {
            t = "LIST";
        } else if(this instanceof NBTCompound) {
            t = "COMPOUND";
        }
        Object.defineProperty(this, "type", {
            writable: false,
            value: t
        });
        this.value = undefined;
    }
    NBTTag.prototype.toByteStream = function() {
        return [];
    }
    NBTTag.prototype.toNBT = function() {
        return "";
    }
    NBTTag.prototype.toJSON = function() {
        return null;
    }
    NBTTag.isValidNBTTag = function(value) {
        if(value instanceof NBTTag || typeof value === "number" || typeof value === "string") return true;
        if(Array.isArray(value)) return NBTList.isNBTList(value);
        return NBTCompound.isNBTCompound(value);
    }
    NBTTag.getTagTypeForValue = function(value) {
        if(value instanceof NBTTag) return value.type;
        if(typeof value === "number") {
            if(value === Math.floor(value)) return "INT";
            return "FLOAT";
        }
        if(typeof value === "string") return "STRING";
        if(Array.isArray(value)) {
            if(value.some(x => typeof x !== typeof value[0])) throw "NBT tags can only be created from arrays with elements of only 1 type";
            if(value[0] instanceof NBTTag) {
                switch(value[0].type) {
                    case "BYTE": return "BYTE_ARRAY";
                    case "INT": return "INT_ARRAY";
                    case "LONG": return "LONG_ARRAY";
                    case "SHORT": return "SHORT_ARRAY";
                    default: return "LIST";
                }
            }
        }
    }
    /**
     * 
     * @param {keyof NBTTagType | null} type 
     * @param {*} value 
     */
    NBTTag.create = function(type, value) {
        if(type == null) {
            if(NBTInt.isInt(value)) return new NBTInt(value);
            if(NBTLong.isLong(value)) return new NBTLong(value);
            if(NBTFloat.isFloat(value)) return new NBTFloat(value);
            if(NBTDouble.isDouble(value)) return new NBTDouble(value);
            if(NBTString.isString(value)) return new NBTString(value);
            if(NBTIntArray.isIntArray(value)) return new NBTIntArray(value);
            if(NBTLongArray.isLongArray(value)) return new NBTLongArray(value);
            if(NBTList.isNBTList(value)) return new NBTList(value, null);
            if(NBTCompound.isNBTCompound(value)) return new NBTCompound(value);
            if(Array.isArray(value) && value.some(x => typeof x !== typeof value[0])) {
                throw "NBT tags can only be created from arrays with elements of only 1 type of NBT tag";
            }
            throw `Unable to determine type of ${Object.prototype.toString.call(value)}`;
        }
        switch(type) {
            case "END": return new NBTTag();
            case "BYTE": return new NBTByte(value);
            case "SHORT": return new NBTShort(value);
            case "INT": return new NBTInt(value);
            case "LONG": return new NBTLong(value);
            case "FLOAT": return new NBTFloat(value);
            case "DOUBLE": return new NBTDouble(value);
            case "BYTE_ARRAY": return new NBTByteArray(value);
            case "STRING": return new NBTString(value);
            case "LIST": return new NBTList(value, null);
            case "COMPOUND": return new NBTCompound(value);
            case "INT_ARRAY": return new NBTIntArray(value);
            case "LONG_ARRAY": return new NBTLongArray(value);
            case "SHORT_ARRAY": return new NBTShortArray(value);
            default: throw "Unknown NBT tag type: " + type +
                "\nValid types: \"END\", \"BYTE\", \"SHORT\", \"INT\", \"LONG\", \"FLOAT\", \"DOUBLE\", \"BYTE_ARRAY\", \"STRING\", \"LIST\", \"COMPOUND\", \"INT_ARRAY\", \"LONG_ARRAY\", \"SHORT_ARRAY\""
        }
    }

    /**
     * 
     * @param {number | NBTNumberTag} num 
     * @returns 
     */
    function NBTNumberTag(num = 0) {
        if(!(this instanceof NBTNumberTag)) return new NBTNumberTag(num);
        if(num instanceof NBTNumberTag) {
            num = num.value
        }
        NBTTag.call(this);
        this.value = num;
    }
    NBTNumberTag.prototype = Object.create(NBTTag.prototype);
    NBTNumberTag.prototype.valueOf = function() {
        return this.value;
    }
    NBTNumberTag.prototype.toString = function(radix) {
        return this.value.toString(radix);
    }
    NBTNumberTag.prototype.toJSON = function() {
        return this.value;
    }
    NBTNumberTag.prototype.toNBT = function() {
        return this.value.toString();
    }

    function isNumberNByteInteger(num, byteCt) {
        if(num instanceof NBTNumberTag) return isNumberNByteInteger(num.value, byteCt);
        if(typeof num !== "number") return false;
        if(num !== Math.floor(num)) return false;
        let lowerBound = -Math.pow(2, (byteCt * 8) - 1);
        let upperBound = -lowerBound - 1;
        return num >= lowerBound && num <= upperBound;
    }

    function NBTByte(byte = 0) {
        if(!(this instanceof NBTByte)) return new NBTByte(byte);
        if(!NBTByte.isByte(byte)) throw "NBTByte must be constructed from an 8 bit signed integer";
        NBTNumberTag.call(this, byte);
    }
    NBTByte.prototype = Object.create(NBTNumberTag.prototype);
    NBTByte.prototype.toByteStream = function() {
        return Uint8Array.of(this.value);
    }
    NBTByte.prototype.toNBT = function() {
        return this.value.toString() + "b";
    }
    NBTByte.isByte = function(value) {
        return isNumberNByteInteger(value, 1);
    }

    function NBTShort(short = 0) {
        if(!(this instanceof NBTShort)) return new NBTShort(short);
        if(!NBTShort.isShort(short)) throw "NBTShort must be constructed from a 16 bit signed integer\nReceived: " + short;
        NBTNumberTag.call(this, short);
    }
    NBTShort.prototype = Object.create(NBTNumberTag.prototype);
    NBTShort.prototype.toByteStream = function() {
        return Uint8Array.from([this.value >> 8, this.value & 0xff]);
    }
    NBTShort.prototype.toNBT = function() {
        return this.value.toString() + "s";
    }
    NBTShort.isShort = function(value) {
        return isNumberNByteInteger(value, 2);
    }
    
    function NBTInt(int = 0) {
        if(!(this instanceof NBTInt)) return new NBTInt(int);
        if(!NBTInt.isInt(int)) throw "NBTInt must be constructed from a 32 bit signed integer\nReceived: " + int;
        NBTNumberTag.call(this, int);
    }
    NBTInt.prototype = Object.create(NBTNumberTag.prototype);
    NBTInt.prototype.toByteStream = function() {
        return Uint8Array.of(this.value >> 24, (this.value >> 16) & 0xff, (this.value >> 8) & 0xff, this.value & 0xff);
    }
    NBTInt.isInt = function(value) {
        return isNumberNByteInteger(value, 4);
    }

    function NBTLong(long = 0n) {
        if(!(this instanceof NBTLong)) return new NBTLong(long);
        const errorMsg = "NBTLong must be constructed from a 64 bit signed integer or a string representing a 64 bit signed integer";
        NBTNumberTag.call(this, 0);
        if(long instanceof NBTNumberTag) {
            long = long.value;
        }
        if(typeof long === "number") {
            long = BigInt(long);
        } else if(typeof long === "string") {
            try {
                long = BigInt(long);
            } catch(error) {
                throw errorMsg;
            }
        }
        if(typeof long !== "bigint") throw errorMsg;
        this.value = long;
    }
    NBTLong.prototype = Object.create(NBTNumberTag.prototype);
    NBTLong.prototype.toByteStream = function() {
        let view = new DataView(new ArrayBuffer(8));
        view.setBigInt64(0, this.value);
        return new Uint8Array(view.buffer);
    }
    NBTLong.prototype.toNBT = function() {
        return this.value.toString() + "L";
    }
    NBTLong.isLong = function(value) {
        if(value instanceof NBTLong) return true;
        if(value instanceof NBTNumberTag) return NBTLong.isLong(BigInt(value.value));
        if(typeof value === "number") return NBTLong.isLong(BigInt(value));
        if(typeof value === "string") {
            try {
                return NBTLong.isLong(value);
            } catch(error) {
                return false;
            }
        }
        return isNumberNByteInteger(value, 8);
    }

    function NBTFloat(float = 0) {
        if(!(this instanceof NBTFloat)) return new NBTFloat(float);
        if(!NBTFloat.isFloat(float)) throw "NBTFloat must be constructed from a 32 bit floating point number";
        NBTNumberTag.call(this, float);
    }
    NBTFloat.prototype = Object.create(NBTNumberTag.prototype);
    NBTFloat.prototype.toByteStream = function() {
        let view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, this.value);
        return new Uint8Array(view.buffer);
    }
    NBTFloat.prototype.toNBT = function() {
        let str = this.value.toString();
        if(!str.includes(".")) {
            str += ".0";
        }
        return str + "f";
    }
    NBTFloat.isFloat = function(value) {
        if(value instanceof NBTFloat) return true;
        if(value instanceof NBTNumberTag) return NBTFloat.isFloat(value.value);
        if(typeof value !== "number") return false;
        return Float32Array.of(value)[0] === value;
    }

    function NBTDouble(double = 0) {
        if(!(this instanceof NBTDouble)) return new NBTDouble(double);
        if(!NBTDouble.isDouble(double)) throw "NBTDouble must be constructed from a 64 bit floating point number";
        NBTNumberTag.call(this, double);
    }
    NBTDouble.prototype = Object.create(NBTNumberTag.prototype);
    NBTDouble.prototype.toByteStream = function() {
        let view = new DataView(new ArrayBuffer(8));
        view.setFloat64(0, this.value);
        return new Uint8Array(view.buffer);
    }
    NBTDouble.prototype.toNBT = function() {
        let str = this.value.toString();
        if(!str.includes(".")) {
            str += ".0";
        }
        return str + "d";
    }
    NBTDouble.isDouble = function(value) {
        if(value instanceof NBTDouble) return true;
        if(value instanceof NBTNumberTag) return NBTDouble.isDouble(value.value);
        return typeof value === "number";
    }

    /**
     * 
     * @param {number} index 
     * @param {number} maxLen 
     * @returns 
     */
    function formatIndex(index, maxLen) {
        if(Math.abs(index) > maxLen) throw `Index ${index} is out of bounds`;
        if(index >= 0) return index;
        return maxLen + index;
    }
    function NBTArrayTag(array) {
        if(!(this instanceof NBTArrayTag)) return new NBTArrayTag(array);
        NBTTag.call(this);
        this.value = array;
        this.length = array.length;
    }
    NBTArrayTag.prototype = Object.create(NBTTag.prototype);
    NBTArrayTag.prototype.toByteStream = function() {
        let bytes = [];
        bytes.push.apply(bytes, new NBTInt(this.length).toByteStream());
        for(let i = 0; i < this.length; i++) {
            bytes.push.apply(bytes, this.value[i].toByteStream());
        }
        return bytes;
    }
    NBTArrayTag.prototype.at = function(index) {
        return this.value[formatIndex(index, this.length)];
    }
    NBTArrayTag.prototype.set = function(index, value) {
        this.value[formatIndex(index, this.length)] = value;
    }
    NBTArrayTag.prototype.toJSON = function() {
        return this.value.map(x => x.value);
    }
    NBTArrayTag.isIntegerArray = function(array) {
        if(array instanceof NBTArrayTag) return true;
        if(!Array.isArray(array)) return false;
        for(let i = 0; i < array.length; i++) {
            if(typeof array[i] !== "number") return false;
            if(array[i] !== Math.floor(array[i])) return false;
        }
        return true;
    }

    function NBTByteArray(array) {
        if(!(this instanceof NBTByteArray)) return new NBTByteArray(array);
        if(!NBTByteArray.isByteArray(array)) throw "NBTByteArray must be constructed from an array of 8 bit signed integers";
        let arr = Array.from(array instanceof NBTArrayTag ? array.value : array);
        for(let i = 0; i < arr.length; i++) {
            if(!(arr[i] instanceof NBTByte)) {
                arr[i] = NBTByte(arr[i]);
            }
        }
        NBTArrayTag.call(this, arr);
    }
    NBTByteArray.prototype = Object.create(NBTArrayTag.prototype);
    NBTByteArray.isByteArray = function(array) {
        if(!NBTArrayTag.isIntegerArray(array)) return false;
        for(let i = 0; i < array.length; i++) {
            if(!NBTByte.isByte(array[i])) return false;
        }
        return true;
    }

    function NBTString(str = "") {
        if(!(this instanceof NBTString)) return new NBTString(str);
        if(str instanceof NBTString) {
            str = str.value;
        }
        if(typeof str !== "string") throw "NBTString must be constructed with a string no longer than 32,767 characters";
        if(str.length > 0xffff) throw `String of length ${str.length} is too large\nMax length: ${0xffff}`;
        NBTTag.call(this);
        this.value = str;
    }
    NBTString.prototype = Object.create(NBTTag.prototype);
    Object.defineProperty(NBTString.prototype, "length", {
        get() {
            return this.value.length;
        }
    });
    NBTString.prototype.charAt = function(index) {
        return this.value[formatIndex(index, this.length)];
    }
    NBTString.prototype.codePointAt = function(index) {
        return this.charAt(index).codePointAt(0);
    }
    NBTString.prototype.setCharAt = function(index, char) {
        this.value[formatIndex(index, this.length)] = char;
    }
    NBTString.prototype.append = function(str) {
        this.value += str;
    }
    NBTString.prototype.substring = function(start, end) {
        return new NBTString(this.value.substring(start, end));
    }
    NBTString.prototype.toByteStream = function() {
        if(this.value === "") return Uint8Array.of(0, 0)
        let bytes = [this.length >> 8, this.length & 0xff];
        for(let i = 0; i < this.length; i++) {
            let cp = this.codePointAt(i);
            if(cp < 0x80) {
                bytes.push(cp);
                continue;
            }
            encodeURIComponent(this.value[i]).substring(1).split("%").forEach(function(byteStr) {
                bytes.push(parseInt(byteStr, 16));
            });
        }
        return Uint8Array.from(bytes);
    }
    NBTString.prototype.toString = function() {
        return this.value;
    }
    NBTString.prototype.toNBT = function() {
        return this.value;
    }
    NBTString.prototype.toJSON = function() {
        return this.value;
    }
    NBTString.isString = function(value) {
        return (value instanceof NBTString) || (typeof value === "string");
    }

    function NBTList(list, type) {
        if(!(this instanceof NBTList)) return new NBTList(list, type);
        if(!NBTList.isNBTList(list)) throw "NBTList must be constructed from a list of 1 type of NBTTag";
        NBTTag.call(this);
        if(typeof type === "number") {
            type = getNBTTagTypeName(type);
        }
        this.value = [];
        for(let i = 0; i < list.length; i++) {
            let item = list[i]
            if(!(item instanceof NBTTag)) {
                item = NBTTag.create(type, item);
            }
            this.value.push(item);
            if(type == null) {
                type = item.type;
                continue;
            }
            //if(item.type != type) throw "Error: Heterogenous list;\nNBTList must be constructed from a list of 1 type of NBTTag"
        }
        this.listType = type;
    }
    NBTList.prototype = Object.create(NBTTag.prototype);
    Object.defineProperty(NBTList.prototype, "length", {
        get() {
            return this.value.length;
        }
    });
    NBTList.prototype.at = function(index) {
        return this.value[formatIndex(index, this.length)];
    }
    NBTList.prototype.set = function(index, value) {
        if(!(value instanceof NBTTag)) {
            value = NBTTag.create(this.listType, value);
        }
        if(value.type !== this.listType) throw "NBTList can only be created with elements of 1 type";
        this.value[formatIndex(index, this.length)] = value;
    }
    NBTList.prototype.append = function(value) {
        this.value.push(undefined);
        try {
            this.set(this.length - 1, value);
        } catch (error) {
            this.value.pop();
            throw error;
        }
    }
    NBTList.prototype.toByteStream = function() {
        let bytes = [NBTTagType[this.listType]];
        bytes.push.apply(bytes, new NBTInt(this.length).toByteStream());
        //console.log("Length serialized (%d)", this.length);
        for(let i = 0; i < this.length; i++) {
            bytes.push.apply(bytes, this.value[i].toByteStream());
            //console.log("Serialized item %d", i);
        }
        //console.log("List<%s>[%d] serialized", this.listType, this.length);
        return bytes;
    }
    NBTList.prototype.toNBT = function() {
        return this.value.map(x => x.toNBT());
    }
    NBTList.prototype.toNBTString = function() {
        return "[" + this.value.map(function(val) {
            if(val instanceof NBTNumberTag) return val.toNBT();
            if(val instanceof NBTString) return `"${val.value}"`;
            if(val instanceof NBTList || val instanceof NBTCompound) return val.toNBTString();
        }).toString() + "]";
    }
    NBTList.prototype.toJSON = function() {
        let list = [];
        for(let i = 0; i < this.length; i++) {
            list.push(this.value[i].toJSON());
        }
        return list;
    }
    NBTList.isNBTList = function(list) {
        if(list instanceof NBTList) return true;
        if(!Array.isArray(list)) return false;
        let type;
        for(let i = 0; i < list.length; i++) {
            if(!NBTTag.isValidNBTTag(list[i])) return false;
            type = list[0].type;
            if(list[i].type !== type || typeof list[i] !== typeof list[0]) return false;
        }
        return true;
    }

    function NBTCompound(obj = {}, name = "") {
        if(!(this instanceof NBTCompound)) return new NBTCompound(obj, name);
        NBTTag.call(this);
        this.value = obj;
    }
    NBTCompound.prototype = Object.create(NBTTag.prototype);
    NBTCompound.prototype.keys = function() {
        return Object.keys(this.value);
    }
    NBTCompound.prototype.entries = function() {
        return Object.entries(this.value);
    }
    NBTCompound.prototype.get = function(property) {
        if(!Object.prototype.hasOwnProperty.call(this.value, property)) return undefined;
        return this.value[property];
    }
    NBTCompound.prototype.set = function(property, value) {
        this.value[property] = value;
    }
    NBTCompound.prototype.toByteStream = function() {
        let bytes = [];
        for(let property in this.value) {
            if(!Object.prototype.hasOwnProperty.call(this.value, property)) continue;
            let val = this.value[property];
            bytes.push(NBTTagType[val.type]);
            bytes.push.apply(bytes, NBTString(property).toByteStream());
            let valBytes = val.toByteStream();
            for(let i = 0; i < valBytes.length; i++) {
                bytes.push(valBytes[i]);
            }
        }
        bytes.push(NBTTagType.END);
        return bytes;
    }
    NBTCompound.prototype.toNBT = function() {
        let obj = {};
        for(let property in this.value) {
            if(!Object.prototype.hasOwnProperty.call(this.value, property)) continue;
            obj[property] = this.value[property].toNBT();
        }
        return obj;
    }
    NBTCompound.prototype.toNBTString = function() {
        let str = "{";
        for(let property in this.value) {
            if(!Object.prototype.hasOwnProperty.call(this.value, property)) continue;
            let maybeQuote = property === "" ? "\"" : "";
            str += maybeQuote + property + maybeQuote + ":";
            let val = this.value[property];
            if(val instanceof NBTNumberTag) {
                str += val.toNBT();
            } else if(val instanceof NBTString) {
                str += `"${val.value}"`;
            } else if(val instanceof NBTList || val instanceof NBTCompound) {
                str += val.toNBTString();
            }
            str += ",";
        }
        if(str === "{") return "{}";
        return str.substring(0, str.length - 1) + "}";
    }
    NBTCompound.prototype.toJSON = function() {
        let obj = {};
        for(let property in this.value) {
            if(!Object.prototype.hasOwnProperty.call(this.value, property)) continue;
            obj[property] = this.value[property].toJSON();
        }
        return obj;
    }
    NBTCompound.isNBTCompound = function(object) {
        if(object instanceof NBTCompound) return true;
        if(typeof object !== "object") return false;
        for(let property in object) {
            if(!Object.prototype.hasOwnProperty.call(object, property)) continue;
            if(!NBTTag.isValidNBTTag(object[property])) return false;
        }
        return true;
    }

    function NBTIntArray(array) {
        if(!(this instanceof NBTIntArray)) return new NBTIntArray(array);
        if(!NBTIntArray.isIntArray(array)) throw "NBTIntArray must be constructed from an array of 32 bit signed integers";
        NBTArrayTag.call(this, array);
    }
    NBTIntArray.isIntArray = function(array) {
        if(array instanceof NBTIntArray) return true;
        if(!Array.isArray(array)) return false;
        for(let i = 0; i < array.length; i++) {
            if(!NBTInt.isInt(array[i])) return false;
        }
        return true;
    }
    function NBTLongArray(array) {
        if(!(this instanceof NBTLongArray)) return new NBTLongArray(array);
        if(!NBTLongArray.isLongArray(array)) throw "NBTLongArray must be constructed from an array of 64 bit signed integers";
        NBTArrayTag.call(this, array);
    }
    NBTLongArray.isLongArray = function(array) {
        if(array instanceof NBTLongArray) return true;
        if(!Array.isArray(array)) return false;
        for(let i = 0; i < array.length; i++) {
            if(!NBTLong.isLong(array[i])) return false;
        }
        return true;
    }
    function NBTShortArray(array) {
        if(!(this instanceof NBTShortArray)) return new NBTShortArray(array);
        if(!NBTShortArray.isShortArray(array)) throw "NBTShortArray must be constructed from an array of 16 bit signed integers";
        NBTArrayTag.call(this, array);
    }
    NBTShortArray.isShortArray = function(array) {
        if(array instanceof NBTShortArray) return true;
        if(!Array.isArray(array)) return false;
        for(let i = 0; i < array.length; i++) {
            if(!NBTShort.isShort(array[i])) return false;
        }
        return true;
    }

    function parseNBTFromByteStream(data) {
        let byteIndex = 0;
        function readByte() {
            if(byteIndex >= data.length) throw "End of stream reached";
            let byte = data[byteIndex];
            byteIndex++;
            return byte;
        }
        function readSizedChunk(size) {
            let chunk = new DataView(new ArrayBuffer(size));
            for(let i = 0; i < size; i++) {
                chunk.setUint8(i, readByte());
            }
            return chunk;
        }
        function readShort() {
            return readSizedChunk(2).getInt16(0);
        }
        function readInt() {
            return readSizedChunk(4).getInt32(0);
        }
        function readString(){
            let strlen = readShort();
            let str = "";
            for(let i = 0; i < strlen; i++) {
                str += String.fromCodePoint(readByte());
            }
            return str;
        }
        function readSizedIntArray(intSize) {
            let array = [];
            let arrayLen = readInt();
            let chunk = readSizedChunk(arrayLen * intSize);
            for(let i = 0; i < chunk.byteLength; i++) {
                array.push(chunk["get" + (intSize === 8 ? "Big" : "") + "Int" + (intSize * 8).toString()]);
            }
            return array;
        }
        function readValue(type) {
            switch(type) {
                case NBTTagType.END: return null;
                case NBTTagType.BYTE: return new NBTByte(readByte());
                case NBTTagType.SHORT: return new NBTShort(readShort());
                case NBTTagType.INT: return new NBTInt(readInt());
                case NBTTagType.LONG: return new NBTLong(readSizedChunk(8).getBigInt64(0));
                case NBTTagType.FLOAT: return new NBTFloat(readSizedChunk(4).getFloat32(0));
                case NBTTagType.DOUBLE: return new NBTDouble(readSizedChunk(8).getFloat64(0))
                case NBTTagType.BYTE_ARRAY: return new NBTByteArray(readSizedIntArray(1));
                case NBTTagType.STRING: return new NBTString(readString());
                case NBTTagType.LIST: {
                    if(byteIndex === data.length - 1) throw "End of nbt byte stream";
                    let listType = readByte();
                    if(listType < 0 || listType > 13) throw "Invalid list type: " + listType.toString();
                    let listLength = readInt();
                    if(listLength < 0) throw "Invalid list length: " + listLength.toString();
                    if(listType === NBTTagType.END) return new NBTList([], listType);
                    let list = [];
                    for(let i = 0; i < listLength; i++) {
                        list.push(readValue(listType));
                    }
                    return new NBTList(list, listType);
                }
                case NBTTagType.COMPOUND: {
                    let val = {};
                    while (true) {
                        let tagType = readByte();
                        if(tagType === NBTTagType.END) break;
                        let name = readString();
                        val[name] = readValue(tagType);
                    }
                    return new NBTCompound(val);
                }
                case NBTTagType.INT_ARRAY: return new NBTIntArray(readSizedIntArray(4));
                case NBTTagType.LONG_ARRAY: return new NBTLongArray(readSizedIntArray(8));
                case NBTTagType.SHORT_ARRAY: return new NBTShortArray(readSizedIntArray(2));
            }
        }
        let root = new NBTCompound();
        if(readByte() !== NBTTagType.COMPOUND) return root;
        let rootName = readString();
        root.set(rootName, readValue(NBTTagType.COMPOUND));
        return root;
    }

    const EXPORTS = Object.freeze({
        NBTTagType,
        NBTByte,
        NBTShort,
        NBTInt,
        NBTLong,
        NBTFloat,
        NBTDouble,
        NBTByteArray,
        NBTString,
        NBTList,
        NBTCompound,
        NBTIntArray,
        NBTLongArray,
        NBTShortArray,
        parseNBTFromByteStream
    });

    if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = EXPORTS;
    }
    window.jango = window.jango || {};
    Object.defineProperty(window.jango, "minecraft", {
        writable: false,
        value: EXPORTS
    });
    
})(this);