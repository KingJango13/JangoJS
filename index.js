(function(window){
    let jango = {};

//#region Objects
    function hasOwn(obj, property) {
        return Object.prototype.hasOwnProperty.call(obj, property);
    }
    
    function Tuple(array) {
        if(!(this instanceof Tuple)) return new Tuple(array);
        if(Array.isArray(array)) return new Tuple(...array);
        for(let i = 0; i < arguments.length; i++) {
            this[i] = arguments[i];
        }
        Object.defineProperty(this, "length", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: arguments.length
        });
        return Object.preventExtensions(this);
    }
    Tuple.prototype = {};
    Tuple.prototype[Symbol.iterator] = function*() {
        for(let i = 0; i < this.length; i++) {
            yield this[i];
        }
    }
    Tuple.prototype.toString = function() {
        if(this.length === 0) return "";
        let str = "" + this[0];
        for(let i = 1; i < this.length; i++) {
            str += "," + this[i];
        }
        return str;
    }
    Tuple.prototype[Symbol.toStringTag] = "Tuple";

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
        return enums[hash].data;
    }
    Enum.prototype = {};
    Enum.prototype.members = function() {
        return Array.from(enums[this.__ENUM_HASH__].members);
    }
    Enum.prototype.getNameForValue = function(value) {
        if(!(typeof value === "string" || typeof value === "number"))
            throw `Enums can only have values of type string or type number\nType received: ${typeof value}`;
        return enums[this.__ENUM_HASH__].byValue[value] || null;
    }
    Enum.prototype[Symbol.toStringTag] = "Enum";

    function CallableObject(f) {
        if(!(this instanceof CallableObject)) return new CallableObject(f);
        let apply = function(){
            return f.apply(apply, arguments);
        }
        Object.setPrototypeOf(apply, new.target.prototype);
        apply.call = function(thisArg, ...args) {
            return f.call(thisArg, ...args);
        };
        apply.apply = function(thisArg, argArray) {
            return f.apply(thisArg, argArray);
        };
        apply.bind = function(thisArg, ...args) {
            let obj = new CallableObject(f.bind(thisArg, ...args));
            Object.assign(obj, this);
            return obj;
        };
        return apply;
    }
    CallableObject.prototype = {
        get [Symbol.toStringTag]() {
            return "CallableObject"
        }
    };

    jango.object = {
        hasOwn,
        Tuple,
        Enum,
        CallableObject
    };

//#endregion Objects

