(function(window) {
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
    function codePointToUTF16Pair(cp) {
        cp -= 0x10000;
        return [0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff)];
    }
    function utf16PairToCodePoint(hi, lo) {
        return (((hi - 0xd800) << 10) | (lo - 0xdc00)) + 0x10000;
    }

    const EXPORTS = {LATIN_UPPERCASE, LATIN_LOWERCASE, DIGITS, toCharSet, isLowerCase, isUpperCase, isAlpha, isNumeric, isAlphanumeric,
        toFlagChar};
    if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = EXPORTS;
    }
    window.jango = window.jango || {};
    window.jango.string = EXPORTS;
})(this || globalThis);
Number.prototype.toEnglishWord = function(){
    if(this < 0)
        return "Negative " + (-this).toEnglishWord();
    switch(this + 0){
        case 0: return "zero";
        case 1: return "one";
        case 2: return "two";
        case 3: return "three";
        case 4: return "four";
        case 5: return "five";
        case 6: return "six";
        case 7: return "seven";
        case 8: return "eight";
        case 9: return "nine";
        case 10: return "ten";
        case 11: return "eleven";
        case 12: return "twelve";
        case 13: return "thirteen";
        case 14: return "fourteen";
        case 15: return "fifteen";
        case 16: return "sixteen";
        case 17: return "seventeen";
        case 18: return "eighteen";
        case 19: return "nineteen";
        default: break;
    }
    if(this >= 1e9){
        var str = Math.floor(this / 1e9).toEnglishWord() + " billion";
        if(this % 1e9 !== 0){
            str += ", " + (this % 1e9).toEnglishWord();
        }
        return str;
    }
    if(this >= 1e6){
        var str = Math.floor(this / 1e6).toEnglishWord() + " million";
        if(this % 1e6 !== 0){
            str += ", " + (this % 1e6).toEnglishWord();
        }
        return str;
    }
    if(this >= 1000){
        var str = Math.floor(this / 1000).toEnglishWord() + " thousand";
        if(this % 1000 !== 0){
            str += ", " + (this % 1000).toEnglishWord();
        }
        return str;
    }
    if(this >= 100){
        var str = Math.floor(this / 100).toEnglishWord() + " hundred";
        if(this % 100 !== 0){
            str += " " + (this % 100).toEnglishWord();
        }
        return str;
    }
    if(this >= 20){
        var str = "", tens = Math.floor(this / 10);
        switch(tens){
            case 2: {
                str = "twenty";
                break;
            }
            case 3: {
                str = "thirty";
                break;
            }
            case 4: {
                str = "forty";
                break;
            }
            case 5: {
                str = "fifty";
                break;
            }
            case 8: {
                str = "eighty";
                break;
            }
            case 6:
            case 7:
            case 9: {
                str = tens.toEnglishWord() + "ty";
                break;
            }
        }
        if(this % 10 !== 0){
            str += " " + (this % 10).toEnglishWord();
        }
        return str;
    }
}

Number.prototype.toPolishWord = function(){
    if(this < 0)
        return "Minus " + (-this).toPolishWord();
    switch(this + 0){
        case 0: return "zero";
        case 1: return "jeden";
        case 2: return "dwa";
        case 3: return "trzy";
        case 4: return "cztery";
        case 5: return "pięć";
        case 6: return "sześć";
        case 7: return "siedem";
        case 8: return "osiem";
        case 9: return "dziewięć";
        case 10: return "dziesięć";
        case 11: return "jedenaście";
        case 12:
        case 13:
        case 17:
        case 18: return Math.floor(this % 10).toPolishWord() + "naście";
        case 14: return "czternaście";
        case 15: return "piętnaście";
        case 16: return "szesnaście";
        case 19: return "dziewiętnaście";
        default: break;
    }
    if(this >= 1e9){
        var billions = Math.floor(this / 1e9);
        var str = billions.toPolishWord() + " ";
        if(billions === 1){
            str += " bilion";
        } else {
            var billionsLastDigit = billions % 10;
            switch(billionsLastDigit){
                case 2:
                case 3:
                case 4: {
                    str += "miliardy";
                    break;
                }
                default: {
                    str += "miliardów";
                    break;
                }
            }
        }
        if(this % 1e9 !== 0){
            str += ", " + (this % 1e9).toPolishWord();
        }
        return str;
    }
    if(this >= 1e6){
        var millions = Math.floor(this / 1e6);
        var str = millions.toPolishWord() + " milion";
        switch(millions){
            case 1: break;
            case 2:
            case 3:
            case 4: {
                str += "y";
                break;
            }
            default: {
                str += "ów";
                break;
            }
        }
        if(this % 1e6 !== 0){
            str += ", " + (this % 1e6).toPolishWord();
        }
        return str;
    }
    if(this >= 1000){
        var thousands = Math.floor(this / 1000);
        var str = "";
        if(thousands === 1){
            str = "tysiąc";
        } else {
            str += thousands.toPolishWord() + " ";
            switch(thousands){
                case 2:
                case 3:
                case 4: {
                    str += "tysiące";
                    break;
                }
                default: {
                    str += "tysięcy";
                    break;
                }
            }
        }
        if(this % 1000 !== 0){
            str += ", " + (this % 1000).toPolishWord();
        }
        return str;
    }
    if(this >= 100){
        var str = "", hundreds = Math.floor(this / 100);
        switch(hundreds){
            case 1: {
                str = "sto";
                break;
            }
            case 2: {
                str = "dwieście";
                break;
            }
            case 3:
            case 4: {
                str = hundreds.toPolishWord() + "sta";
                break;
            }
            default: {
                str = hundreds.toPolishWord() + "set";
                break;
            }
        }
        if(this % 100 !== 0){
            str += " " + (this % 100).toPolishWord();
        }
        return str;
    }
    if(this >= 20){
        var str = "", tens = Math.floor(this / 10);

        switch(tens){
            case 2: {
                str = "dwadzieścia";
                break;
            }
            case 3: {
                str = "trzydzieści";
                break;
            }
            case 4: {
                str = "czterdzieści";
                break;
            }
            default: {
                str = tens.toPolishWord() + "dziesiąt";
                break;
            }
        }

        if(this % 10 !== 0){
            str += " " + (this % 10).toPolishWord();
        }
        return str;
    }
}