(function(window){
    const PI = 3.14159265358979323846;
    const TAU = PI * 2;
    const E = 2.718281828459045;
    /**
     * 
     * @param {number} a 
     * @param {number} b 
     * @returns {number} The largest common factor of ```a``` and ```b```
     */
    function gcd(a, b) {
        if(a < 0) return gcd(-a, b);
        if(b < 0) return gcd(a, -b);
        return b === 0 ? a : gcd(b, a % b);
    }

    function lcm(a, b) {
        return (a * b) / gcd(a, b);
    }

    function makeFraction(floatNumber) {
        let intPart = Math.floor(floatNumber);
        let fracPart = floatNumber - intPart;
        const PRECISION = 10000000000;
        let gcd_ = gcd(Math.round(fracPart * PRECISION), PRECISION);
        let deno = PRECISION / gcd_;
        return {
            numerator: (Math.round(fracPart * PRECISION) / gcd_) + (intPart * deno),
            denominator: deno
        }
    }

    /**
     * 
     * @param {number} x 
     * @returns {number}
     */
    function factorial(x) {
        if(i < 2)return 1;
        var y = 1;
        for(var i = 2; i <= x; i++) {
            y *= i;
        }
        return y;
    }

    /**
     * 
     * @param  {...number} data 
     * @returns {number}
     */
    function mean(...data) {
        return data.reduce((x, y) => x + y) / data.length;
    }

    /**
     * 
     * @param  {...number} data 
     * @returns {number}
     */
    function median(...data) {
        var sorted = data.sort(), len = data.length;
        if(data.length & 1)return sorted[(len - 1) / 2];
        return (sorted[(len / 2) - 1] + sorted[len / 2]) / 2;
    }

    /**
     * 
     * @param  {...any} data 
     * @returns {any}
     */
    function mode(...data) {
        var cts = {};
        for(var thing of data) {
            cts[thing]++;
        }
        return data.reduce((x, y) => cts[x] > cts[y] ? x : y);
    }

    /**
     * 
     * @param {any} value 
     * @param  {...any} data 
     * @returns {number}
     */
    function frequency(value, ...data) {
        var ct = 0;
        for(var thing of data) {
            if(thing === value){
                ct++;
            }
        }
        return ct / data.length;
    }

    /**
     * 
     * @param  {...number} data 
     * @returns {number}
     */
    function stdDevDifferenceSum(...data) {
        var sum = 0, avg = mean(data);
        for(var x of data) {
            sum += (x - avg) * (x - avg);
        }
        return sum;
    }

    /**
     * 
     * @param  {...number} data 
     * @returns {number}
     */
    function stdDevSample(...data) {
        return Math.sqrt(stdDevDifferenceSum(data) / (data.length - 1));
    }

    /**
     * 
     * @param  {...number} data 
     * @returns {number}
     */
    function stdDevPopulation(...data) {
        return Math.sqrt(stdDevDifferenceSum(data) / data.length);
    }

    /**
     * 
     * @param {number} sideLength 
     * @param {number} numSides 
     * @returns {number}
     */
    function areaRegularPolygon(sideLength, numSides) {
        return (numSides * sideLength * sideLength) / (4 * Math.tan(Math.PI / numSides));
    }

    /**
     * 
     * @param {number} sideLength 
     * @returns {{volume: number; surfaceArea: number;}}
     */
    function cubeInfo(sideLength) {
        var faceArea = sideLength * sideLength;
        return {
            volume: faceArea * sideLength,
            surfaceArea: faceArea * 6
        }
    }

    /**
     * 
     * @param {number} width 
     * @param {number} length 
     * @param {number} height 
     * 
     * @returns {{volume: number; surfaceArea: number;}}
     */
    function rectangularPrismInfo(length, width, height) {
        return {
            volume: length * width * height,
            surfaceArea: 2 * ((length * width) + (length * height) + (width * height))
        };
    }

    /**
     * 
     * @param {number} baseRadius 
     * @param {number} height 
     * 
     * @returns {{volume: number; surfaceArea: number;}}
     */
    function coneInfo(baseRadius, height) {
        var baseArea = Math.PI * baseRadius * baseRadius;
        return {
            volume: baseArea * height / 3,
            surfaceArea: baseArea + (Math.PI * baseRadius * Math.sqrt((baseRadius * baseRadius) + (height * height)))
        };
    }

    /**
     * 
     * @param {number} baseLength 
     * @param {number} baseWidth 
     * @param {number} height
     * 
     * @returns {{volume: number; surfaceArea: number;}} 
     */
    function pyramid4Info(baseLength, baseWidth, height) {
        function slantLength(adjacentSide) {
            return Math.sqrt((adjacentSide * adjacentSide / 4) + (height * height));
        }
        return {
            volume: baseLength * baseWidth * height / 3,
            surfaceArea: (baseLength * baseWidth) + (baseLength * slantLength(baseWidth)) + (baseWidth * slantLength(baseLength))
        };
    }

    /**
     * 
     * @param {number} radius
     * @returns {{volume: number; surfaceArea: number;}} 
     */
    function sphereInfo(radius) {
        var surfaceArea = 4 * Math.PI * radius * radius;
        return {
            volume: surfaceArea * radius / 3,
            surfaceArea
        };
    }

    /**
     * 
     * @param {number} baseRadius 
     * @param {number} height
     * 
     * @returns {{volume: number; surfaceArea: number;}} 
     */
    function cylinderInfo(baseRadius, height) {
        return {
            volume: Math.PI * baseRadius * baseRadius * height,
            surfaceArea: Math.PI * baseRadius * 2 * (baseRadius + height)
        };
    }

    /**
     * 
     * @param {number} successChance 
     * @param {number} successCount 
     * @param {number} totalTries 
     * 
     * @returns {number}
     */
    function binomialProbability(successChance, successCount, totalTries) {
        return (factorial(totalTries) * Math.pow(successChance, successCount) * Math.pow(1 - successChance, totalTries - successCount))
            / factorial(successCount) * factorial(totalTries - successCount);
    }

    function probabilityOfHappening(chance, tries) {
        return 1 - Math.pow(1 - chance, tries);
    }

    function isInt(num) {
        return num === (Math.floor(num));
    }
    function isSquare(num) {
        if(num < 0) return false;
        return isInt(Math.sqrt(num));
    }
    function isFactor(num, potentialFactor) {
        return isInt(num / potentialFactor);
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

    /**
     * 
     * @param {number[] | (x: number) => number} a 
     * @param {number | undefined} min 
     * @param {number | undefined} max 
     * @returns 
     */
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
    /**
     * 
     * @param {number[] | (x: number) => number} a 
     * @param {number | undefined} min 
     * @param {number | undefined} max 
     * @returns 
     */
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

    const EXPORTS = Object.freeze({
        PI,
        TAU,
        E,
        gcd,
        lcm,
        makeFraction,
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
        isInt,
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
        ComplexNumber
    });

    window["∞"] = Infinity;
    window["√"] = function(num) {
        if(typeof num !== "number") return num;
        let root = Math.sqrt(Math.abs(num));
        if(num >= 0) return root;
        return ComplexNumber(0, root);
    }

    if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = EXPORTS;
    } else {
        window.jango = window.jango || {};
        window.jango.math = EXPORTS;
    }
})(this);