//#region Math

    const PI = 3.14159265358979323846;
    const TAU = PI * 2;
    const E = 2.718281828459045;
    function gcd(a, b) {
        if(a < 0) return gcd(-a, b);
        if(b < 0) return gcd(a, -b);
        return b === 0 ? a : gcd(b, a % b);
    }

    function lcm(a, b) {
        return (a * b) / gcd(a, b);
    }

    function factorial(x) {
        if(i < 2)return 1;
        var y = 1;
        for(var i = 2; i <= x; i++) {
            y *= i;
        }
        return y;
    }

    function mean(...data) {
        return data.reduce((x, y) => x + y) / data.length;
    }

    function median(...data) {
        var sorted = data.sort(), len = data.length;
        if(data.length & 1)return sorted[(len - 1) / 2];
        return (sorted[(len / 2) - 1] + sorted[len / 2]) / 2;
    }

    function mode(...data) {
        var cts = {};
        for(var thing of data) {
            cts[thing]++;
        }
        return data.reduce((x, y) => cts[x] > cts[y] ? x : y);
    }

    function frequency(value, ...data) {
        var ct = 0;
        for(var thing of data) {
            if(thing === value){
                ct++;
            }
        }
        return ct / data.length;
    }

    function stdDevDifferenceSum(...data) {
        var sum = 0, avg = mean(data);
        for(var x of data) {
            sum += (x - avg) * (x - avg);
        }
        return sum;
    }

    function stdDevSample(...data) {
        return Math.sqrt(stdDevDifferenceSum(data) / (data.length - 1));
    }

    function stdDevPopulation(...data) {
        return Math.sqrt(stdDevDifferenceSum(data) / data.length);
    }

    function areaRegularPolygon(sideLength, numSides) {
        if(typeof sideLength !== "number" || typeof numSides !== "number")
            throw "areaRegularPolygon must be called with (number, number)";
        if(!Number.isInteger(numSides) || numSides < 3)
            throw "Parameter numSides on areaRegularPolygon must be an integer greater than 2";
        
        // The last return statement would work for any number of sides,
        // but it is quicker and more accurate to write a section for some special cases
        if(numSides === 3) return Math.sqrt(3) * sideLength * sideLength / 4;
        if(numSides === 4) return sideLength * sideLength;
        if(numSides === 8) return 7 * sideLength * sideLength;

        return (numSides * sideLength * sideLength) / (4 * Math.tan(Math.PI / numSides));
    }

    function cubeInfo(sideLength) {
        var faceArea = sideLength * sideLength;
        return {
            volume: faceArea * sideLength,
            surfaceArea: faceArea * 6
        }
    }

    function rectangularPrismInfo(length, width, height) {
        return {
            volume: length * width * height,
            surfaceArea: 2 * ((length * width) + (length * height) + (width * height))
        };
    }

    function coneInfo(baseRadius, height) {
        var baseArea = Math.PI * baseRadius * baseRadius;
        return {
            volume: baseArea * height / 3,
            surfaceArea: baseArea + (Math.PI * baseRadius * Math.sqrt((baseRadius * baseRadius) + (height * height)))
        };
    }

    function pyramid4Info(baseLength, baseWidth, height) {
        function slantLength(adjacentSide) {
            return Math.sqrt((adjacentSide * adjacentSide / 4) + (height * height));
        }
        return {
            volume: baseLength * baseWidth * height / 3,
            surfaceArea: (baseLength * baseWidth) + (baseLength * slantLength(baseWidth)) + (baseWidth * slantLength(baseLength))
        };
    }

    function sphereInfo(radius) {
        var surfaceArea = 4 * Math.PI * radius * radius;
        return {
            volume: surfaceArea * radius / 3,
            surfaceArea
        };
    }

    function cylinderInfo(baseRadius, height) {
        return {
            volume: Math.PI * baseRadius * baseRadius * height,
            surfaceArea: Math.PI * baseRadius * 2 * (baseRadius + height)
        };
    }

    function binomialProbability(successChance, successCount, totalTries) {
        return (factorial(totalTries) * Math.pow(successChance, successCount) * Math.pow(1 - successChance, totalTries - successCount))
            / factorial(successCount) * factorial(totalTries - successCount);
    }

    function probabilityOfHappening(chance, tries) {
        return 1 - Math.pow(1 - chance, tries);
    }

    function isSquare(num) {
        if(num < 0) return false;
        return Number.isInteger(Math.sqrt(num));
    }
    function isFactor(num, potentialFactor) {
        return Number.isInteger(num / potentialFactor);
    }
    function getFactors(num) {
        let factorMap = {}, factors = getFactorList(num);
        for(let i = 0; i < factors.length; i++) {
            factorMap[factors[i]] = factors[factors.length - i - 1];
        }
        return factorMap;
    }
    function getFactorList(num) {
        let factors = [];
        for(let i = 1; i <= num; i++) {
            if(isFactor(num, i)) {
                factors.push(i);
            }
        }
        return factors;
    }

    function csc(num) {
        return 1 / Math.sin(num);
    }
    function sec(num) {
        return 1 / Math.cos(num);
    }
    function cot(num) {
        return 1 / Math.tan(num);
    }
    function acsc(num) {
        return Math.asin(1 / num);
    }
    function asec(num) {
        return Math.acos(1 / num);
    }
    function acot(num) {
        return Math.atan(1 / num);
    }

    function logBase(num, base) {
        return Math.log(num) / Math.log(base);
    }

    function summation(a, min = undefined, max = undefined) {
        if(Array.isArray(a) && typeof min === "undefined" && typeof max === "undefined") {
            return a.reduce(function(x, y){
                return x + y;
            }, 0);
        }
        if(typeof a === "function" && typeof min === "number" && typeof max === "number") {
            let y = 0;
            for(let i = min; i <= max; i++) {
                y += a(i);
            }
            return y;
        }
        throw "Invalid arguments\nSyntax: summation(func: (x: number) => number, min: number, max: number) or \n    summation(numbers: number[])";
    }
    
    function product(a, min = undefined, max = undefined) {
        if(Array.isArray(a) && typeof min === "undefined" && typeof max === "undefined") {
            return a.reduce(function(x, y){
                return x * y;
            }, 1);
        }
        if(typeof a === "function" && typeof min === "number" && typeof max === "number") {
            let y = 1;
            for(let i = min; i <= max; i++) {
                y *= a(i);
            }
            return y;
        }
        throw "Invalid arguments\nSyntax: product(func: (x: number) => number, min: number, max: number) or \n    product(numbers: number[])";
    }

    function exponentToString(exponent, useUnicodeExponents = false) {
        if(typeof exponent !== "number" || !Number.isInteger(exponent))
            throw "exponentToString does not yet support anything other than integer numbers";
        if(!useUnicodeExponents) return "^" + exponent.toString();
        if(exponent > 10) return exponentToString(Math.floor(exponent / 10), true) + exponentToString(exponent % 10);
        switch(exponent) {
            case 1: return "\u00b9";
            case 2: return "\u00b2";
            case 3: return "\u00b3";
            default: return String.fromCodePoint(0x2070 + exponent);
        }
    }

    function variableToString(coefficient, symbol, exponent = undefined, useUnicodeExponents = false) {
        if(typeof coefficient !== "number") throw "variableToString can only take a number for argument coefficient";
        let coefStr = "";
        if(coefficient === -1) {
            coefStr += "-";
        } else if(coefficient !== 1) {
            coefStr += coefficient.toString();
        }
        let expStr = "";
        if(exponent !== undefined) {
            expStr += exponentToString(exponent, useUnicodeExponents);
        }
        return coefStr + symbol + expStr;
    }

    function Point(x, y) {
        if(Point.isPoint(x)) return Point.cast(x);
        if(!(this instanceof Point)) return new Point(x, y);
        if(typeof x !== "number" || typeof y !== "number")
            throw "Point must be constructed from (x: number, y: number) or (pt: [number, number] | {x: number; y: number})";
        this.x = x;
        this.y = y;
    }
    Point.prototype = {
        get [Symbol.toStringTag]() {
            return "Point";
        },
        toString() {
            return "(" + this.x + ", " + this.y + ")";
        }
    };
    Point.isPoint = function(value) {
        if(value instanceof Point) return true;
        if(Array.isArray(value)) {
            return value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
        }
        if(typeof value !== "object" || value === null) return false;
        return typeof value.x === "number" && typeof value.y === "number";
    }
    Point.cast = function(value) {
        if(!Point.isPoint(value)) throw "Unable to cast value to Point";
        return new Point(value.x || value[0], value.y || value[1]);
    }

