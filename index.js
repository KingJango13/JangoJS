"use strict";
var jango;
(function (jango) {
    let objects;
    (function (objects) {
        function hasOwn(obj, property) {
            return Object.prototype.hasOwnProperty.call(obj, property);
        }
        objects.hasOwn = hasOwn;
        class Tuple {
            length;
            constructor(args) {
                if (args instanceof Tuple || Array.isArray(args)) {
                    this.length = args.length;
                    for (let i = 0; i < args.length; i++) {
                        this[i] = args[i];
                    }
                }
                else {
                    this.length = arguments.length;
                    for (let i = 0; i < arguments.length; i++) {
                        this[i] = arguments[i];
                    }
                }
                return Object.preventExtensions(this);
            }
            *[Symbol.iterator]() {
                for (let i = 0; i < this.length; i++) {
                    yield this[i];
                }
            }
            toString() {
                if (this.length === 0)
                    return "";
                let str = "" + this[0];
                for (let i = 1; i < this.length; i++) {
                    str += "," + this[i];
                }
                return str;
            }
            [Symbol.toStringTag] = "Tuple";
        }
        objects.Tuple = Tuple;
        class Enum {
            static byHash = {};
            hash;
            constructor(obj) {
                this.hash = "DEADBEEF";
                while (this.hash in Enum.byHash) {
                    this.hash = Math.floor(Math.random() * 0x100000000).toString(16) + Math.floor(Math.random() * 0x100000000).toString(16);
                }
                for (let property in obj) {
                    if (!hasOwn(obj, property))
                        continue;
                    let val = obj[property];
                    if (!(typeof val === "string" || typeof val === "number"))
                        continue;
                    this[property] = val;
                }
                Enum.byHash[this.hash] = Object.freeze(this);
                return Enum.byHash[this.hash];
            }
            *[Symbol.iterator]() {
                for (let property in this) {
                    if (hasOwn(this, property)) {
                        yield property;
                    }
                }
            }
            members() {
                return Array.from(this);
            }
            getNameForValue(val) {
                for (let member of this) {
                    if (this[member] === val)
                        return member;
                }
                return null;
            }
            [Symbol.toStringTag] = "Enum";
        }
        objects.Enum = Enum;
        class CallableObject {
            func;
            constructor(a) {
                if (a instanceof CallableObject) {
                    this.func = a.func;
                    Object.assign(this, a);
                    return this;
                }
                this.func = a;
                return new Proxy(this, {
                    apply(target, thisArg, argArray) {
                        return target.func.call(thisArg, argArray);
                    },
                });
            }
            call(thisArg, ...args) {
                return this.func.call(thisArg, args);
            }
            apply(thisArg, args) {
                return this.func.apply(thisArg, [args]);
            }
            bind(thisArg, args) {
                return new CallableObject(this.func.bind(thisArg, args));
            }
            get [Symbol.toStringTag]() {
                return "CallableObject";
            }
        }
        objects.CallableObject = CallableObject;
        function areSamePrototype(obj1, obj2) {
            return (obj1 instanceof Object.getPrototypeOf(obj2)) && (obj2 instanceof Object.getPrototypeOf(obj1));
        }
        objects.areSamePrototype = areSamePrototype;
        function objectEquals(obj1, obj2) {
            if (obj1 === obj2)
                return true;
            if (obj1.equals && typeof obj1.equals === "function")
                return !!obj1.equals(obj2);
            if (obj2.equals && typeof obj2.equals === "function")
                return !!obj2.equals(obj1);
            if (!areSamePrototype(obj1, obj2))
                return false;
            for (let property in obj1) {
                if (!hasOwn(obj1, property))
                    continue;
                if (!hasOwn(obj2, property))
                    return false;
                if (!objectEquals(obj1[property], obj2[property]))
                    return false;
            }
            return true;
        }
        objects.objectEquals = objectEquals;
        class Stack {
            #head;
            #size;
            constructor(...items) {
                this.#head = null;
                this.#size = 0;
                this.push(...items);
            }
            get isEmpty() {
                return this.#size < 1;
            }
            get size() {
                return this.#size;
            }
            push(...items) {
                for (let item of items) {
                    this.#head = { item, next: this.#head };
                    this.#size++;
                }
                return this.#size;
            }
            pop() {
                if (this.isEmpty)
                    return null;
                let ret = this.#head?.item;
                this.#size--;
                return ret;
            }
            peek() {
                return this.isEmpty ? null : this.#head?.item;
            }
            clear() {
                this.#head = null;
                this.#size = 0;
            }
            *[Symbol.iterator]() {
                while (this.#size > 0) {
                    yield this.pop();
                }
            }
            toArray() {
                let items = [];
                let current = this.#head;
                while (current != null) {
                    items.push(current.item);
                    current = current.next;
                }
                return items.reverse();
            }
            copy() {
                return new Stack(...this.toArray());
            }
            toString() {
                return "Stack{" + this.toArray().toString() + "}";
            }
            [Symbol.toStringTag] = "Stack";
        }
        objects.Stack = Stack;
        class Counter {
            #internal;
            constructor(initialData) {
                this.#internal = {};
                if (Array.isArray(initialData)) { }
                else if (typeof initialData === "object") {
                    Object.assign(this.#internal, initialData);
                }
                return new Proxy(this, {
                    get(target, p, receiver) {
                        if (typeof p === "string" && !["add", "subtract", "max", "min", "maxAbs", "minAbs"].includes(p)) {
                            if (typeof target.#internal[p] !== "number")
                                return 0;
                            return target.#internal[p];
                        }
                        return Reflect.get(target, p, receiver);
                    },
                });
            }
            add(key, amount = 1) {
                key = key.toString();
                if (hasOwn(this.#internal, key)) {
                    this.#internal[key] += amount;
                }
                else {
                    this.#internal[key] = amount;
                }
                return this.#internal[key];
            }
            subtract(key, amount = 1) {
                return this.add(key, -amount);
            }
            *[Symbol.iterator]() {
                for (let prop in this) {
                    if (hasOwn(this, prop)) {
                        yield { key: prop, count: this[prop] };
                    }
                }
            }
            #filter(predicate) {
                let ret = [];
                for (let { key, count } of this) {
                    if (predicate(key, count)) {
                        ret.push(key);
                    }
                }
                return ret;
            }
            #reduce(reducer, initialValue = { key: "", count: 0 }) {
                let ret = initialValue;
                for (let entry of this) {
                    ret = reducer(ret, entry);
                }
                return ret.key;
            }
            get max() {
                return this.#reduce((x, y) => x.count > y.count ? x : y);
            }
            get min() {
                return this.#reduce((x, y) => x.count < y.count ? x : y);
            }
            get maxAbs() {
                return this.#reduce((x, y) => Math.abs(x.count) > Math.abs(y.count) ? x : y);
            }
            get minAbs() {
                return this.#reduce((x, y) => Math.abs(x.count) < Math.abs(y.count) ? x : y);
            }
            [Symbol.toStringTag] = "Counter";
        }
        objects.Counter = Counter;
        function mapObject(object, mapFunc) {
            let ret = object.copy();
            for (let property in object) {
                if (hasOwn(object, property)) {
                    ret[property] = mapFunc(property, object[property], object);
                }
            }
            return ret;
        }
        objects.mapObject = mapObject;
    })(objects = jango.objects || (jango.objects = {}));
    let math;
    (function (math) {
        math.PI = 3.14159265358979323846;
        math.TAU = math.PI * 2;
        math.E = 2.718281828459045;
        math.FLOAT32_MIN = -3.4e38;
        math.FLOAT32_MAX = 3.4e38;
        function gcd(a, b) {
            if (a < 0)
                return gcd(-a, b);
            if (b < 0)
                return gcd(a, -b);
            return b === 0 ? a : gcd(b, a % b);
        }
        math.gcd = gcd;
        function lcm(a, b) {
            return (a * b) / gcd(a, b);
        }
        math.lcm = lcm;
        function factorial(x) {
            if (x < 2)
                return 1;
            var y = 1;
            for (var i = 2; i <= x; i++) {
                y *= i;
            }
            return y;
        }
        math.factorial = factorial;
        function mean(...data) {
            return data.reduce((x, y) => x + y) / data.length;
        }
        math.mean = mean;
        function median(...data) {
            var sorted = data.sort(), len = data.length;
            if (data.length & 1)
                return sorted[(len - 1) / 2];
            return (sorted[(len / 2) - 1] + sorted[len / 2]) / 2;
        }
        math.median = median;
        function mode(...data) {
            let cts = new objects.Counter();
            for (let num of data) {
                cts.add(num);
            }
            return parseFloat(cts.max);
        }
        math.mode = mode;
        function frequency(value, ...data) {
            var ct = 0;
            for (var thing of data) {
                if (thing === value) {
                    ct++;
                }
            }
            return ct / data.length;
        }
        math.frequency = frequency;
        function stdDevDifferenceSum(...data) {
            var sum = 0, avg = mean(...data);
            for (var x of data) {
                sum += (x - avg) * (x - avg);
            }
            return sum;
        }
        math.stdDevDifferenceSum = stdDevDifferenceSum;
        function stdDevSample(...data) {
            return Math.sqrt(stdDevDifferenceSum(...data) / (data.length - 1));
        }
        math.stdDevSample = stdDevSample;
        function stdDevPopulation(...data) {
            return Math.sqrt(stdDevDifferenceSum(...data) / data.length);
        }
        math.stdDevPopulation = stdDevPopulation;
        function areaRegularPolygon(sideLength, numSides) {
            if (typeof sideLength !== "number" || typeof numSides !== "number")
                throw "areaRegularPolygon must be called with (number, number)";
            if (!Number.isInteger(numSides) || numSides < 3)
                throw "Parameter numSides on areaRegularPolygon must be an integer greater than 2";
            // The last return statement would work for any number of sides,
            // but it is quicker and more accurate to write a section for some special cases
            if (numSides === 3)
                return Math.sqrt(3) * sideLength * sideLength / 4;
            if (numSides === 4)
                return sideLength * sideLength;
            return (numSides * sideLength * sideLength) / (4 * Math.tan(Math.PI / numSides));
        }
        math.areaRegularPolygon = areaRegularPolygon;
        function cubeInfo(sideLength) {
            var faceArea = sideLength * sideLength;
            return {
                volume: faceArea * sideLength,
                surfaceArea: faceArea * 6
            };
        }
        math.cubeInfo = cubeInfo;
        function rectangularPrismInfo(length, width, height) {
            return {
                volume: length * width * height,
                surfaceArea: 2 * ((length * width) + (length * height) + (width * height))
            };
        }
        math.rectangularPrismInfo = rectangularPrismInfo;
        function coneInfo(baseRadius, height) {
            var baseArea = Math.PI * baseRadius * baseRadius;
            return {
                volume: baseArea * height / 3,
                surfaceArea: baseArea + (Math.PI * baseRadius * Math.sqrt((baseRadius * baseRadius) + (height * height)))
            };
        }
        math.coneInfo = coneInfo;
        function pyramid4Info(baseLength, baseWidth, height) {
            function slantLength(adjacentSide) {
                return Math.sqrt((adjacentSide * adjacentSide / 4) + (height * height));
            }
            return {
                volume: baseLength * baseWidth * height / 3,
                surfaceArea: (baseLength * baseWidth) + (baseLength * slantLength(baseWidth)) + (baseWidth * slantLength(baseLength))
            };
        }
        math.pyramid4Info = pyramid4Info;
        function sphereInfo(radius) {
            var surfaceArea = 4 * Math.PI * radius * radius;
            return {
                volume: surfaceArea * radius / 3,
                surfaceArea
            };
        }
        math.sphereInfo = sphereInfo;
        function cylinderInfo(baseRadius, height) {
            return {
                volume: Math.PI * baseRadius * baseRadius * height,
                surfaceArea: Math.PI * baseRadius * 2 * (baseRadius + height)
            };
        }
        math.cylinderInfo = cylinderInfo;
        function binomialProbability(successChance, successCount, totalTries) {
            return (factorial(totalTries) * Math.pow(successChance, successCount) * Math.pow(1 - successChance, totalTries - successCount))
                / factorial(successCount) * factorial(totalTries - successCount);
        }
        math.binomialProbability = binomialProbability;
        function probabilityOfHappening(chance, tries) {
            return 1 - Math.pow(1 - chance, tries);
        }
        math.probabilityOfHappening = probabilityOfHappening;
        function isSquare(num) {
            if (num < 0)
                return false;
            return Number.isInteger(Math.sqrt(num));
        }
        math.isSquare = isSquare;
        function isFactor(num, potentialFactor) {
            return Number.isInteger(num / potentialFactor);
        }
        math.isFactor = isFactor;
        function getFactors(num) {
            let factorMap = {}, factors = getFactorList(num);
            for (let i = 0; i < factors.length; i++) {
                factorMap[factors[i]] = factors[factors.length - i - 1];
            }
            return factorMap;
        }
        math.getFactors = getFactors;
        function getFactorList(num) {
            let factors = [];
            for (let i = 1; i <= num; i++) {
                if (isFactor(num, i)) {
                    factors.push(i);
                }
            }
            return factors;
        }
        math.getFactorList = getFactorList;
        function csc(num) {
            return 1 / Math.sin(num);
        }
        math.csc = csc;
        function sec(num) {
            return 1 / Math.cos(num);
        }
        math.sec = sec;
        function cot(num) {
            return 1 / Math.tan(num);
        }
        math.cot = cot;
        function acsc(num) {
            return Math.asin(1 / num);
        }
        math.acsc = acsc;
        function asec(num) {
            return Math.acos(1 / num);
        }
        math.asec = asec;
        function acot(num) {
            return Math.atan(1 / num);
        }
        math.acot = acot;
        function logBase(num, base) {
            return Math.log(num) / Math.log(base);
        }
        math.logBase = logBase;
        function summation(a, min, max) {
            if (Array.isArray(a)) {
                return a.reduce(function (x, y) {
                    return x + y;
                }, 0);
            }
            if (typeof a === "function" && typeof min === "number" && typeof max === "number") {
                let y = 0;
                for (let i = min; i <= max; i++) {
                    y += a(i);
                }
                return y;
            }
            throw "Invalid arguments\nSyntax: summation(func: (x: number) => number, min: number, max: number) or \n    summation(numbers: number[])";
        }
        math.summation = summation;
        function product(a, min, max) {
            if (Array.isArray(a)) {
                return a.reduce(function (x, y) {
                    return x * y;
                }, 1);
            }
            if (typeof a === "function" && typeof min === "number" && typeof max === "number") {
                let y = 1;
                for (let i = min; i <= max; i++) {
                    y *= a(i);
                }
                return y;
            }
            throw "Invalid arguments\nSyntax: product(func: (x: number) => number, min: number, max: number) or \n    product(numbers: number[])";
        }
        math.product = product;
        function exponentToString(exponent, useUnicodeExponents = false) {
            if (typeof exponent !== "number" || !Number.isInteger(exponent))
                throw "exponentToString does not yet support anything other than integer numbers";
            if (!useUnicodeExponents)
                return "^" + exponent.toString();
            if (exponent > 10)
                return exponentToString(Math.floor(exponent / 10), true) + exponentToString(exponent % 10);
            switch (exponent) {
                case 1: return "\u00b9";
                case 2: return "\u00b2";
                case 3: return "\u00b3";
                default: return String.fromCodePoint(0x2070 + exponent);
            }
        }
        math.exponentToString = exponentToString;
        function variableToString(coefficient, symbol, exponent, useUnicodeExponents) {
            if (typeof coefficient !== "number")
                throw "variableToString can only take a number for argument coefficient";
            let coefStr = "";
            if (coefficient === -1) {
                coefStr += "-";
            }
            else if (coefficient !== 1) {
                coefStr += coefficient.toString();
            }
            let expStr = "";
            if (exponent !== undefined) {
                expStr += exponentToString(exponent, useUnicodeExponents);
            }
            return coefStr + symbol + expStr;
        }
        math.variableToString = variableToString;
        class PointND {
            #size;
            constructor(...data) {
                this.#size = data.length;
                for (let i = 0; i < data.length; i++) {
                    this[i] = data[i];
                }
            }
            distanceTo(other) {
                if (other.#size !== this.#size)
                    throw "Distance cannot be calculated for points with different dimensions";
                let dSquared = 0;
                for (let i = 0; i < this.#size; i++) {
                    let d = this[i] - other[i];
                    dSquared += d * d;
                }
                return Math.sqrt(dSquared);
            }
            toString() {
                if (typeof this[0] !== "number")
                    return "()";
                let ret = "(" + this[0];
                for (let i = 1; i < this.#size; i++) {
                    ret += ", " + this[i];
                }
                return ret + ")";
            }
            [Symbol.toStringTag] = "Point";
        }
        math.PointND = PointND;
        class Point2D extends PointND {
            get x() {
                return this[0];
            }
            set x(value) {
                this[0] = value;
            }
            get y() {
                return this[1];
            }
            set y(value) {
                this[1] = value;
            }
        }
        math.Point2D = Point2D;
        class Point3D extends PointND {
            get x() {
                return this[0];
            }
            set x(value) {
                this[0] = value;
            }
            get y() {
                return this[1];
            }
            set y(value) {
                this[1] = value;
            }
            get z() {
                return this[2];
            }
            set z(value) {
                this[2] = value;
            }
        }
        math.Point3D = Point3D;
        const ERROR_COMPLEXNUM_BADMATH = "Complex number operations can only be done with numbers or other ComplexNumbers";
        class ComplexNumber {
            real;
            imaginary;
            static IMAGINARY_SYMBOL = "𝑖";
            static strictConversionDefault = true;
            constructor(a = 0, imaginary = 0) {
                if (a instanceof ComplexNumber) {
                    this.real = a.real;
                    this.imaginary = a.imaginary;
                }
                else {
                    this.real = a;
                    this.imaginary = imaginary;
                }
            }
            copy() {
                return new ComplexNumber(this);
            }
            get magnitudeSquared() {
                return this.real * this.real + this.imaginary * this.imaginary;
            }
            get magnitude() {
                return Math.sqrt(this.magnitudeSquared);
            }
            get conjugate() {
                return new ComplexNumber(this.real, -this.imaginary);
            }
            get negative() {
                return new ComplexNumber(-this.real, -this.imaginary);
            }
            get reciprocal() {
                return this.conjugate.divide(this.magnitudeSquared);
            }
            add(x) {
                if (typeof x === "number")
                    return this.add(new ComplexNumber(x));
                this.real += x.real;
                this.imaginary += x.imaginary;
                return this;
            }
            subtract(x) {
                if (typeof x === "number")
                    return this.subtract(new ComplexNumber(x));
                this.real -= x.real;
                this.imaginary -= x.imaginary;
                return this;
            }
            multiply(x) {
                if (typeof x === "number") {
                    this.real *= x;
                    this.imaginary *= x;
                    return this;
                }
                let r = (this.real * x.real) - (this.imaginary * x.imaginary);
                let i = (this.real * x.imaginary) + (this.imaginary * x.real);
                this.real = r;
                this.imaginary = i;
                return this;
            }
            divide(x) {
                if (typeof x === "number")
                    return this.multiply(1 / x);
                return this.multiply(x.reciprocal);
            }
            normalize() {
                return this.divide(this.magnitude);
            }
            toString(useUnicodeCharacters = false) {
                if (this.imaginary === 0)
                    return this.real.toString();
                let imagStr = variableToString(this.imaginary, useUnicodeCharacters ? ComplexNumber.IMAGINARY_SYMBOL : "i");
                if (this.real === 0)
                    return imagStr;
                let str = this.real.toString();
                if (this.imaginary > 0) {
                    str += "+";
                }
                return str + imagStr;
            }
            valueOf(strict) {
                if (strict == null) {
                    strict = ComplexNumber.strictConversionDefault;
                }
                if (strict && this.imaginary !== 0)
                    throw "Unable to convert a ComplexNumber with an imaginary value not equal to 0. To ignore the imaginary part when converting to a number, set ComplexNumber.strictConversionDefault to false";
                return this.real;
            }
        }
        math.ComplexNumber = ComplexNumber;
        class LinearEquation extends objects.CallableObject {
            slope;
            yIntercept;
            constructor(a = 0, yIntercept = 0) {
                if (a instanceof LinearEquation) {
                    yIntercept = a.yIntercept;
                    a = a.slope;
                }
                super(x => a * x + yIntercept);
                this.slope = a;
                this.yIntercept = yIntercept;
            }
            whenEqualTo(y) {
                if (typeof y === "number") {
                    if (Math.abs(this.slope) < 1e-10)
                        throw "Zero slope";
                    return (y - this.yIntercept) / this.slope;
                }
                if (Math.abs(this.slope - y.slope) < 1e-10)
                    throw "Linear equations of equal slope do not have a single intersection point";
                return (y.yIntercept - this.yIntercept) / (this.slope - y.slope);
            }
            get xIntercept() {
                return this.whenEqualTo(0);
            }
            toString() {
                if (Math.abs(this.yIntercept) < 1e-10)
                    return this.yIntercept.toString();
                let str = variableToString(this.slope, "x");
                if (this.yIntercept > 0) {
                    str += "+";
                }
                if (Math.abs(this.yIntercept) > 1e-10) {
                    str += this.yIntercept.toString();
                }
                return str;
            }
            get [Symbol.toStringTag]() {
                return "LinearEquation";
            }
        }
        math.LinearEquation = LinearEquation;
        class ParabolicEquation extends objects.CallableObject {
            h; // x shift
            k; // y shift
            a; // scale
            symAxis; // Axis of symmetry
            constructor(h, k, a, symAxis) {
                if (symAxis === "y") {
                    super(x => a * (x - h) * (x - h) + k);
                }
                else {
                    super(y => a * (y - k) * (y - k) + h);
                }
                this.h = h;
                this.k = k;
                this.a = a;
                this.symAxis = symAxis;
            }
            get vertex() {
                return new Point2D(this.h, this.k);
            }
            static fromVertexAndFocus(vertex, focus) {
                let symYAxis = vertex.x === focus.x;
                return new ParabolicEquation(vertex.x, vertex.y, symYAxis ? focus.y - vertex.y : focus.x - vertex.x, symYAxis ? "y" : "x");
            }
            static fromVertexAndLatusRectum(vertex, latusRectum, symAxis) {
                let vx = vertex.x;
                let vy = vertex.y;
                let lx = latusRectum.x;
                let ly = latusRectum.y;
                if (symAxis === "y")
                    return new ParabolicEquation(vx, vy, (lx - vx) ** 2 / (4 * (ly - vy)), "y");
                return new ParabolicEquation(vx, vy, (ly - vy) ** 2 / (4 * (lx - vx)), "x");
            }
            toString() {
                let a = "y";
                let b = this.h;
                let c = this.k;
                if (this.symAxis === "y") {
                    a = "x";
                    b = this.k;
                    c = this.h;
                }
                let str = a + " = " + (this.a * 4).toString();
                if (Math.abs(b) > 1e-10) {
                    str += "(" + this.symAxis + (b < 0 ? " + " + (-b) : " - " + b) + ")\u00b2 ";
                }
                else {
                    str += this.symAxis + "\u00b2 ";
                }
                if (Math.abs(c) > 1e-10) {
                    str += c < 0 ? "- " + (-c) : "+ " + c;
                }
                return str;
            }
            get [Symbol.toStringTag]() {
                return "ParabolicEquation";
            }
        }
        math.ParabolicEquation = ParabolicEquation;
        class Fraction {
            n;
            d;
            constructor(a, denominator) {
                if (typeof a === "number") {
                    if (typeof denominator !== "number") {
                        let f = Fraction.fromNumber(a);
                        this.n = f.n;
                        this.d = f.d;
                        return this;
                    }
                    if (Number.isInteger(a) && Number.isInteger(denominator)) {
                        this.n = a;
                        this.d = denominator;
                        return this;
                    }
                    let f = Fraction.fromNumber(a / denominator);
                    this.n = f.n;
                    this.d = f.d;
                    return this;
                }
                if (typeof a === "string") {
                    let f = Fraction.parse(a);
                    this.n = f.n;
                    this.d = f.d;
                    return this;
                }
                this.n = a.n;
                this.d = a.d;
            }
            static fromNumber(num) {
                if (Number.isInteger(num))
                    return new Fraction(num, 1);
                let intPart = Math.floor(num);
                let fracPart = num - intPart;
                const PRECISION = 10000000000;
                let gcd_ = gcd(Math.round(fracPart * PRECISION), PRECISION);
                let deno = PRECISION / gcd_;
                return new Fraction((Math.round(fracPart * PRECISION) / gcd_) + (intPart * deno), deno);
            }
            static parse(str) {
                let match = str.match(/(?<n>[\d\.]+)\/(?<d>[\d\.]+)/);
                const ERR_CANT_PARSE = "String could not be parsed to fraction";
                if (match == null || !match.groups || !match.groups.n || !match.groups.d)
                    throw ERR_CANT_PARSE;
                let num = Number(match.groups.n) / Number(match.groups.d);
                if (!isFinite(num))
                    throw ERR_CANT_PARSE;
                return Fraction.fromNumber(num);
                return Fraction.fromNumber(Number(match?.groups?.n) / Number(match?.groups?.d));
            }
            copy() {
                return new Fraction(this);
            }
            get numberValue() {
                return this.n / this.d;
            }
            valueOf() {
                return this.numberValue;
            }
            #assign(other) {
                this.n = other.n;
                this.d = other.d;
                return this;
            }
            makeEquivalent(newDenominator) {
                this.n *= newDenominator / this.d;
                this.d = newDenominator;
                return this;
            }
            simplify() {
                return this.#assign(Fraction.fromNumber(this.n / this.d));
            }
            equals(x) {
                if (x instanceof Fraction) {
                    x = x.numberValue;
                }
                return Math.abs(this.numberValue - x) < 1e-10;
            }
            add(x) {
                if (typeof x === "number")
                    return this.#assign(Fraction.fromNumber(this.numberValue + x));
                let newD = lcm(this.d, x.d);
                this.n = (this.n * newD / this.d) + (x.n * newD / x.d);
                this.d = newD;
                return this;
            }
            subtract(x) {
                if (typeof x === "number")
                    return this.add(-x);
                return this.add(new Fraction(-x.n, x.d));
            }
            multiply(x) {
                if (typeof x === "number")
                    return this.#assign(Fraction.fromNumber(this.numberValue * x));
                return this.#assign(new Fraction(this.n * x.n, this.d * x.d)).simplify();
            }
            get reciprocal() {
                return new Fraction(this.d, this.n);
            }
            divide(x) {
                if (typeof x === "number")
                    return this.multiply(1 / x);
                return this.multiply(x.reciprocal);
            }
            toString() {
                let n = this.d < 0 ? -this.n : this.n;
                let d = Math.abs(this.d);
                let str = n.toString();
                if (d !== 1) {
                    str += " / " + d.toString();
                }
                return str;
            }
            get [Symbol.toStringTag]() {
                return "Fraction";
            }
        }
        math.Fraction = Fraction;
        function riemannSum(func, min, max, subIntervalCt, type) {
            let subIntervalSize = (max - min) / subIntervalCt;
            let area = 0;
            for (let i = min; i < max; i += subIntervalSize) {
                let x = 0;
                switch (type) {
                    case "LEFT": {
                        x = i;
                        break;
                    }
                    case "MIDDLE": {
                        x = i + (subIntervalSize / 2);
                        break;
                    }
                    case "RIGHT": {
                        x = i + subIntervalSize;
                        break;
                    }
                    default: throw "Unknown Riemann Sum type: " + type;
                }
                area += func(x) * subIntervalSize;
            }
            return area;
        }
        function riemannSumLeft(func, min, max, subIntervalCt) {
            return riemannSum(func, min, max, subIntervalCt, "LEFT");
        }
        math.riemannSumLeft = riemannSumLeft;
        function riemannSumMiddle(func, min, max, subIntervalCt) {
            return riemannSum(func, min, max, subIntervalCt, "MIDDLE");
        }
        math.riemannSumMiddle = riemannSumMiddle;
        function riemannSumRight(func, min, max, subIntervalCt) {
            return riemannSum(func, min, max, subIntervalCt, "RIGHT");
        }
        math.riemannSumRight = riemannSumRight;
        function trapezoidalIntegrate(func, min, max, subIntervalCt) {
            let subIntervalSize = (max - min) / subIntervalCt;
            let ret = (func(min) + func(max)) / 2;
            for (let i = 1; i < subIntervalCt; i++) {
                ret += func(min + (i * subIntervalSize));
            }
            return ret * subIntervalSize;
        }
        function simpsonIntegrate(func, min, max, subIntervalCt) {
            let subIntervalSize = (max - min) / subIntervalCt;
            let ret = func(min) + func(max);
            for (let i = 1; i < subIntervalCt; i++) {
                ret += func(min + i * subIntervalSize) * (2 + (2 * (i & 1)));
            }
            return ret * subIntervalSize / 3;
        }
        /*
        Operation format:
        Null Token:                         NULL
        Constant Multiplication:            CMUL F C
        Addition:                           PLUS F1 F2
        Subtraction:                        PLUS F1 CMUL F2 -1
        Multiplication:                     MULT F1 F2
        Reciprocal:                         RECP F
        Division:                           MULT F1 RECP F2
        Exponentiation:                     EXPT FB FE                  (FB is the base, FE is the exponent)
        Exp:                                EXPT NULL FE
        Logarithm:                          LOGB F FB                   (FB is the base of the log. Can be a function)
        Natural Log:                        LOGB F NULL
        Trig Function:                      TRIG T F                    (T is the index of the function in [sin, cos, tan, csc, sec, cot])
        Inverse Trig Function:              ATRG T F                    (T is the index of the function in [arcsin, arccos, arctan, arccsc, arcsec, arccot])
        Hyperbolic Trig Function:           HTRG T F                    (T is the index of the function in [sinh, cosh, tanh, csch, sech, coth])
        Inverse Hyperbolic Trig Function:   AHTR T F                    (T is the index of the function in [arcsinh, arccosh, arctanh, arccsch, arcsech, arccoth])
        Special Function:                   SPCF ID ARG0 ARG1 ... ARGN  (Defined for the interpreter at runtime)
        */
        function pctError(actual, expected) {
            return Math.abs((actual / expected) - 1) * 100;
        }
        function numberArray(length) {
            return new Array(length).fill(0);
        }
        function validateMatrixDimension(d) {
            if (!Number.isInteger(d) || d < 1)
                throw "A matrix must be constructed from a positive integer number of rows and columns";
        }
        function is2DArray(a) {
            return Array.isArray(a) && Array.isArray(a[0]);
        }
        function copy2DArray(a) {
            return a.map(row => Array.from(row));
        }
        class Matrix {
            #data;
            constructor(a = 1, columns = 1) {
                if (a instanceof Matrix) {
                    this.#data = copy2DArray(a.#data);
                }
                else if (is2DArray(a)) {
                    this.#data = copy2DArray(a);
                }
                else {
                    this.#data = [];
                    if (Array.isArray(a)) {
                        validateMatrixDimension(columns);
                        for (let i = 0; i < a.length; i += columns) {
                            this.#data.push(a.slice(i, i + columns));
                        }
                    }
                    else {
                        validateMatrixDimension(a);
                        validateMatrixDimension(columns);
                        for (let i = 0; i < a; i++) {
                            this.#data.push(numberArray(columns));
                        }
                    }
                }
                return new Proxy(this, {
                    get(target, p, receiver) {
                        if (Number.isInteger(p))
                            return target.#data[p];
                        return Reflect.get(target, p, receiver);
                    }
                });
            }
            static identity(n) {
                return new Matrix(n, n).mapCells(function (value, row, column) {
                    return row === column ? 1 : 0;
                });
            }
            get rows() {
                return this.#data.length;
            }
            get columns() {
                return this.#data[0].length;
            }
            get isSquare() {
                return this.rows === this.columns;
            }
            forEachCell(f) {
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.columns; j++) {
                        f.call(this, this.#data[i][j], i, j);
                    }
                }
            }
            mapCells(f) {
                this.forEachCell(function (value, row, column) {
                    this.#data[row][column] = f.call(this, value, row, column);
                });
                return this;
            }
            reduce(f, initialValue) {
                let ret = initialValue;
                this.forEachCell(function (value, row, column) {
                    ret = f.call(this, ret, value, row, column);
                });
                return ret;
            }
            add(other) {
                if (this.rows !== other.rows || this.columns !== other.columns)
                    throw "Matrix addition is only supported for matrices of the same dimensions";
                return this.mapCells(function (value, row, column) {
                    return value + other[row][column];
                });
            }
            subtract(other) {
                if (this.rows !== other.rows || this.columns !== other.columns)
                    throw "Matrix subtraction is only supported for matrices of the same dimensions";
                return this.mapCells(function (value, row, column) {
                    return value - other[row][column];
                });
            }
            multiply(a) {
                if (typeof a === "number")
                    return this.mapCells(v => v * a);
                if (this.columns !== a.rows)
                    throw "For matrix multiplication, the number of rows in the second matrix must match the number of columns in the first";
                let m = this;
                return new Matrix(this.rows, a.columns).mapCells(function (value, row, column) {
                    let sum = 0;
                    for (let i = 0; i < a.rows; i++) {
                        sum += m[row][i] * a[i][row];
                    }
                    return sum;
                });
            }
            gaussianEliminate(storeMultipliers = false) {
                for (let i = 0; i < this.rows && i < this.columns; i++) {
                    let maxRow = i;
                    for (let j = i + 1; j < this.rows; j++) {
                        if (Math.abs(this.#data[j][i]) > Math.abs(this.#data[maxRow][i])) {
                            maxRow = j;
                        }
                    }
                    if (Math.abs(this.#data[maxRow][i]) < 1e-14)
                        continue;
                    if (maxRow != i) {
                        for (let j = 0; j < this.columns; j++) {
                            let temp = this.#data[i][j];
                            this.#data[i][j] = this.#data[maxRow][j];
                            this.#data[maxRow][j] = temp;
                        }
                    }
                    for (let j = i + 1; j < this.rows; j++) {
                        let f = this.#data[j][i] / this.#data[i][i];
                        if (storeMultipliers) {
                            this.#data[j][i] = f;
                        }
                        for (let k = i; k < this.columns; k++) {
                            this.#data[j][k] -= this.#data[i][k] * f;
                        }
                    }
                }
                return this;
            }
            get determinant() {
                if (!this.isSquare)
                    throw "Only square matrices can have a determinant";
                if (this.rows < 1)
                    return 0;
                if (this.rows === 1)
                    return this.#data[0][0];
                if (this.rows === 2)
                    return this.#data[0][0] * this.#data[1][1] - this.#data[0][1] * this.#data[1][0];
                if (this.rows < 6) {
                    let d = 0;
                    for (let i = 0; i < this.rows; i++) {
                        d += this.#data[0][i] * this.coFactor(0, i);
                    }
                    return d;
                }
                let d = 1;
                let m = this.copy().gaussianEliminate();
                for (let i = 0; i < this.rows; i++) {
                    d *= m.#data[i][i];
                }
                return d;
            }
            getInverse() {
                const ERROR_NO_INVERSE = "Only square matrices with a non-zero determinant have an inverse";
                if (!this.isSquare)
                    throw ERROR_NO_INVERSE;
                if (Math.abs(this.determinant) < 1e-14)
                    throw ERROR_NO_INVERSE;
                let n = this.rows;
                let augmented = new Matrix(n, n * 2);
                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < n; j++) {
                        augmented[i][j] = this.#data[i][j];
                        augmented[i][j + n] = i === j ? 1 : 0;
                    }
                }
                augmented.gaussianEliminate();
                for (let i = n - 1; i > -1; i--) {
                    let pivot = augmented[i][i];
                    if (Math.abs(pivot) < 1e-10)
                        return null;
                    for (let j = 0; j < augmented.columns; j++) {
                        augmented[i][j] /= pivot;
                    }
                    for (let j = i - 1; j > -1; j--) {
                        let f = augmented[j][i];
                        for (let k = 0; k < augmented.columns; k++) {
                            augmented[j][k] -= f * augmented[i][k];
                        }
                    }
                }
                return new Matrix(n, n).mapCells(function (value, row, column) {
                    return augmented[row][column + n];
                });
            }
            minor(excludedRow, excludedColumn) {
                if (!this.isSquare)
                    throw "Only square matrices can have a minor";
                if (this.rows < 1)
                    return 0;
                if (this.rows === 1)
                    return this.#data[0][0];
                return this.subMatrix(excludedRow, excludedColumn).determinant;
            }
            coFactor(excludedRow, excludedColumn) {
                if (!this.isSquare)
                    throw "Only square matrices can have a cofactor";
                return (1 - 2 * ((excludedRow + excludedColumn) & 1)) * this.minor(excludedRow, excludedColumn);
            }
            subMatrix(excludedRow = -1, excludedColumn = -1) {
                let ret = new Matrix(excludedRow >= 0 ? this.rows - 1 : this.rows, excludedColumn >= 0 ? this.columns - 1 : this.columns);
                let rowShift = 0;
                for (let row = 0; row < ret.rows; row++) {
                    if (row === excludedRow) {
                        rowShift = 1;
                        continue;
                    }
                    let colShift = 0;
                    for (let col = 0; col < ret.columns; col++) {
                        if (col === excludedColumn) {
                            colShift = 1;
                            continue;
                        }
                        ret[row][col] = this.#data[row + rowShift][col + colShift];
                    }
                }
                return ret;
            }
            copy() {
                return new Matrix(this);
            }
            *[Symbol.iterator]() {
                for (let row of this.#data) {
                    yield row;
                }
            }
            toArray() {
                return copy2DArray(this.#data);
            }
            toString() {
                return this.#data.toString();
            }
            get [Symbol.toStringTag]() {
                return "Matrix";
            }
        }
        math.Matrix = Matrix;
    })(math = jango.math || (jango.math = {}));
    let strings;
    (function (strings) {
        strings.LATIN_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        strings.LATIN_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
        strings.DIGITS = "0123456789";
        function toCharSet(str, a, keepUnmappedChars = true) {
            switch (typeof a) {
                case "function": {
                    let ret = "";
                    for (let i = 0; i < str.length; i++) {
                        ret += a(str[i]);
                    }
                    return ret;
                }
                case "object": {
                    return toCharSet(str, function (char) {
                        if (Object.prototype.hasOwnProperty.call(a, char))
                            return a[char];
                        return keepUnmappedChars ? char : "";
                    });
                }
                case "string": {
                    switch (a) {
                        case "OLD_ENGLISH": {
                            return toCharSet(str, function (char) {
                                var code = char.codePointAt(0);
                                if (code > 0x40 && code < 0x5b)
                                    return String.fromCodePoint(0x1d52b + code);
                                if (code > 0x60 && code < 0x7b)
                                    return String.fromCodePoint(0x1d525 + code);
                                return char;
                            });
                        }
                        case "DOUBLESTRUCK": {
                            return toCharSet(str, function (char) {
                                if (!isAlphanumeric(char))
                                    return char;
                                var code = char.codePointAt(0);
                                if (isNumeric(char)) {
                                    return String.fromCodePoint(0x1d7a8 + code);
                                }
                                if (isLowerCase(char)) {
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
                            });
                        }
                        case "ENCIRCLED": {
                            return toCharSet(str, function (char) {
                                let code = char.codePointAt(0);
                                if (code > 0x40 && code < 0x5b)
                                    return String.fromCodePoint(0x2475 + code);
                                if (code > 0x60 && code < 0x7b)
                                    return String.fromCodePoint(0x246f + code);
                                if (code == 0x30)
                                    return "\u24ea";
                                if (code > 0x30 && code < 0x3a)
                                    return String.fromCodePoint(0x242f + code);
                                return char;
                            });
                        }
                        case "CURSIVE": {
                            return toCharSet(str, function (char) {
                                let code = char.codePointAt(0);
                                switch (code) {
                                    case 0x42: return "\u212c";
                                    case 0x45: return "\u2130";
                                    case 0x46: return "\u2131";
                                    case 0x48: return "\u210b";
                                    case 0x49: return "\u2110";
                                    case 0x4c: return "\u2112";
                                    case 0x4d: return "\u2133";
                                    case 0x52: return "\u211b";
                                    case 0x65: return "\u212f";
                                    case 0x67: return "\u210a";
                                    case 0x6f: return "\u2134";
                                }
                                if (code > 0x40 && code < 0x5b)
                                    return String.fromCodePoint(0x1d45b + code);
                                if (code > 0x60 && code < 0x7b)
                                    return String.fromCodePoint(0x1d455 + code);
                                return char;
                            });
                        }
                    }
                }
            }
        }
        strings.toCharSet = toCharSet;
        function strAll(str, predicate) {
            for (let i = 0; i < str.length; i++) {
                if (!predicate(str[i]))
                    return false;
            }
            return true;
        }
        strings.strAll = strAll;
        function isLowerCase(str) {
            return strAll(str, function (char) {
                let codePoint = char.codePointAt(0);
                return codePoint < 0x41 || codePoint > 0x5a;
            });
        }
        strings.isLowerCase = isLowerCase;
        function isUpperCase(str) {
            return strAll(str, function (char) {
                let codePoint = char.codePointAt(0);
                return codePoint < 0x61 || codePoint > 0x7a;
            });
        }
        strings.isUpperCase = isUpperCase;
        function isAlpha(str) {
            return strAll(str, function (char) {
                let codePoint = char.codePointAt(0);
                return (codePoint > 0x40 && codePoint < 0x5b) || (codePoint > 0x60 && codePoint < 0x7b);
            });
        }
        strings.isAlpha = isAlpha;
        function isNumeric(str) {
            return strAll(str, function (char) {
                let codePoint = char.codePointAt(0);
                return codePoint > 0x2f && codePoint < 0x3a;
            });
        }
        strings.isNumeric = isNumeric;
        function isAlphanumeric(str) {
            return strAll(str, function (char) {
                let codePoint = char.codePointAt(0);
                return (codePoint > 0x40 && codePoint < 0x5b) || (codePoint > 0x60 && codePoint < 0x7b) || (codePoint > 0x2f && codePoint < 0x3a);
            });
        }
        strings.isAlphanumeric = isAlphanumeric;
        /**
         * Converts a country code into a flag.
         *
         * Doesn't render on Windows.
         * @example toFlagChar("PL") === "🇵🇱"
         * @param {string} str
         * @returns {string} The desired flag (or a tiny version of the inputted string on Windows).
         */
        function toFlagChar(str) {
            let errMsg = "toFlagChar expects a string consisting of 2 ASCII Latin letters";
            if (str.length !== 2)
                throw new RangeError(`${errMsg}. Length of str: ${str.length}`);
            function convertChar(c) {
                c = c.toUpperCase();
                let cp = c.codePointAt(0);
                if (cp < 0x41 || cp > 0x5a)
                    throw new RangeError(`${errMsg}. Inputted char: ${c} (0x${cp.toString(16)})`);
                return String.fromCodePoint(0x1f1a5 + cp);
            }
            return convertChar(str[0]) + convertChar(str[1]);
        }
        strings.toFlagChar = toFlagChar;
        function isValidUTF8CodePoint(x) {
            if (typeof x === "bigint")
                return x > -1n && x < 0x110000n;
            if (!Number.isInteger(x))
                return false;
            return x > -1 && x < 0x110000;
        }
        strings.isValidUTF8CodePoint = isValidUTF8CodePoint;
        function isCodePointUTF16HighSurrogate(cp) {
            return isValidUTF8CodePoint(cp) && (cp > 0xd7ff && cp < 0xdc00);
        }
        strings.isCodePointUTF16HighSurrogate = isCodePointUTF16HighSurrogate;
        function isCodePointUTF16LowSurrogate(cp) {
            return isValidUTF8CodePoint(cp) && (cp > 0xdbff && cp < 0xe000);
        }
        strings.isCodePointUTF16LowSurrogate = isCodePointUTF16LowSurrogate;
        function isCodePointUTF16Surrogate(cp) {
            return isValidUTF8CodePoint(cp) && (cp > 0xd7ff && cp < 0xe000);
        }
        strings.isCodePointUTF16Surrogate = isCodePointUTF16Surrogate;
        function codepointToUTF16Pair(codePoint) {
            if (!isValidUTF8CodePoint(codePoint))
                throw "Parameter codePoint on codepointToUTF16Pair must be a valid Unicode codepoint";
            if (codePoint < 0x10000)
                return codePoint;
            codePoint -= 0x10000;
            return [0xd800 + (codePoint >> 10), 0xdc00 + (codePoint & 0x3ff)];
        }
        strings.codepointToUTF16Pair = codepointToUTF16Pair;
        function utf16PairToCodepoint(hi, lo) {
            if (!isCodePointUTF16HighSurrogate(hi))
                throw "Parameter hi on utf16PairToCodepoint must be a valid UTF-16 high surrogate";
            if (!isCodePointUTF16LowSurrogate(lo))
                throw "Parameter lo on utf16PairToCodepoint must be a valid UTF-16 low surrogate";
            return (((hi - 0xd800) << 10) | (lo - 0xdc00)) + 0x10000;
        }
        strings.utf16PairToCodepoint = utf16PairToCodepoint;
        function getUTF8ByteCountForCodepoint(cp) {
            if (!isValidUTF8CodePoint(cp))
                throw "getUTF8CodepointByteCount can only be called with an argument of a valid Unicode codepoint";
            function f(b) {
                return b ? 1 : 0;
            }
            return 1 + f(cp > 0x7f) + f(cp > 0x7ff) + f(cp > 0xffff);
        }
        strings.getUTF8ByteCountForCodepoint = getUTF8ByteCountForCodepoint;
        function getUTF16ByteCountForCodepoint(cp) {
            if (!isValidUTF8CodePoint(cp))
                throw "getUTF8CodepointByteCount can only be called with an argument of a valid Unicode codepoint";
            return cp > 0xffff ? 2 : 1;
        }
        strings.getUTF16ByteCountForCodepoint = getUTF16ByteCountForCodepoint;
        function codepointToUTF8Bytes(codepoint) {
            if (!isValidUTF8CodePoint(codepoint) || typeof codepoint !== "number")
                throw "parameter codepoint on codepointToUTF8Bytes must be a valid Unicode codepoint.";
            let byteCt = getUTF8ByteCountForCodepoint(codepoint);
            if (byteCt === 1)
                return [codepoint];
            let bytes = [((16 - (1 << (4 - byteCt))) << 4) | (codepoint >> ((byteCt - 1) * 6))];
            for (let i = byteCt - 2; i > -1; i--) {
                bytes.push(0x80 | ((codepoint >> (i * 6)) & 63));
            }
            return bytes;
        }
        strings.codepointToUTF8Bytes = codepointToUTF8Bytes;
        function getCodepoints(str) {
            if (typeof str !== "string")
                throw "getCodepoints can only be called with an argument of type string";
            let cps = [];
            for (let x of str) {
                cps.push(x.codePointAt(0));
            }
            return cps;
        }
        strings.getCodepoints = getCodepoints;
        function getCharCodes(str) {
            if (typeof str !== "string")
                throw "getCharCodes can only be called with an argument of type string";
            let codes = [];
            for (let i = 0; str[i]; i++) {
                codes.push(str.charCodeAt(i));
            }
            return codes;
        }
        strings.getCharCodes = getCharCodes;
        function getUTF8Bytes(str) {
            let bytes = [];
            for (let cp of getCodepoints(str)) {
                bytes.push.apply(bytes, codepointToUTF8Bytes(cp));
            }
            return bytes;
        }
        strings.getUTF8Bytes = getUTF8Bytes;
        function getUTF16Bytes(str) {
            if (typeof str !== "string")
                throw "getUTF16Bytes can only be called with an argument of type string";
            let bytes = [];
            for (let i = 0; i < str.length; i++) {
                let c = str.charCodeAt(i);
                bytes.push(c >> 8);
                bytes.push(c & 0xff);
            }
            return bytes;
        }
        strings.getUTF16Bytes = getUTF16Bytes;
    })(strings = jango.strings || (jango.strings = {}));
    let engineering;
    (function (engineering) {
        function convertTemp(tempIn, typeIn, typeOut) {
            if (typeIn == typeOut)
                return tempIn;
            if (typeOut == "KELVIN")
                return convertTemp(tempIn, typeIn, "CELCIUS") + 273;
            if (typeOut == "RANKIN")
                return convertTemp(tempIn, typeIn, "FAHRENHEIT") + 460;
            if (typeIn == "KELVIN")
                return convertTemp(tempIn - 273, "CELCIUS", typeOut);
            if (typeIn == "RANKIN")
                return convertTemp(tempIn - 460, "FAHRENHEIT", typeOut);
            switch (typeOut) {
                case "CELCIUS": return (tempIn - 32) / 1.8;
                case "FAHRENHEIT": return (tempIn * 1.8) + 32;
            }
        }
        engineering.convertTemp = convertTemp;
        function conversionFunction(conversionTable) {
            return function (value, typeIn, typeOut) {
                return value * conversionTable[typeOut] / conversionTable[typeIn];
            };
        }
        engineering.conversionFunction = conversionFunction;
        engineering.PressureUnit = {
            ATMOSPHERES: 1,
            BAR: 1.01325,
            FEET_H2O: 33.9,
            IN_MERCURY: 29.92,
            MM_MERCURY: 760,
            PASCALS: 101.325,
            PSI: 14.7
        };
        const __convPressure = conversionFunction(engineering.PressureUnit);
        function convertPressure(value, typeIn, typeOut) {
            return __convPressure(value, typeIn, typeOut);
        }
        engineering.convertPressure = convertPressure;
    })(engineering = jango.engineering || (jango.engineering = {}));
    let nbt;
    (function (nbt) {
        let NBTTagType;
        (function (NBTTagType) {
            NBTTagType[NBTTagType["END"] = 0] = "END";
            NBTTagType[NBTTagType["BYTE"] = 1] = "BYTE";
            NBTTagType[NBTTagType["SHORT"] = 2] = "SHORT";
            NBTTagType[NBTTagType["INT"] = 3] = "INT";
            NBTTagType[NBTTagType["LONG"] = 4] = "LONG";
            NBTTagType[NBTTagType["FLOAT"] = 5] = "FLOAT";
            NBTTagType[NBTTagType["DOUBLE"] = 6] = "DOUBLE";
            NBTTagType[NBTTagType["BYTE_ARRAY"] = 7] = "BYTE_ARRAY";
            NBTTagType[NBTTagType["STRING"] = 8] = "STRING";
            NBTTagType[NBTTagType["LIST"] = 9] = "LIST";
            NBTTagType[NBTTagType["COMPOUND"] = 10] = "COMPOUND";
            NBTTagType[NBTTagType["INT_ARRAY"] = 11] = "INT_ARRAY";
            NBTTagType[NBTTagType["LONG_ARRAY"] = 12] = "LONG_ARRAY";
            NBTTagType[NBTTagType["SHORT_ARRAY"] = 13] = "SHORT_ARRAY";
        })(NBTTagType || (NBTTagType = {}));
        function isHomogenousArray(a) {
            if (a instanceof NBTList)
                return true;
            if (a.length < 2)
                return true;
            let isNBTTagArray = a[0] instanceof NBTTag;
            for (let i = 1; i < a.length; i++) {
                if (typeof a[i] !== typeof a[0])
                    return false;
                if (!isNBTTagArray)
                    continue;
                if (a[0].type !== a[i].type)
                    return false;
            }
            return true;
        }
        class NBTTag {
            type;
            value;
            constructor(type) {
                this.type = type;
            }
            equals(other) {
                if (other instanceof NBTTag)
                    return other.equals(this.value);
                return this.value == other;
            }
            equalsStrict(other) {
                if (other instanceof NBTTag)
                    return this.type === other.type && other.equalsStrict(this.value);
                return this.value === other;
            }
            static isValidNBTTag(value) {
                if (value instanceof NBTTag || typeof value === "number" || typeof value === "string")
                    return true;
                if (Array.isArray(value))
                    return NBTList.isNBTList(value);
                return NBTCompound.isNBTCompound(value);
            }
            static getTagTypeForValue(value) {
                if (value instanceof NBTTag)
                    return value.type;
                switch (typeof value) {
                    case "symbol":
                    case "string": return NBTTagType.STRING;
                    case "number": return Number.isInteger(value) ? NBTTagType.INT : NBTTagType.DOUBLE;
                    case "bigint": return NBTTagType.LONG;
                    case "boolean": return NBTTagType.BYTE;
                    case "undefined": return NBTTagType.END;
                    case "object": {
                        if (value == null)
                            return NBTTagType.END;
                        if (value instanceof Int8Array || value instanceof Uint8Array)
                            return NBTTagType.BYTE_ARRAY;
                        if (value instanceof Int32Array || value instanceof Uint32Array)
                            return NBTTagType.INT_ARRAY;
                        if (value instanceof BigInt64Array)
                            return NBTTagType.LONG_ARRAY;
                        if (value instanceof Int16Array || value instanceof Uint16Array)
                            return NBTTagType.SHORT_ARRAY;
                        if (Array.isArray(value)) {
                            if (isHomogenousArray(value)) {
                                let firstItem = value[0];
                                if (typeof firstItem === "number") {
                                    if (value.every(x => Number.isInteger(x)))
                                        return NBTTagType.INT_ARRAY;
                                    return NBTTagType.LIST;
                                }
                                if (typeof firstItem === "bigint")
                                    return NBTTagType.LONG_ARRAY;
                                if (typeof firstItem === "boolean")
                                    return NBTTagType.BYTE_ARRAY;
                                if (typeof firstItem === "string" || typeof firstItem === "symbol")
                                    return NBTTagType.LIST;
                                if (firstItem instanceof NBTTag) {
                                    switch (firstItem.type) {
                                        case NBTTagType.BYTE: return NBTTagType.BYTE_ARRAY;
                                        case NBTTagType.INT: return NBTTagType.INT_ARRAY;
                                        case NBTTagType.LONG: return NBTTagType.LONG_ARRAY;
                                        case NBTTagType.SHORT: return NBTTagType.SHORT_ARRAY;
                                        case NBTTagType.END: break;
                                        default: return NBTTagType.LIST;
                                    }
                                }
                                if (typeof firstItem === "object" && value.every(x => NBTCompound.isNBTCompound(x)))
                                    return NBTTagType.LIST;
                            }
                            throw "Unable to convert array to NBT";
                        }
                        if (NBTCompound.isNBTCompound(value))
                            return NBTTagType.COMPOUND;
                    }
                    case "function":
                }
                throw "Unable to convert value to NBT";
            }
            static create(type, value) {
                if (value instanceof NBTTag)
                    return value;
                if (type == null) {
                    if (NBTInt.isInt(value))
                        return new NBTInt(value);
                    if (NBTLong.isLong(value))
                        return new NBTLong(value);
                    if (NBTFloat.isFloat(value))
                        return new NBTFloat(value);
                    if (NBTDouble.isDouble(value))
                        return new NBTDouble(value);
                    if (NBTString.isString(value))
                        return new NBTString(value);
                    if (NBTIntArray.isIntArray(value))
                        return new NBTIntArray(value);
                    if (NBTLongArray.isLongArray(value))
                        return new NBTLongArray(value);
                    if (NBTList.isNBTList(value))
                        return new NBTList(value);
                    if (NBTCompound.isNBTCompound(value))
                        return new NBTCompound(value);
                    if (Array.isArray(value) && value.some(x => typeof x !== typeof value[0])) {
                        throw "NBT tags can only be created from arrays with elements of only 1 type of NBT tag";
                    }
                    throw `Unable to determine type of ${Object.prototype.toString.call(value)}`;
                }
                switch (type) {
                    case NBTTagType.END: return new NBTTagEnd();
                    case NBTTagType.BYTE: return new NBTByte(value);
                    case NBTTagType.SHORT: return new NBTShort(value);
                    case NBTTagType.INT: return new NBTInt(value);
                    case NBTTagType.LONG: return new NBTLong(value);
                    case NBTTagType.FLOAT: return new NBTFloat(value);
                    case NBTTagType.DOUBLE: return new NBTDouble(value);
                    case NBTTagType.BYTE_ARRAY: return new NBTByteArray(value);
                    case NBTTagType.STRING: return new NBTString(value);
                    case NBTTagType.LIST: return new NBTList(value);
                    case NBTTagType.COMPOUND: return new NBTCompound(value);
                    case NBTTagType.INT_ARRAY: return new NBTIntArray(value);
                    case NBTTagType.LONG_ARRAY: return new NBTLongArray(value);
                    case NBTTagType.SHORT_ARRAY: return new NBTShortArray(value);
                }
            }
        }
        class NBTTagEnd extends NBTTag {
            constructor() {
                super(NBTTagType.END);
            }
            toByteStream(littleEndian) {
                return new Uint8Array();
            }
            toNBT() {
                return "";
            }
            toJSON() {
                return null;
            }
            copy() {
                return new NBTTagEnd();
            }
        }
        nbt.NBTTagEnd = NBTTagEnd;
        class NBTNumberTag extends NBTTag {
            value;
            #suffix;
            #byteSize;
            constructor(type, nbtSuffix, byteSize, value) {
                super(type);
                this.#suffix = nbtSuffix;
                this.#byteSize = byteSize;
                this.value = value;
            }
            valueOf() {
                return this.value;
            }
            get byteSize() {
                return this.#byteSize;
            }
            toByteStream(littleEndian) {
                let ret = new Uint8Array(this.#byteSize);
                if (littleEndian) {
                    for (let i = 0; i < this.#byteSize; i++) {
                        ret[i] = (this.value >> (i * 8)) & 255;
                    }
                }
                else {
                    for (let i = 0; i < this.#byteSize; i++) {
                        ret[i] = (this.value >> ((this.#byteSize - i - 1) * 8)) & 255;
                    }
                }
                return ret;
            }
            toJSON() {
                return this.value;
            }
            toNBT() {
                return this.value.toString() + this.#suffix;
            }
            toString(radix) {
                return this.value.toString(radix);
            }
            copy() {
                return new NBTNumberTag(this.type, this.#suffix, this.#byteSize, this.value);
            }
            equals(v) {
                if (v instanceof NBTNumberTag)
                    return this.equals(v.value);
                if (typeof v === "bigint") {
                    if (typeof this.value === "bigint")
                        return this.value == v;
                    return Number.isInteger(this.value) && BigInt(this.value) == v;
                }
                if (typeof this.value === "bigint")
                    return Number.isInteger(v) && BigInt(v) == this.value;
                return Math.abs(this.value - v) < 1e-10;
            }
            equalsStrict(v) {
                if (v instanceof NBTNumberTag)
                    return this.type === v.type && this.equalsStrict(v.value);
                if (typeof this.value !== typeof v)
                    return false;
                if (typeof this.value === "bigint")
                    return this.value === v;
                return Math.abs(this.value - v) < 1e-10;
            }
        }
        function isNumberNByteInteger(num, byteCt) {
            if (num instanceof NBTNumberTag)
                return isNumberNByteInteger(num.value, byteCt);
            if (typeof num === "bigint") {
                let lowerBound = -BigInt(Math.pow(2, (byteCt * 8) - 1));
                return num >= lowerBound && num < -(lowerBound + 1n);
            }
            if (!Number.isInteger(num))
                return false;
            let lowerBound = -Math.pow(2, (byteCt * 8) - 1);
            let upperBound = -lowerBound - 1;
            return num >= lowerBound && num <= upperBound;
        }
        class NBTByte extends NBTNumberTag {
            constructor(value) {
                super(NBTTagType.BYTE, "b", 1, value);
            }
            static isByte(v) {
                return isNumberNByteInteger(v, 1);
            }
        }
        nbt.NBTByte = NBTByte;
        class NBTShort extends NBTNumberTag {
            constructor(value) {
                super(NBTTagType.SHORT, "s", 2, value);
            }
            static isShort(v) {
                return isNumberNByteInteger(v, 2);
            }
        }
        nbt.NBTShort = NBTShort;
        class NBTInt extends NBTNumberTag {
            constructor(value) {
                super(NBTTagType.INT, "", 4, value);
            }
            static isInt(v) {
                return isNumberNByteInteger(v, 4);
            }
        }
        nbt.NBTInt = NBTInt;
        class NBTLong extends NBTNumberTag {
            constructor(value) {
                super(NBTTagType.LONG, "L", 8, BigInt(value));
            }
            static isLong(v) {
                return typeof v === "number" ? Number.isInteger(v) : isNumberNByteInteger(v, 8);
            }
        }
        nbt.NBTLong = NBTLong;
        class NBTFloat extends NBTNumberTag {
            constructor(value) {
                super(NBTTagType.FLOAT, "f", 4, value);
            }
            toByteStream(littleEndian) {
                let ret = new Uint8Array(4);
                let view = new DataView(ret.buffer);
                view.setFloat32(0, this.value, littleEndian);
                return ret;
            }
            toNBT() {
                let str = this.value.toString();
                if (!str.includes(".")) {
                    str += ".0";
                }
                return str + "f";
            }
            static isFloat(v) {
                if (v instanceof NBTFloat)
                    return true;
                return v >= math.FLOAT32_MIN && v <= math.FLOAT32_MAX;
            }
        }
        nbt.NBTFloat = NBTFloat;
        class NBTDouble extends NBTNumberTag {
            constructor(value) {
                super(NBTTagType.DOUBLE, "d", 8, value);
            }
            toByteStream(littleEndian) {
                let ret = new Uint8Array(8);
                let view = new DataView(ret.buffer);
                view.setFloat64(0, this.value, littleEndian);
                return ret;
            }
            toNBT() {
                let str = this.value.toString();
                if (!str.includes(".")) {
                    str += ".0";
                }
                return str + "d";
            }
            static isDouble(v) {
                if (v instanceof NBTDouble)
                    return true;
                return Math.abs(v) <= Number.MAX_VALUE;
            }
        }
        nbt.NBTDouble = NBTDouble;
        function formatIndex(index, maxLen) {
            if (Math.abs(index) > maxLen)
                throw `Index ${index} is out of bounds`;
            if (index >= 0)
                return index;
            return maxLen + index;
        }
        class NBTArrayTag extends NBTTag {
            value;
            constructor(type, value) {
                super(type);
                this.value = [];
                if (value instanceof NBTArrayTag) {
                    value = value.value;
                }
                if (Array.isArray(value)) {
                    this.value = value.map(x => x.copy());
                }
                return new Proxy(this, {
                    get(target, p, receiver) {
                        if (Number.isInteger(p))
                            return target.value[Number(p)];
                        return Reflect.get(target, p, receiver);
                    }
                });
            }
            get length() {
                return this.value.length;
            }
            toJSON() {
                return this.value.map(x => x.toJSON());
            }
            toNBT() {
                return this.value.toString();
            }
            toByteStream(littleEndian) {
                let memberSize = this.value.length > 0 ? this.value[0].byteSize : 0;
                let ret = new Uint8Array(this.value.length * memberSize + 4);
                let lengthBytes = new NBTInt(this.value.length).toByteStream(littleEndian);
                for (let i = 0; i < 4; i++) {
                    ret[i] = lengthBytes[i];
                }
                for (let i = 0; i < this.value.length; i++) {
                    let memberBytes = this.value[i].toByteStream();
                    for (let j = 0; j < memberBytes.length; j++) {
                        ret[i * memberSize + j + 4] = memberBytes[j];
                    }
                }
                return ret;
            }
            copy() {
                return new NBTArrayTag(this.type, this.value);
            }
            equals(other) {
                if (this.length !== other.length)
                    return false;
                for (let i = 0; i < this.length; i++) {
                    if (!this.value[i].equalsStrict(other[i]))
                        return false;
                }
                return true;
            }
            equalsStrict(other) {
                if (this.length !== other.length)
                    return false;
                for (let i = 0; i < this.length; i++) {
                    if (!this.value[i].equalsStrict(other[i]))
                        return false;
                }
                return true;
            }
            static isIntegerArray(array) {
                if (array instanceof NBTArrayTag)
                    return true;
                if (!Array.isArray(array))
                    return false;
                for (let i = 0; i < array.length; i++) {
                    if (typeof array[i] !== "number")
                        return false;
                    if (array[i] !== Math.floor(array[i]))
                        return false;
                }
                return true;
            }
        }
        class NBTByteArray extends NBTArrayTag {
            constructor(value) {
                if (Array.isArray(value) && typeof value[0] === "number") {
                    value = value;
                    if (!NBTByteArray.isByteArray(value))
                        throw "Invalid byte array";
                    value = value.map(b => new NBTByte(b));
                }
                super(NBTTagType.BYTE_ARRAY, value);
            }
            static isByteArray(array) {
                if (!NBTArrayTag.isIntegerArray(array))
                    return false;
                for (let i = 0; i < array.length; i++) {
                    if (!NBTByte.isByte(array[i]))
                        return false;
                }
                return true;
            }
        }
        nbt.NBTByteArray = NBTByteArray;
        class NBTString extends NBTTag {
            value;
            constructor(value) {
                super(NBTTagType.STRING);
                this.value = value;
                return new Proxy(this, {
                    get(target, p, receiver) {
                        if (Number.isInteger(p))
                            return target.value[Number(p)];
                        return Reflect.get(target, p, receiver);
                    },
                });
            }
            get length() {
                return this.value.length;
            }
            charAt(index) {
                return this.value.charAt(index);
            }
            codePointAt(index) {
                return this.value.codePointAt(index);
            }
            append(str) {
                this.value += str;
            }
            substring(start, end) {
                return new NBTString(this.value.substring(start, end));
            }
            copy() {
                return new NBTString(this.value);
            }
            toByteStream(littleEndian) {
                if (this.value === "")
                    return Uint8Array.of(0, 0);
                let bytes = [this.length >> 8, this.length & 0xff];
                for (let i = 0; i < this.length; i++) {
                    let cp = this.codePointAt(i);
                    if (cp < 0x80) {
                        bytes.push(cp);
                        continue;
                    }
                    encodeURIComponent(this.value[i]).substring(1).split("%").forEach(function (byteStr) {
                        bytes.push(parseInt(byteStr, 16));
                    });
                }
                return Uint8Array.from(bytes);
            }
            toString() {
                return this.value;
            }
            toNBT() {
                return this.value;
            }
            toJSON() {
                return this.value;
            }
            static isString(v) {
                return (v instanceof NBTString) || (typeof v == "string");
            }
        }
        nbt.NBTString = NBTString;
        class NBTList extends NBTTag {
            value;
            listType;
            constructor(list, type) {
                if (!NBTList.isNBTList(list))
                    throw "NBTList must be constructed from a list of 1 type of NBTTag";
                super(NBTTagType.LIST);
                this.value = [];
                if (list instanceof NBTList) {
                    this.value = list.value.map(x => x.copy());
                    this.listType = list.listType;
                }
                else if (list.length > 0 && list[0] instanceof NBTTag) {
                    if (type == null) {
                        this.listType = list[0].type;
                    }
                    else if (list[0].type !== type) {
                        throw "Mismatched NBTList types";
                    }
                    else {
                        this.listType = type;
                    }
                    for (let x of list) {
                        this.value.push(x.copy());
                    }
                }
                else if (type == null) {
                    throw "Unable to determine list type from the given arguments";
                }
                else {
                    this.listType = type;
                }
                return new Proxy(this, {
                    get(target, p, receiver) {
                        if (Number.isInteger(p))
                            return target.value[Number(p)];
                        return Reflect.get(target, p, receiver);
                    }
                });
            }
            get length() {
                return this.value.length;
            }
            append(tag) {
                this.value.push(tag);
                return this;
            }
            *[Symbol.iterator]() {
                for (let i = 0; i < this.length; i++) {
                    yield this.value[i];
                }
            }
            forEach(f) {
                for (let i = 0; i < this.length; i++) {
                    f(this.value[i], i, this);
                }
            }
            copy() {
                return new NBTList(this.value.map(x => x.copy()), this.listType);
            }
            toByteStream(littleEndian) {
                let bytes = [this.listType];
                function pushNBT(a) {
                    for (let b of a.toByteStream(littleEndian)) {
                        bytes.push(b);
                    }
                }
                pushNBT(new NBTInt(this.length));
                for (let i = 0; i < this.length; i++) {
                    pushNBT(this.value[i]);
                }
                return Uint8Array.from(bytes);
            }
            toNBT() {
                return this.value.map(x => x.toNBT()).toString();
            }
            toJSON() {
                return this.value.map(x => x.toJSON());
            }
            static isNBTList(list) {
                if (list instanceof NBTList)
                    return true;
                if (!Array.isArray(list))
                    return false;
                return isHomogenousArray(list);
            }
        }
        nbt.NBTList = NBTList;
        class NBTCompound extends NBTTag {
            value;
            constructor(obj) {
                super(NBTTagType.COMPOUND);
                this.value = {};
                if (obj instanceof NBTCompound) {
                    for (let entry of obj) {
                        this.value[entry[0]] = entry[1].copy();
                    }
                }
                else if (obj != null) {
                    for (let key in obj) {
                        if (objects.hasOwn(obj, key)) {
                            this.value[key] = obj[key].copy();
                        }
                    }
                }
            }
            has(key) {
                return objects.hasOwn(this.value, key);
            }
            getValue(key) {
                return this.has(key) ? this.value[key] : null;
            }
            getTyped(key, type, listType) {
                if (!this.has(key))
                    return null;
                let val = this.getValue(key);
                if (val == null) {
                    if (type === NBTTagType.COMPOUND || type === NBTTagType.END)
                        return val;
                    throw "Unexpected null value encountered";
                }
                if (type === NBTTagType.LIST) {
                    if (listType == null)
                        throw "List type must be specified when getting a list";
                    let typeStr = "LIST<" + listType + ">";
                    if (val.type !== NBTTagType.LIST)
                        throw `Property "${key}" (${val.type}) is not of type ${typeStr}`;
                    let valListType = val.listType;
                    if (valListType !== listType)
                        throw `Property "${key}" (LIST<${valListType}>) is not of type ${typeStr}`;
                    return val;
                }
                if (val.type !== type)
                    throw `Property "${key}" (${val.type}) is not of type ${type}`;
                return val;
            }
            getByte(key) {
                return this.getTyped(key, NBTTagType.BYTE);
            }
            getShort(key) {
                return this.getTyped(key, NBTTagType.SHORT);
            }
            getInt(key) {
                return this.getTyped(key, NBTTagType.INT);
            }
            getLong(key) {
                return this.getTyped(key, NBTTagType.LONG);
            }
            getFloat(key) {
                return this.getTyped(key, NBTTagType.FLOAT);
            }
            getDouble(key) {
                return this.getTyped(key, NBTTagType.DOUBLE);
            }
            getByteArray(key) {
                return this.getTyped(key, NBTTagType.BYTE_ARRAY);
            }
            getString(key) {
                return this.getTyped(key, NBTTagType.STRING);
            }
            getList(key, listType) {
                return this.getTyped(key, NBTTagType.LIST, listType);
            }
            getCompound(key) {
                return this.getTyped(key, NBTTagType.COMPOUND);
            }
            getIntArray(key) {
                return this.getTyped(key, NBTTagType.INT_ARRAY);
            }
            getLongArray(key) {
                return this.getTyped(key, NBTTagType.LONG_ARRAY);
            }
            getShortArray(key) {
                return this.getTyped(key, NBTTagType.SHORT_ARRAY);
            }
            setValue(key, value) {
                this.value[key] = value.copy();
                return this;
            }
            setValueTyped(key, type, value) {
                if (!(value instanceof NBTTag)) {
                    value = NBTTag.create(type, value);
                }
                return this.setValue(key, value);
            }
            setByte(key, value) {
                return this.setValueTyped(key, NBTTagType.BYTE, value);
            }
            setShort(key, value) {
                return this.setValueTyped(key, NBTTagType.SHORT, value);
            }
            setInt(key, value) {
                return this.setValueTyped(key, NBTTagType.INT, value);
            }
            setLong(key, value) {
                return this.setValueTyped(key, NBTTagType.LONG, value);
            }
            setFloat(key, value) {
                return this.setValueTyped(key, NBTTagType.FLOAT, value);
            }
            setDouble(key, value) {
                return this.setValueTyped(key, NBTTagType.DOUBLE, value);
            }
            setByteArray(key, value) {
                return this.setValueTyped(key, NBTTagType.BYTE_ARRAY, new NBTByteArray(value));
            }
            setString(key, value) {
                return this.setValueTyped(key, NBTTagType.STRING, value);
            }
            setList(key, value) {
                return this.setValueTyped(key, NBTTagType.LIST, value);
            }
            setCompound(key, value) {
                return this.setValueTyped(key, NBTTagType.COMPOUND, value);
            }
            setIntArray(key, value) {
                return this.setValueTyped(key, NBTTagType.INT_ARRAY, new NBTIntArray(value));
            }
            setLongArray(key, value) {
                return this.setValueTyped(key, NBTTagType.LONG_ARRAY, new NBTLongArray(value));
            }
            setShortArray(key, value) {
                return this.setValueTyped(key, NBTTagType.SHORT_ARRAY, new NBTShortArray(value));
            }
            *[Symbol.iterator]() {
                for (let prop in this.value) {
                    if (objects.hasOwn(this, prop))
                        yield [prop, this.value[prop]];
                }
            }
            *keyIterator() {
                for (let entry of this) {
                    yield entry[0];
                }
            }
            *valueIterator() {
                for (let entry of this) {
                    yield entry[1];
                }
            }
            toByteStream(littleEndian) {
                let bytes = [];
                function pushValue(v) {
                    for (let byte of v.toByteStream(littleEndian)) {
                        bytes.push(byte);
                    }
                }
                for (let entry of this) {
                    pushValue(new NBTString(entry[0]));
                    pushValue(entry[1]);
                }
                bytes.push(NBTTagType.END);
                return Uint8Array.from(bytes);
            }
            toJSON() {
                return objects.mapObject(this.value, function (key, value) {
                    return value.toJSON();
                });
            }
            toNBT() {
                return JSON.stringify(objects.mapObject(this.value, function (key, value) {
                    return value.toNBT();
                }));
            }
            copy() {
                return new NBTCompound(this);
            }
            equals(other) {
                if (other instanceof NBTCompound)
                    return this.equals(other.value);
                for (let property of this) {
                    if (!objects.hasOwn(other, property[0]))
                        return false;
                }
                for (let property in other) {
                    if (objects.hasOwn(other, property) && !this.has(property))
                        return false;
                }
                for (let property of this) {
                    if (!this.value[property[0]].equals(other[property[0]])) {
                        console.log("This value of %s is not equal to the other value of %s", property, property);
                        return false;
                    }
                }
                return true;
            }
            equalsStrict(other) {
                return this.equals(other);
            }
            static isNBTCompound(object) {
                if (object instanceof NBTCompound)
                    return true;
                if (typeof object !== "object")
                    return false;
                for (let property in object) {
                    if (!Object.prototype.hasOwnProperty.call(object, property))
                        continue;
                    if (!NBTTag.isValidNBTTag(object[property]))
                        return false;
                }
                return true;
            }
        }
        nbt.NBTCompound = NBTCompound;
        class NBTIntArray extends NBTArrayTag {
            constructor(value) {
                if (Array.isArray(value) && typeof value[0] === "number") {
                    value = value;
                    if (!NBTIntArray.isIntArray(value))
                        throw "Invalid integer array";
                    value = value.map(i => new NBTInt(i));
                }
                super(NBTTagType.INT_ARRAY, value);
            }
            static isIntArray(array) {
                if (!NBTArrayTag.isIntegerArray(array))
                    return false;
                for (let i = 0; i < array.length; i++) {
                    if (!NBTInt.isInt(array[i]))
                        return false;
                }
                return true;
            }
        }
        nbt.NBTIntArray = NBTIntArray;
        class NBTLongArray extends NBTArrayTag {
            constructor(value) {
                if (Array.isArray(value) && typeof value[0] === "bigint") {
                    value = value;
                    if (!NBTLongArray.isLongArray(value))
                        throw "Invalid long array";
                    value = value.map(l => new NBTLong(l));
                }
                super(NBTTagType.LONG_ARRAY, value);
            }
            static isLongArray(array) {
                if (array instanceof NBTArrayTag)
                    return array.type === NBTTagType.LONG_ARRAY;
                return true;
            }
        }
        nbt.NBTLongArray = NBTLongArray;
        class NBTShortArray extends NBTArrayTag {
            constructor(value) {
                if (Array.isArray(value) && typeof value[0] === "number") {
                    value = value;
                    if (!NBTShortArray.isShortArray(value))
                        throw "Invalid short array";
                    value = value.map(s => new NBTShort(s));
                }
                super(NBTTagType.SHORT_ARRAY, value);
            }
            static isShortArray(array) {
                if (!NBTArrayTag.isIntegerArray(array))
                    return false;
                for (let i = 0; i < array.length; i++) {
                    if (!NBTShort.isShort(array[i]))
                        return false;
                }
                return true;
            }
        }
        nbt.NBTShortArray = NBTShortArray;
        function parseNBTFromByteStream(data) {
            let byteIndex = 0;
            function readByte() {
                if (byteIndex >= data.length)
                    throw "End of stream reached";
                let byte = data[byteIndex];
                byteIndex++;
                return byte;
            }
            function readSizedChunk(size) {
                let chunk = new DataView(new ArrayBuffer(size));
                for (let i = 0; i < size; i++) {
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
            function readString() {
                let strlen = readShort();
                let str = "";
                for (let i = 0; i < strlen; i++) {
                    str += String.fromCodePoint(readByte());
                }
                return str;
            }
            function readSizedIntArray(intSize) {
                let array = [];
                let arrayLen = readInt();
                let chunk = readSizedChunk(arrayLen * intSize);
                switch (intSize) {
                    case 1: {
                        for (let i = 0; i < chunk.byteLength; i++) {
                            array.push(chunk.getInt8(0));
                        }
                        break;
                    }
                    case 2: {
                        for (let i = 0; i < chunk.byteLength; i++) {
                            array.push(chunk.getInt16(0));
                        }
                        break;
                    }
                    case 4: {
                        for (let i = 0; i < chunk.byteLength; i++) {
                            array.push(chunk.getInt32(0));
                        }
                        break;
                    }
                    case 8: {
                        for (let i = 0; i < chunk.byteLength; i++) {
                            array.push(chunk.getBigInt64(0));
                        }
                        break;
                    }
                }
                return array;
            }
            function readValue(type) {
                switch (type) {
                    case NBTTagType.END: return new NBTTagEnd();
                    case NBTTagType.BYTE: return new NBTByte(readByte());
                    case NBTTagType.SHORT: return new NBTShort(readShort());
                    case NBTTagType.INT: return new NBTInt(readInt());
                    case NBTTagType.LONG: return new NBTLong(readSizedChunk(8).getBigInt64(0));
                    case NBTTagType.FLOAT: return new NBTFloat(readSizedChunk(4).getFloat32(0));
                    case NBTTagType.DOUBLE: return new NBTDouble(readSizedChunk(8).getFloat64(0));
                    case NBTTagType.BYTE_ARRAY: return new NBTByteArray(readSizedIntArray(1));
                    case NBTTagType.STRING: return new NBTString(readString());
                    case NBTTagType.LIST: {
                        if (byteIndex === data.length - 1)
                            throw "End of nbt byte stream";
                        let listType = readByte();
                        if (listType < 0 || listType > 13)
                            throw "Invalid list type: " + listType.toString();
                        let listLength = readInt();
                        if (listLength < 0)
                            throw "Invalid list length: " + listLength.toString();
                        if (listType === NBTTagType.END)
                            return new NBTList([], listType);
                        let list = [];
                        for (let i = 0; i < listLength; i++) {
                            list.push(readValue(listType));
                        }
                        return new NBTList(list, listType);
                    }
                    case NBTTagType.COMPOUND: {
                        let val = {};
                        while (true) {
                            let tagType = readByte();
                            if (tagType === NBTTagType.END)
                                break;
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
            if (readByte() !== NBTTagType.COMPOUND)
                return root;
            let rootName = readString();
            root.setCompound(rootName, readValue(NBTTagType.COMPOUND));
            return root;
        }
        nbt.parseNBTFromByteStream = parseNBTFromByteStream;
    })(nbt = jango.nbt || (jango.nbt = {}));
    let io;
    (function (io) {
        class ArrayReader {
            data;
            index;
            constructor(array) {
                this.data = array;
                this.index = 0;
            }
            get length() {
                return this.data.length;
            }
            get done() {
                return this.index >= this.length;
            }
            *[Symbol.iterator]() {
                for (; !this.done; this.index++) {
                    yield this.data[this.index];
                }
            }
            read(count = 1) {
                if (!Number.isInteger(count) || count < 1)
                    throw "Argument count on ArrayReader.prototype.read should be a positive integer";
                if (this.done)
                    return undefined;
                let chunk = [];
                for (let i = 0; i < count; i++) {
                    chunk.push(this.data[this.index + i]);
                    this.index++;
                }
                return chunk;
            }
        }
        io.ArrayReader = ArrayReader;
        class StreamReader {
            #dataView;
            position;
            littleEndian;
            constructor(data, littleEndian = true) {
                this.#dataView = new DataView(data);
                this.position = 0;
                this.littleEndian = littleEndian;
            }
            get byteLength() {
                return this.#dataView.byteLength;
            }
            get done() {
                return this.position >= this.byteLength;
            }
            readUint8() {
                return this.#dataView.getUint8(this.position++);
            }
            readInt8() {
                return this.#dataView.getInt8(this.position++);
            }
            readUint16() {
                let ret = this.#dataView.getUint16(this.position);
                this.position += 2;
                return ret;
            }
            readInt16() {
                let ret = this.#dataView.getInt16(this.position);
                this.position += 2;
                return ret;
            }
            readUint32() {
                let ret = this.#dataView.getUint32(this.position);
                this.position += 4;
                return ret;
            }
            readInt32() {
                let ret = this.#dataView.getInt32(this.position);
                this.position += 4;
                return ret;
            }
            readFloat32() {
                let ret = this.#dataView.getFloat32(this.position);
                this.position += 4;
                return ret;
            }
            readFloat64() {
                let ret = this.#dataView.getFloat64(this.position);
                this.position += 8;
                return ret;
            }
            readString(sizeOfLength = 1) {
                let length = 0;
                switch (sizeOfLength) {
                    case 1: {
                        length = this.readUint8();
                        break;
                    }
                    case 2: {
                        length = this.readUint16();
                        break;
                    }
                    case 4: {
                        length = this.readUint32();
                        break;
                    }
                    default: {
                        throw "Invalid byte size for length value: " + sizeOfLength;
                    }
                }
                let str = new TextDecoder().decode(new Uint8Array(this.#dataView.buffer.slice(this.position, this.position + length)));
                this.position += length;
                return str;
            }
            readBoolean() {
                return this.readUint8() != 0;
            }
        }
        io.StreamReader = StreamReader;
        class StreamWriter {
            #data;
            littleEndian;
            constructor(littleEndian = true) {
                this.#data = [];
                this.littleEndian = littleEndian;
            }
            get byteLength() {
                return this.#data.length;
            }
            #writeSizedInt(num, size, signed) {
                if (signed && num < 0) {
                    num += 1 << (size * 8);
                }
                if (this.littleEndian) {
                    for (let i = 0; i < size; i++) {
                        this.#data.push((num >> (i * 8)) & 255);
                    }
                }
                else {
                    for (let i = size - 1; i > -1; i--) {
                        this.#data.push((num >> (i * 8)) & 255);
                    }
                }
            }
            writeUint8(num) {
                this.#writeSizedInt(num, 1, false);
            }
            writeInt8(num) {
                this.#writeSizedInt(num, 1, true);
            }
            writeUint16(num) {
                this.#writeSizedInt(num, 2, false);
            }
            writeInt16(num) {
                this.#writeSizedInt(num, 2, true);
            }
            writeUint32(num) {
                this.#writeSizedInt(num, 4, false);
            }
            writeInt32(num) {
                this.#writeSizedInt(num, 4, true);
            }
            writeFloat32(num) {
                let view = new DataView(new ArrayBuffer(4));
                view.setFloat32(0, num, this.littleEndian);
                for (let i = 0; i < 4; i++) {
                    this.#data.push(view.getUint8(i));
                }
            }
            writeFloat64(num) {
                let view = new DataView(new ArrayBuffer(8));
                view.setFloat64(0, num, this.littleEndian);
                for (let i = 0; i < 8; i++) {
                    this.#data.push(view.getUint8(i));
                }
            }
            writeString(str, sizeOfLength = 1) {
                this.#writeSizedInt(str.length, sizeOfLength, false);
                let strBytes = new TextEncoder().encode(str);
                for (let byte of strBytes) {
                    this.#data.push(byte);
                }
            }
            writeBoolean(b) {
                this.writeUint8(b ? 1 : 0);
            }
            toByteArray() {
                return Uint8Array.from(this.#data);
            }
        }
        io.StreamWriter = StreamWriter;
        async function decompressStream(stream, method = "gzip") {
            let reader = stream.pipeThrough(new DecompressionStream(method)).getReader();
            let bytes = [];
            while (true) {
                let readResult = await reader.read();
                if (readResult.done)
                    break;
                for (let b of readResult.value) {
                    bytes.push(b);
                }
            }
            return bytes;
        }
        io.decompressStream = decompressStream;
        function inputFiles() {
            return new Promise(function (resolve, reject) {
                if (typeof document?.createElement !== "function")
                    reject("Unable to manipulate DOM");
                let fileIn = document.createElement("input");
                fileIn.type = "file";
                fileIn.multiple = true;
                fileIn.oninput = function (event) {
                    if (fileIn.files) {
                        resolve(Array.from(fileIn.files));
                    }
                    else {
                        reject("No files");
                    }
                };
                fileIn.click();
            });
        }
        io.inputFiles = inputFiles;
    })(io = jango.io || (jango.io = {}));
})(jango || (jango = {}));