//#region ComplexNumber
    function ComplexNumber(realOrOtherComplex, imaginary = 0) {
        if(!(this instanceof ComplexNumber)) return new ComplexNumber(realOrOtherComplex, imaginary);
        if(realOrOtherComplex === undefined) {
            this.real = 0;
            this.imaginary = 0;
            return this;
        }
        if(realOrOtherComplex instanceof ComplexNumber) {
            this.real = realOrOtherComplex.real;
            this.imaginary = realOrOtherComplex.imaginary;
            return this;
        }
        const ERROR_BAD_CONSTRUCTOR = "ComplexNumber must be constructed from (), (complex: ComplexNumber), or (real: number, imaginary?: number)";
        if(typeof realOrOtherComplex !== "number" || typeof imaginary !== "number") throw ERROR_BAD_CONSTRUCTOR;
        this.real = realOrOtherComplex;
        this.imaginary = imaginary;
        return this;
    }
    const ERROR_COMPLEXNUM_BADMATH = "Complex number operations can only be done with numbers or other ComplexNumbers";
    Object.defineProperty(ComplexNumber, "IMAGINARY_SYMBOL", {
        value: "𝑖",
        writable: false
    });
    ComplexNumber.strictConversionDefault = true;
    ComplexNumber.prototype = Object.create({});
    ComplexNumber.prototype.copy = function() {
        return new ComplexNumber(this);
    }
    ComplexNumber.prototype.addSelf = function(x) {
        if(x instanceof ComplexNumber) {
            this.real += x.real;
            this.imaginary += x.imaginary;
            return this;
        }
        if(typeof x !== "number") throw ERROR_COMPLEXNUM_BADMATH;
        this.real += x;
        return this;
    };
    ComplexNumber.prototype.addCopy = function(x) {
        let copy = this.copy();
        copy.addSelf(x);
        return copy;
    };
    ComplexNumber.prototype.subtractSelf = function(x) {
        if(x instanceof ComplexNumber) {
            this.real -= x.real;
            this.imaginary -= x.imaginary;
            return this;
        }
        if(typeof x !== "number") throw ERROR_COMPLEXNUM_BADMATH;
        this.real -= x;
        return this;
    };
    ComplexNumber.prototype.subtractCopy = function(x) {
        let copy = this.copy();
        copy.subtractSelf(x);
        return copy;
    };
    ComplexNumber.prototype.multiplySelf = function(x) {
        if(x instanceof ComplexNumber) {
            let r = (this.real * x.real) - (this.imaginary * x.imaginary);
            let i = (this.real * x.imaginary) + (this.imaginary * x.real);
            this.real = r;
            this.imaginary = i;
            return this;
        }
        if(typeof x !== "number") throw ERROR_COMPLEXNUM_BADMATH;
        this.real *= x;
        this.imaginary *= x;
        return this;
    };
    ComplexNumber.prototype.multiplyCopy = function(x) {
        let copy = this.copy();
        copy.multiplySelf(x);
        return copy;
    };
    ComplexNumber.prototype.divideSelf = function(x) {
        if(x instanceof ComplexNumber) {
            let d = (x.real * x.real) + (x.imaginary * x.imaginary);
            let r = (this.real * x.real) + (this.imaginary * x.imaginary);
            let i = (this.imaginary * x.real) - (this.real * x.imaginary);
            this.real = r / d;
            this.imaginary = i / d;
            return this;
        }
        if(typeof x !== "number") throw ERROR_COMPLEXNUM_BADMATH;
        this.real /= x;
        this.imaginary /= x;
        return this;
    };
    ComplexNumber.prototype.divideCopy = function(x) {
        let copy = this.copy();
        copy.divideSelf(x);
        return copy;
    };

    ComplexNumber.prototype.toString = function(useUnicodeCharacters = false) {
        if(this.imaginary === 0) return this.real.toString();
        let imagStr = variableToString(this.imaginary, useUnicodeCharacters ? ComplexNumber.IMAGINARY_SYMBOL : "i");
        if(this.real === 0) return imagStr;
        let str = this.real.toString();
        if(this.imaginary > 0) {
            str += "+";
        }
        return str + imagStr;
    }
    ComplexNumber.prototype.valueOf = function(strict = undefined) {
        if(strict === undefined) {
            strict = ComplexNumber.strictConversionDefault;
        }
        if(strict && this.imaginary !== 0)
            throw "Unable to convert a ComplexNumber with an imaginary value not equal to 0. To ignore the imaginary part when converting to a number, set ComplexNumber.strictConversionDefault to false";
        return this.real;
    }
//#endregion ComplexNumber

    function LinearEquation(slopeOrOther, yIntercept) {
        if(!(this instanceof LinearEquation)) return new LinearEquation(slopeOrOther, yIntercept);
        if(LinearEquation.isLinearEquation(slopeOrOther)) {
            return LinearEquation.cast(slopeOrOther);
        }
        if(yIntercept == null) {
            yIntercept = 0;
        }
        if(typeof slopeOrOther !== "number" || typeof yIntercept !== "number")
            throw "LinearEquation can only be constructed from (slope: number, yIntercept?: number)";

        let func = new CallableObject(function(x) {
            return this.m * x + this.b;
        });
        Object.setPrototypeOf(func, LinearEquation.prototype);
        func.m = slopeOrOther;
        func.b = yIntercept;
        return func;
    }
    LinearEquation.prototype = {
        get [Symbol.toStringTag]() {
            return "LinearEquation";
        },
        get xIntercept() {
            return this.whenEqualTo(0);
        },
        toString() {
            if(this.m === 0) return this.b.toString();
            let str = variableToString(this.m, "x");
            if(this.b > 0) {
                str += "+";
            }
            if(this.b !== 0) {
                str += this.b.toString();
            }
            return str;
        },
        whenEqualTo(yOrOther) {
            if(LinearEquation.isLinearEquation(yOrOther)) {
                let eq = LinearEquation.cast(yOrOther);
                if(this.m === eq.m) return undefined;
                return (eq.b - this.b) / (this.m - eq.m);
            }
            try {
                y = Number(y);
            } catch(error) {
                throw "The target is not a number or LinearEquation";
            }
            if(this.m === 0) return undefined;
            return (y - this.b) / this.m;
        }
    };
    LinearEquation.cast = function(value) {
        return new LinearEquation(value.slope || value.xCoefficient || value.m, value.yIntercept || value.yInter || value.b);
    }
    LinearEquation.isLinearEquation = function(value) {
        if(value instanceof LinearEquation) return true;
        if(value == null) return false;
        try {
            LinearEquation.cast(value);
            return true;
        } catch(_) {
            return false;
        }
    }

    function ParabolicEquation(h, k, a, symAxis) {
        if(!(this instanceof ParabolicEquation)) return new ParabolicEquation(h, k, a, symAxis);
        this.h = h;
        this.k = k;
        this.a = a;
        this.symAxis = symAxis;
    }
    ParabolicEquation.prototype = {
        get [Symbol.toStringTag]() {
            return "ParabolicEquation";
        },
        toString() {
            function s(value, name) {
                let str = this.symAxis === name ? (4*this.a).toString() : "";
                if(value !== 0) {
                    str += "(" + name;
                    if(value < 0) {
                        str += "+";
                    }
                    str += (-value).toString() + ")";
                } else {
                    str += name;
                }
                if(name !== this.symAxis) {
                    str += "\u00b2";
                }
                return str;
            }
            return s.call(this, this.h, "x") + " = " + s.call(this, this.k, "y");
        },
        get vertex() {
            return new Point(this.h, this.k);
        }
    };
    ParabolicEquation.fromVertexAndFocus = function(vertex, focus) {
        vertex = Point.cast(vertex);
        focus = Point.cast(focus);
        let symYAxis = vertex.x === focus.x;
        return new ParabolicEquation(vertex.x, vertex.y, symYAxis ? focus.y - vertex.y : focus.x - vertex.x, symYAxis ? "y" : "x");
    }
    ParabolicEquation.fromVertexAndLatusRectum = function(vertex, latusRectum, symAxis) {
        let vx = Point.cast(vertex).x;
        let vy = Point.cast(vertex).y;
        let lx = Point.cast(latusRectum).x;
        let ly = Point.cast(latusRectum).y;
        if(symAxis === "y") return new ParabolicEquation(vx, vy, (lx - vx)**2 / (4 * (ly - vy)), "y");
        return new ParabolicEquation(vx, vy, (ly - vy)**2 / (4 * (lx - vx)), "x");
    }

//#region Fraction
    function Fraction(numerator, denominator) {
        if(!(this instanceof Fraction)) return new Fraction(numerator, denominator);
        if(Fraction.isFraction(numerator)) return Fraction.copy(numerator);
        if(typeof numerator === "string") return Fraction.parse(numerator);
        if(typeof numerator !== "number")
            throw "Fraction can only be constructed from (numerator, denominator), (fraction), (str), or (number)";
        if(denominator == null) return Fraction.fromNumber(numerator);
        if(typeof denominator !== "number")
            throw "Fraction can only be constructed from (numerator, denominator), (fraction), (str), or (number)";
        this.n = numerator;
        this.d = denominator;
    }
    Fraction.isFraction = function(value) {
        if(value instanceof Fraction) return true;
        if(typeof value !== "object" || value === null) return false;
        return (typeof value.n === "number" || typeof value.numerator === "number") &&
            (typeof value.d === "number" || typeof value.denominator === "number");
    }
    Fraction.copy = function(other) {
        if(!Fraction.isFraction(other)) throw "Value is not a Fraction";
        return new Fraction(
            typeof other.n === "number" ? other.n : other.numerator,
            typeof other.d === "number" ? other.d : other.denominator
        );
    }
    Fraction.fromNumber = function(num) {
        try {
            num = Number(num);
        } catch(_) {
            throw "Fraction.fromNumber can only be called with a number argument";
        }
        if(Number.isInteger(num)) return new Fraction(num, 1);
        let intPart = Math.floor(num);
        let fracPart = num - intPart;
        const PRECISION = 10000000000;
        let gcd_ = gcd(Math.round(fracPart * PRECISION), PRECISION);
        let deno = PRECISION / gcd_;
        return new Fraction((Math.round(fracPart * PRECISION) / gcd_) + (intPart * deno), deno);
    }
    Fraction.parse = function(str) {
        if(typeof str !== "string") throw "Fractions can only be parsed from strings";
        let match = str.match(/(?<n>[\d\.]+)\/(?<d>[\d\.]+)/);
        const ERR_CANT_PARSE = "String could not be parsed to fraction";
        if(match == null || !match.groups || !match.groups.n || !match.groups.d)
            throw ERR_CANT_PARSE;
        let num = Number(match.groups.n) / Number(match.groups.d);
        if(!isFinite(num)) throw ERR_CANT_PARSE;
        return Fraction.fromNumber(num);

        return Fraction.fromNumber(Number(match.groups.n) / Number(match.groups.d));
    }
    Fraction.prototype = {
        get [Symbol.toStringTag]() {
            return "Fraction";
        },
        get numberValue() {
            return this.n / this.d;
        },
        valueOf() {
            return this.n / this.d;
        },
        toString() {
            let str = this.n.toString();
            if(this.d !== 1) {
                str += " / " + this.d.toString();
            }
            return str;
        },
        equivalent(newDeno) {
            try {
                newDeno = Number(newDeno);
            } catch(_) {
                throw "New denominator must be a number";
            }
            return new Fraction(this.n * newDeno / this.d, newDeno);
        },
        get reciprocal() {
            return new Fraction(this.d, this.n);
        },
        equals(otherOrNum) {
            if(Fraction.isFraction(otherOrNum)) {
                let f = new Fraction(otherOrNum);
                return this.n === f.n && this.d === f.d;
            }
            if(typeof otherOrNum === "number") return this.numberValue === otherOrNum;
            throw "Value is not a number or fraction";
        },
        add(x) {
            return Fraction.fromNumber(this.numberValue + new Fraction(x).numberValue);
        }
    };
//#endregion Fraction

    jango.math = {
        PI,
        TAU,
        E,
        gcd,
        lcm,
        factorial,
        mean,
        median,
        mode,
        frequency,
        stdDevSample,
        stdDevPopulation,
        areaRegularPolygon,
        cubeInfo,
        rectangularPrismInfo,
        coneInfo,
        pyramid4Info,
        sphereInfo,
        cylinderInfo,
        binomialProbability,
        probabilityOfHappening,
        isSquare,
        isFactor,
        getFactors,
        getFactorList,
        csc,
        sec,
        cot,
        acsc,
        asec,
        acot,
        logBase,
        summation,
        product,
        exponentToString,
        variableToString,
        ComplexNumber,
        LinearEquation,
        Point,
        ParabolicEquation,
        Fraction
    };

//#endregion Math

//#region String

    const LATIN_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const LATIN_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    const DIGITS = "0123456789";

    function toCharSet(str, a, keepUnmappedChars = true) {
        switch(typeof a) {
            case "function": {
                let ret = "";
                for(let i = 0; i < str.length; i++) {
                    ret += a(str[i]);
                }
                return ret;
            }
            case "object": {
                return toCharSet(str, function(char) {
                    if(Object.prototype.hasOwnProperty.call(a, char)) return a[char];
                    return keepUnmappedChars ? char : "";
                });
            }
            case "string": {
                switch(a) {
                    case "OLD_ENGLISH": {
                        return toCharSet(str, function(char) {
                            var code = char.codePointAt(0);
                            if(code > 0x40 && code < 0x5b)return String.fromCodePoint(0x1d52b + code);
                            if(code > 0x60 && code < 0x7b)return String.fromCodePoint(0x1d525 + code);
                            return char;
                        });
                    }
                    case "DOUBLESTRUCK": {
                        return toCharSet(str, function(char) {
                            if(!isAlphanumeric(char)) return char;
                            var code = char.codePointAt(0);
                            if(isNumeric(char)) {
                                return String.fromCodePoint(0x1d7a8 + code);
                            }
                            if(isLowerCase(char)) {
                                return String.fromCodePoint(code + 0x1d4f1);
                            }
                            switch (char) {
                                case "C": return "\u2102";
                                case "H": return "\u210d";
                                case "N": return "\u2115";
                                case "P": return "\u2119";
                                case "Q": return "\u211a";
                                case "R": return "\u211d";
                                case "Z": return "\u2124";
                                default: return String.fromCodePoint(code + 0x1d4f7);
                            }
                        });
                    }
                    case "GALACTIC": {
                        return toCharSet(str.toLowerCase(), {
                            a: "\u1511",
                            b: "\u0296",
                            c: "\u14f5",
                            d: "\u21b8",
                            e: "\ua6da",
                            f: "𝌂", // 0x1d302
                            g: "\u02e7",
                            h: "\u3012",
                            i: "\u00a6",
                            j: "\u22ee",
                            k: "\ua58c",
                            l: "\ua58e",
                            m: "\u14b2",
                            n: "\u30bd",
                            o: "\u30d5",
                            p: "\u00a1!",
                            q: "\u1451",
                            r: "\u2237",
                            s: "\u14ed",
                            t: "𐔕", // 0x10515
                            u: "\u268d",
                            v: "\u3027",
                            w: "\u2234",
                            x: "\u0307/",
                            y: "\u2016",
                            z: "\u22c2"
                        })
                    }
                }
            }
        }
    }

    function strAll(str, predicate) {
        for(let i = 0; i < str.length; i++) {
            if(!predicate(str[i])) return false;
        }
        return true;
    }

    function isLowerCase(str) {
        return strAll(str, function(char) {
            let codePoint = char.codePointAt(0);
            return codePoint < 0x41 || codePoint > 0x5a;
        });
    }

    function isUpperCase(str) {
        return strAll(str, function(char) {
            let codePoint = char.codePointAt(0);
            return codePoint < 0x61 || codePoint > 0x7a;
        });
    }

    function isAlpha(str) {
        return strAll(str, function(char) {
            let codePoint = char.codePointAt(0);
            return (codePoint > 0x40 && codePoint < 0x5b) || (codePoint > 0x60 && codePoint < 0x7b);
        });
    }

    function isNumeric(str) {
        return strAll(str, function(char) {
            let codePoint = char.codePointAt(0);
            return codePoint > 0x2f && codePoint < 0x3a;
        });
    }

    function isAlphanumeric(str) {
        return strAll(str, function(char) {
            let codePoint = char.codePointAt(0);
            return (codePoint > 0x40 && codePoint < 0x5b) || (codePoint > 0x60 && codePoint < 0x7b) || (codePoint > 0x2f && codePoint < 0x3a);
        });
    }

    /**
     * Converts a country code into a flag.
     * 
     * Doesn't render on Windows.
     * @example toFlagChar("PL") === "🇵🇱"
     * @param {string} str 
     * @returns {string} The desired flag (or a tiny version of the inputted string on Windows).
     */
    function toFlagChar(str) {
        if(typeof str !== "string") {
            let err = new TypeError("toFlagChar called with non-string argument");
            err.typeExpected = "string";
            err.typeReceived = typeof str;
            err.toString = function() {
                return `TypeError: toFlagChar called with non-string argument
                    typeExpected: "string"\n    typeReceived: "${typeof str}"`;
            }
            throw err;
        }
        let errMsg = "toFlagChar expects a string consisting of 2 ASCII Latin letters";
        if(str.length !== 2) throw new RangeError(`${errMsg}. Length of str: ${str.length}`);
        function convertChar(c) {
            c = c.toUpperCase();
            let cp = c.codePointAt(0);
            if(cp < 0x41 || c > 0x5a) throw new RangeError(`${errMsg}. Inputted char: ${c} (0x${cp.toString(16)})`);
            return String.fromCodePoint(0x1f1a5 + cp);
        }
        return convertChar(str[0]) + convertChar(str[1]);
    }

    function isValidUTF8CodePoint(x) {
        if(typeof x === "bigint") return x > -1n && x < 0x110000n;
        if(!Number.isInteger(x)) return false;
        return x > -1 && x < 0x110000;
    }
    function isCodePointUTF16HighSurrogate(cp) {
        return isValidUTF8CodePoint(cp) && (cp > 0xd7ff && cp < 0xdc00);
    }
    function isCodePointUTF16LowSurrogate(cp) {
        return isValidUTF8CodePoint(cp) && (cp > 0xdbff && cp < 0xe000);
    }
    function isCodePointUTF16Surrogate(cp) {
        return isValidUTF8CodePoint(cp) && (cp > 0xd7ff && cp < 0xe000);
    }
    function codepointToUTF16Pair(codePoint) {
        if(!isValidUTF8CodePoint(codePoint)) throw "Parameter codePoint on codepointToUTF16Pair must be a valid Unicode codepoint";
        if(codePoint < 0x10000) return codePoint;
        codePoint -= 0x10000;
        return [0xd800 + (codePoint >> 10), 0xdc00 + (codePoint & 0x3ff)];
    }
    function utf16PairToCodepoint(hi, lo) {
        if(!isCodePointUTF16HighSurrogate(hi)) throw "Parameter hi on utf16PairToCodepoint must be a valid UTF-16 high surrogate";
        if(!isCodePointUTF16LowSurrogate(lo)) throw "Parameter lo on utf16PairToCodepoint must be a valid UTF-16 low surrogate";
        return (((hi - 0xd800) << 10) | (lo - 0xdc00)) + 0x10000;
    }
    function getUTF8ByteCountForCodepoint(cp) {
        if(!isValidUTF8CodePoint(cp))
            throw "getUTF8CodepointByteCount can only be called with an argument of a valid Unicode codepoint";

        return 1 + (cp > 0x7f) + (cp > 0x7ff) + (cp > 0xffff);
    }
    function getUTF16ByteCountForCodepoint(cp) {
        if(!isValidUTF8CodePoint(cp))
            throw "getUTF8CodepointByteCount can only be called with an argument of a valid Unicode codepoint";

        return 1 + (cp > 0xffff);
    }
    function codepointToUTF8Bytes(codepoint) {
        if(!isValidUTF8CodePoint(codepoint) || typeof codepoint !== "number")
            throw "parameter codepoint on codepointToUTF8Bytes must be a valid Unicode codepoint.";
        let byteCt = getUTF8ByteCountForCodepoint(codepoint);
        if(byteCt === 1) return [codepoint];
        let bytes = [((16 - (1 << (4 - byteCt))) << 4) | (codepoint >> ((byteCt - 1) * 6))];
        for(let i = byteCt - 2; i > -1; i--) {
            bytes.push(0x80 | ((codepoint >> (i * 6)) & 63));
        }
        return bytes;
    }
    function getCodepoints(str) {
        if(typeof str !== "string") throw "getCodepoints can only be called with an argument of type string";
        let cps = [];
        for(let x of str) {
            cps.push(x.codePointAt(0));
        }
        return cps;
    }
    function getCharCodes(str) {
        if(typeof str !== "string") throw "getCharCodes can only be called with an argument of type string";
        let codes = [];
        for(let i = 0; str[i]; i++) {
            codes.push(str.charCodeAt(i));
        }
        return codes;
    }
    function getUTF8Bytes(str) {
        let bytes = [];
        for(let cp of getCodepoints(str)) {
            bytes.push.apply(bytes, codepointToUTF8Bytes(cp));
        }
        return bytes;
    }
    function getUTF16Bytes(str) {
        if(typeof str !== "string") throw "getUTF16Bytes can only be called with an argument of type string";
        let bytes = [];
        for(let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            bytes.push(c >> 8);
            bytes.push(c & 0xff);
        }
        return bytes;
    }

    jango.string = {
        LATIN_UPPERCASE,
        LATIN_LOWERCASE,
        DIGITS,
        toCharSet,
        isLowerCase,
        isUpperCase,
        isAlpha,
        isNumeric,
        isAlphanumeric,
        toFlagChar,
        isValidUTF8CodePoint,
        codepointToUTF16Pair,
        utf16PairToCodepoint,
        getCodepoints,
        getCharCodes,
        getUTF8Bytes,
        getUTF16Bytes
    };

//#endregion String

//#region Engineering

    function convertTemp(tempIn, typeIn, typeOut) {
        if(typeIn == typeOut)return tempIn;
        if(typeOut == "KELVIN")return convertTemp(tempIn, typeIn, "CELCIUS") + 273;
        if(typeOut == "RANKIN")return convertTemp(tempIn, typeIn, "FAHRENHEIT") + 460;

        if(typeIn == "KELVIN")return convertTemp(tempIn - 273, "CELCIUS", typeOut);
        if(typeIn == "RANKIN")return convertTemp(tempIn - 460, "FAHRENHEIT", typeOut);
        switch (typeOut) {
            case "CELCIUS": return (tempIn - 32) / 1.8;
            case "FAHRENHEIT": return (tempIn * 1.8) + 32;
        }
    }

    function conversionFunction(conversionTable) {
        return function(value, typeIn, typeOut) {
            return value * conversionTable[typeOut] / conversionTable[typeIn];
        };
    }

    const PressureUnit = {
        ATMOSPHERES: 1,
        BAR: 1.01325,
        FEET_H2O: 33.9,
        IN_MERCURY: 29.92,
        MM_MERCURY: 760,
        PASCALS: 101.325,
        PSI: 14.7
    };

    const __convPressure = conversionFunction(PressureUnit);

    function convertPressure(value, typeIn, typeOut) {
        return __convPressure(value, typeIn, typeOut);
    }

    jango.engineering = {
        PressureUnit,
        convertTemp,
        convertPressure
    };

//#endregion Engineering

//#region Minecraft

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

    jango.minecraft = {
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
    };

//#endregion Minecraft

    function ArrayReader(array) {
        if(!(this instanceof ArrayReader)) return new ArrayReader(array);
        if(!Array.isArray(array)) throw new TypeError(this[Symbol.toStringTag] + " must be constructed from an array");
        this.data = Array.from(array);
        this.type = (new.target || this.constructor).name;
        this.index = 0;
    }
    ArrayReader.prototype = {
        get length() {
            return this.data.length;
        },
        get done() {
            return this.index >= this.length;
        },
        get [Symbol.toStringTag]() {
            return this.type;
        },
        *[Symbol.iterator]() {
            for(; !this.done; this.index++) {
                yield this.data[this.index];
            }
        },
        read(count = 1) {
            if (!Number.isInteger(count) || count < 1)
                throw "Argument count on ArrayReader.prototype.read should be a positive integer";
            if (this.done) return undefined;
            let chunk = [];
            for (let i = 0; i < count; i++) {
                chunk.push(this.data[this.index + i]);
                this.index++;
            }
            return chunk;
        }
    }
    jango.ArrayReader = ArrayReader;

    if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = Object.freeze(jango);
    }
    window.jango = window.jango || Object.freeze(jango);
})(this || window || self || globalThis);