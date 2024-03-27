type UInt8 = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99|100|101|102|103|104|105|106|107|108|109|110|111|112|113|114|115|116|117|118|119|120|121|122|123|124|125|126|127|128|129|130|131|132|133|134|135|136|137|138|139|140|141|142|143|144|145|146|147|148|149|150|151|152|153|154|155|156|157|158|159|160|161|162|163|164|165|166|167|168|169|170|171|172|173|174|175|176|177|178|179|180|181|182|183|184|185|186|187|188|189|190|191|192|193|194|195|196|197|198|199|200|201|202|203|204|205|206|207|208|209|210|211|212|213|214|215|216|217|218|219|220|221|222|223|224|225|226|227|228|229|230|231|232|233|234|235|236|237|238|239|240|241|242|243|244|245|246|247|248|249|250|251|252|253|254|255;
type Int8 = -128|-127|-126|-125|-124|-123|-122|-121|-120|-119|-118|-117|-116|-115|-114|-113|-112|-111|-110|-109|-108|-107|-106|-105|-104|-103|-102|-101|-100|-99|-98|-97|-96|-95|-94|-93|-92|-91|-90|-89|-88|-87|-86|-85|-84|-83|-82|-81|-80|-79|-78|-77|-76|-75|-74|-73|-72|-71|-70|-69|-68|-67|-66|-65|-64|-63|-62|-61|-60|-59|-58|-57|-56|-55|-54|-53|-52|-51|-50|-49|-48|-47|-46|-45|-44|-43|-42|-41|-40|-39|-38|-37|-36|-35|-34|-33|-32|-31|-30|-29|-28|-27|-26|-25|-24|-23|-22|-21|-20|-19|-18|-17|-16|-15|-14|-13|-12|-11|-10|-9|-8|-7|-6|-5|-4|-3|-2|-1|0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99|100|101|102|103|104|105|106|107|108|109|110|111|112|113|114|115|116|117|118|119|120|121|122|123|124|125|126|127;

export namespace object {
    /**
     * Shortened version of Object.prototype.hasOwnProperty.call
     * @param obj 
     * @param property 
     */
    export function hasOwn(obj: object, property: PropertyKey): boolean;

    export interface Tuple<T = any> {
        [index: number]: T;
        readonly length: number;
        [Symbol.iterator]: Iterator<T>;
    }
    interface TupleConstructor<T = any> {
        new(...values: T[]): Tuple<T>;
        new(array: T[]): Tuple<T>;
        (...values: T[]): Tuple<T>;
        (array: T[]): Tuple<T>;
    }
    export const Tuple: Tuple;
    
    type RawEnum = {[key: string]: string | number};
    export interface Enum<T extends RawEnum> extends Readonly<Pick<T>> {
        members(): Array<keyof T>;
        getNameForValue(value: string | number): string | null;
    }
    interface EnumConstructor {
        new<T extends RawEnum>(obj: T): Enum<T>;
        <T extends RawEnum>(obj: T): Enum<T>;
    }
    export const Enum: EnumConstructor;

    export interface CallableObject<T extends (...args: any[]) => any> {
        (...args: Parameters<T>): ReturnType<T>;
        apply(thisArg: any, argArray: Parameters<T>): ReturnType<T>;
        bind(thisArg: any, ...args: Parameters<T>): CallableObject<T>;
        call(thisArg: any, ...args: Parameters<T>): ReturnType<T>;
    }
    interface CallableObjectConstructor {
        new<T extends (...args: any[]) => any>(func: T): CallableObject<T>;
        <T extends (...args: any[]) => any>(func: T): CallableObject<T>;
    }
    export const CallableObject: CallableObjectConstructor;
}

export namespace math {
    interface ShapeInfo3d {
        volume: number;
        surfaceArea: number;
    }
    
    export const PI: 3.14159265358979323846;
    export const TAU: 6.28318520717958647692;
    export const E: 2.718281828459045;
    
    export function gcd(a: number, b: number): number;
    export function lcm(a: number, b: number): number;
    export function makeFraction(floatNumber: number): Fraction;
    export function factorial(x: number): number;
    
    export function mean(...data: number[]): number;
    export function median(...data: number[]): number;
    export function mode(...data: any[]): any;
    export function frequency(value: any, ...data: any[]): number;
    export function stdDevSample(...data: number[]): number;
    export function stdDevPopulation(...data: number[]): number;
    export function areaRegularPolygon(sideLength: number, numSides: number): number;
    
    export function cubeInfo(sideLength: number): ShapeInfo3d;
    export function rectangularPrismInfo(length: number, width: number, height: number): ShapeInfo3d;
    export function coneInfo(baseRadius: number, height: number): ShapeInfo3d;
    export function pyramid4Info(baseLength: number, baseWidth: number, height: number): ShapeInfo3d;
    export function sphereInfo(radius: number): ShapeInfo3d;
    export function cylinderInfo(baseRadius: number, height: number): ShapeInfo3d;
    
    export function binomialProbability(successChance: number, successCount: number, totalTries: number): number;
    export function probabilityOfHappening(chance: number, tries: number): number;
    
    export function isInt(num: number): boolean;
    export function isSquare(num: number): boolean;
    export function isFactor(num: number, potentialFactor: number): boolean;
    export function getFactors(num: number): {[x: number]: number};
    export function getFactorList(num: number): number[];
    
    export function csc(num: number): number;
    export function sec(num: number): number;
    export function cot(num: number): number;
    export function acsc(num: number): number;
    export function asec(num: number): number;
    export function acot(num: number): number;
    
    export function logBase(num: number, base: number): number;
    
    export function summation(func: (x: number) => number, min: number, max: number): number;
    export function summation(nums: number[]): number;
    export function product(func: (x: number) => number, min: number, max: number): number;
    export function product(nums: number[]): number;
    export function exponentToString(exponent: number, useUnicodeCharacters?: boolean): string;
    export function variableToString(coefficient: number, symbol: string, exponent?: number, useUnicodeCharacters?: boolean): string;
    
    export interface ComplexNumber {
        real: number;
        imaginary: number;
    
        copy(): ComplexNumber;
        addSelf(x: number | ComplexNumber): ComplexNumber;
        addCopy(x: number | ComplexNumber): ComplexNumber;
        subtractSelf(x: number | ComplexNumber): ComplexNumber;
        subtractCopy(x: number | ComplexNumber): ComplexNumber;
        multiplySelf(x: number | ComplexNumber): ComplexNumber;
        multiplyCopy(x: number | ComplexNumber): ComplexNumber;
        divideSelf(x: number | ComplexNumber): ComplexNumber;
        divideCopy(x: number | ComplexNumber): ComplexNumber;
    
        toString(useUnicodeCharacters?: boolean): string;
        valueOf(strict: boolean): number;
    }
    interface ComplexNumberConstructor {
        new(real: number, imaginary?: number): ComplexNumber;
        new(other: ComplexNumber): ComplexNumber;
        new(): ComplexNumber;
        (real: number, imaginary?: number): ComplexNumber;
        (other: ComplexNumber): ComplexNumber;
        (): ComplexNumber;
    
        readonly IMAGINARY_SYMBOL: "𝑖";
        strictConversionDefault: boolean;
    }
    export const ComplexNumber: ComplexNumberConstructor;

    export interface Point {
        x: number;
        y: number;
    }
    interface PointConstructor {
        new(x: number, y: number): Point;
        new(other: Point | [number, number]): Point;
        (x: number, y: number): Point;
        (other: Point | [number, number]): Point;
        
        isPoint(value: unknown): value is (Point | [number, number]);
        cast(value: Point | [number, number]): Point;
    }
    export const Point: Point;

    export interface LinearEquation {
        m: number;
        b: number;

        readonly xIntercept: number;
        whenEqualTo(value: number | LinearEquation): number;
        (x: number): number;
    }
    interface LinearEquationConstructor {
        new(slope: number, yIntercept?: number): LinearEquation;
        new(other: LinearEquation): LinearEquation;
        (slope: number, yIntercept?: number): LinearEquation;
        (other: LinearEquation): LinearEquation;

        cast(value: any): LinearEquation;
        isLinearEquation(value: unknown): value is LinearEquation;
    }
    export const LinearEquation: LinearEquationConstructor;

    interface FractionRaw {
        numerator?: number;
        denominator?: number;
        n?: number;
        d?: number;
    }

    export interface Fraction {
        n: number;
        d: number;
        readonly numberValue: number;
        readonly reciprocal: number;

        equivalent(newDeno: number): Fraction;
        equals(x: FractionRaw | number): boolean;
        add(x: Fraction | number): Fraction;
    }
    interface FractionConstructor {
        new(numerator: number, denominator: number): Fraction;
        new(num: number): Fraction;
        new(str: string): Fraction;
        new(other: FractionRaw): Fraction;
        (numerator: number, denominator: number): Fraction;
        (num: number): Fraction;
        (str: string): Fraction;
        (other: FractionRaw): Fraction;

        isFraction(value: unknown): value is FractionRaw;
        copy(frac: FractionRaw): Fraction;
        fromNumber(num: number): Fraction;
        parse(str: string): Fraction;
    }
    export const Fraction: FractionConstructor;
}

export namespace string {
    export const LATIN_UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    export const LATIN_LOWERCASE: "abcdefghijklmnopqrstuvwxyz";
    export const DIGITS: "0123456789";

    /**
     * Modify the characters of a string
     * 
     * @param str The string to transform
     * @param charModifier The function that modifies the characters
     */
    export function toCharSet(str: string, charModifier: (char: string) => string): string;
    /**
     * Modify the characters of a string
     * 
     * @param str The string to transform
     * @param charDict The map that determines what output string corresponds to each character
     * @param keepUnmappedChars Whether or not the characters not included in the dictionary should be kept. Defaults to ```true```
     */
    export function toCharSet(str: string, charDict: {[char: string]: string}, keepUnmappedChars?: boolean): string
    /**
     * Modify the characters of a string.
     * 
     * 𝖄𝖔𝖚𝖗 𝖙𝖊𝖝𝖙 𝖜𝖎𝖑𝖑 𝖑𝖔𝖔𝖐 𝖑𝖎𝖐𝖊 𝖙𝖍𝖎𝖘
     * 
     * @param str The string to transform
     * @param charSet The name of a character set to use
     */
    export function toCharSet(str: string, charSet: "OLD_ENGLISH"): string;
    /**
     * Modify the characters of a string.
     * 
     * 𝕐𝕠𝕦𝕣 𝕥𝕖𝕩𝕥 𝕨𝕚𝕝𝕝 𝕝𝕠𝕠𝕜 𝕝𝕚𝕜𝕖 𝕥𝕙𝕚𝕤
     * 
     * @param str The string to transform
     * @param charSet The name of a character set to use
     */
    export function toCharSet(str: string, charSet: "DOUBLESTRUCK"): string;
    /**
     * Translate a string into the Standard Galactic Alphabet (Minecraft enchanting table language)
     * 
     * ‖フ⚍∷ 𐔕ꛚ̇/𐔕 ∴¦ꖎꖎ ꖎフフꖌ ꖎ¦ꖌꛚ 𐔕〒¦ᓭ
     * 
     * @param str The string to transform
     * @param charSet The name of a character set to use
     */
    export function toCharSet(str: string, charSet: "GALACTIC"): string;

    export function isLowerCase(str: string): boolean;
    export function isUpperCase(str: string): boolean;
    export function isAlpha(str: string): boolean;
    export function isNumeric(str: string): boolean;
    export function isAlphanumeric(str: string): boolean;

    /**
     * Converts a country code into a flag.
     * 
     * Doesn't render on Windows.
     * @example toFlagChar("PL") === "🇵🇱"
     * @param {string} countryCode
     * @returns {string} The desired flag (or a tiny version of the inputted string on Windows).
     */
    export function toFlagChar(countryCode): string;

    export function isValidUTF8CodePoint(codePoint: number): boolean;
    /**
     * If ```codePoint``` is less than 0x10000 (65536) this just returns the inputted codepoint.
     * Otherwise, the codepoint is converted to a UTF-16 surrogate pair
     * @param codePoint The Unicode codepoint to convert to UTF-16
     */
    export function codePointToUTF16Pair(codePoint: number): number | [number, number];
    /**
     * Convert a UTF-16 surrogate pair into a Unicode codepoint.
     * @param hi The high order surrogate (a number from 0xd800 (55296) to 0xdbff (56319))
     * @param lo The low order surrogate (a number from 0xdc00 (56320) to 0xdfff (57343))
     */
    export function utf16PairToCodePoint(hi: number, lo: number): number;
    export function codepointToUTF8Bytes(codePoint: number): [UInt8] | [UInt8, UInt8] | [UInt8, UInt8, UInt8] | [UInt8, UInt8, UInt8, UInt8];

    export function getCodepoints(str: string): number[];
    export function getCharCodes(str: string): number[];
    export function getUTF8Bytes(str: string): UInt8[];
    export function getUTF16Bytes(str: string): number[];
}

export namespace engineering {
    export const PressureUnit: {
        ATMOSPHERES: 1,
        BAR: 1.01325,
        FEET_H2O: 33.9,
        IN_MERCURY: 29.92,
        MM_MERCURY: 760,
        PASCALS: 101.325,
        PSI: 14.7
    };
    
    type PressureUnit = keyof typeof PressureUnit;
    type TemperatureUnit = "CELCIUS" | "FAHRENHEIT" | "KELVIN" | "RANKIN";
    
    export function convertTemp(tempIn: number, typeIn: TemperatureUnit, typeOut: TemperatureUnit): number;
    export function convertPressure(value: number, typeIn: PressureUnit, typeOut: PressureUnit): number;
}

export namespace nbt {
    export const NBTTagType: {
        readonly END: 0;
        readonly BYTE: 1;
        readonly SHORT: 2;
        readonly INT: 3;
        readonly LONG: 4;
        readonly FLOAT: 5;
        readonly DOUBLE: 6;
        readonly BYTE_ARRAY: 7;
        readonly STRING: 8;
        readonly LIST: 9;
        readonly COMPOUND: 10;
        readonly INT_ARRAY: 11;
        readonly LONG_ARRAY: 12;
        readonly SHORT_ARRAY: 13;
    }
    type TagType = keyof typeof NBTTagType | "NONE";
    
    interface NBTTag<ValueType = undefined> {
        readonly type: GetTagType<typeof this>;
        value: ValueType;
        equals(other: any): boolean;
        equalsStrict(other: any): boolean;
        toByteStream(): Uint8Array;
        toNBT(): any;
        toNBTString(): string;
        toJSON(): any;
    }
    
    type NBTType = number | string | NBTTag | number[] | NBTCompoundRaw | NBTListRaw;
    type GetTagType<T extends NBTTag> = T extends NBTByte ? "BYTE" :
        T extends NBTShort ? "SHORT" :
        T extends NBTInt ? "INT" :
        T extends NBTLong ? "LONG" :
        T extends NBTFloat ? "FLOAT" :
        T extends NBTDouble ? "DOUBLE" :
        T extends NBTByteArray ? "BYTE_ARRAY" :
        T extends NBTString ? "STRING" :
        T extends NBTList ? "LIST" :
        T extends NBTCompound ? "COMPOUND" :
        T extends NBTIntArray ? "INT_ARRAY" :
        T extends NBTLongArray ? "LONG_ARRAY" :
        T extends NBTShortArray ? "SHORT_ARRAY" :
        "NONE";
    type ReverseGetTagType<T extends TagType, ListType extends TagType = "NONE"> = T extends "BYTE" ? NBTByte :
        T extends "SHORT" ? NBTShort :
        T extends "INT" ? NBTInt :
        T extends "LONG" ? NBTLong :
        T extends "FLOAT" ? NBTFloat :
        T extends "DOUBLE" ? NBTDouble :
        T extends "BYTE_ARRAY" ? NBTByteArray :
        T extends "STRING" ? NBTString :
        T extends "LIST" ? NBTList<ReverseGetTagType<ListType>> :
        T extends "COMPOUND" ? NBTCompound :
        T extends "INT_ARRAY" ? NBTIntArray :
        T extends "LONG_ARRAY" ? NBTLongArray :
        T extends "SHORT_ARRAY" ? NBTShortArray :
        NBTTag;
    interface NBTCompoundRaw {
        [property: string]: NBTType;
    }
    type NBTListRaw = NBTType[];
    
    type NBTTagConstructorArg<T extends NBTTag> = T | T["value"];
    
    interface NBTTagConstructor {
        new(): NBTTag;
        (): NBTTag;
        isValidNBTTag(value: any): boolean;
        getTagTypeForValue(value: any): TagType | never;
        create(type: TagType | null): NBTTag;
        fromNBT(value: NBTTag | string | number | NBTTag[] | string[] | number[]): NBTTag;
    }
    
    interface NBTNumberTag extends NBTTag<number> {
        value: number;
        valueOf(): number;
        toString(radix?: number): string;
    }
    
    interface NBTByte extends NBTNumberTag {}
    interface NBTByteConstructor {
        new(byte: NBTByte | number): NBTByte;
        (byte: NBTByte | number): NBTByte;
        /**
         * Check if a value is a valid NBT byte
         * @param value The thing to check
         * @returns if ```value``` is of type NBTByte or is an 8 bit signed integer
         */
        isByte(value: any): boolean;
    }
    
    interface NBTShort extends NBTNumberTag {}
    interface NBTShortConstructor {
        new(short: NBTShort | number): NBTShort;
        (short: NBTShort | number): NBTShort;
        /**
         * Check if a value is a valid NBT short
         * @param value The thing to check
         * @returns if ```value``` is of type NBTShort or is a 16 bit signed integer
         */
        isShort(value: any): boolean;
    }
    
    interface NBTInt extends NBTNumberTag {}
    interface NBTIntConstructor {
        new(int: NBTInt | number): NBTInt;
        (int: NBTInt | number): NBTInt;
        /**
         * Check if a value is a valid NBT int
         * @param value The thing to check
         * @returns if ```value``` is of type NBTInt or is a 32 bit signed integer
         */
        isInt(value: any): boolean;
    }
    
    interface NBTLong extends NBTNumberTag {
        value: bigint;
        valueOf(): bigint;
    }
    interface NBTLongConstructor {
        new(long: NBTLong | bigint): NBTLong;
        (long: NBTLong | bigint): NBTLong;
        /**
         * Check if a value is a valid NBT long
         * @param value The thing to check
         * @returns if ```value``` is of type NBTLong or is a 64 bit signed integer
         */
        isLong(value: any): boolean;
    }
    
    interface NBTFloat extends NBTNumberTag {}
    interface NBTFloatConstructor {
        new(float: NBTFloat | number): NBTFloat;
        (float: NBTFloat | number): NBTFloat;
        /**
         * Check if a value is a valid NBT float
         * @param value The thing to check
         * @returns if ```value``` is of type NBTFloat or is a 32 bit floating point number
         */
        isFloat(value: any): boolean;
    }
    
    interface NBTDouble extends NBTNumberTag {}
    interface NBTDoubleConstructor {
        new(double: NBTDouble | number): NBTDouble;
        (double: NBTDouble | number): NBTDouble;
        /**
         * Check if a value is a valid NBT double
         * @param value The thing to check
         * @returns if ```value``` is of type NBTDouble or is a 64 bit floating point number
         */
        isDouble(value: any): boolean;
    }
    
    interface NBTArrayTag<T extends NBTNumberTag> extends NBTTag<T[]> {
        at(index: number): T;
        set(index: number, value: T): void;
    }
    type NBTByteArray = NBTArrayTag<NBTByte>;

    interface NBTString extends NBTTag<string> {
        readonly length: number;
        charAt(index: number): string;
        codePointAt(index: number): number;
        setCharAt(index: number, char: string): void;
        append(str: string): void;
        substring(start: number, end?: number): NBTString;
    }
    interface NBTStringConstructor {
        new(str: NBTString | string): NBTString;
        (str: NBTString | string): NBTString;
        isString(value: unknown): value is (NBTString | string);
    }

    interface NBTList<T extends NBTTag> extends NBTTag<T[]> {
        readonly length: number;
        value: T[];
        listType: GetTagType<T>;
        at(index: number): T;
        set(index: number, value: T): void;
        append(value: T): void;
        [Symbol.iterator](): Iterator<T, undefined>;
        forEach(f: (value: T, index: number, array: NBTList<T>) => void): void;
    }
    interface NBTListConstructor {
        new (list: number[] | NBTByte[], type: "BYTE" | 1): NBTList<NBTByte>;
        new (list: number[] | NBTShort[], type: "SHORT" | 2): NBTList<NBTShort>;
        new (list: number[] | NBTInt[], type: "INT" | 3): NBTList<NBTInt>;
        new (list: number[] | NBTLong[], type: "LONG" | 4): NBTList<NBTLong>;
        new (list: number[] | NBTFloat[], type: "FLOAT" | 5): NBTList<NBTFloat>;
        new (list: number[] | NBTDouble[], type: "DOUBLE" | 6): NBTList<NBTDouble>;
        new (list: string[] | NBTString[], type: "STRING" | 8): NBTList<NBTString>;
        new (list: NBTCompoundRaw[] | NBTCompound[], type: "COMPOUND" | 10): NBTList<NBTCompound>;
        new (list: NBTTag[] | number[] | string[] | NBTCompoundRaw[]): NBTList<GetTagType<typeof list[0]>>;
        
        (list: number[] | NBTByte[], type: "BYTE" | 1): NBTList<NBTByte>;
        (list: number[] | NBTShort[], type: "SHORT" | 2): NBTList<NBTShort>;
        (list: number[] | NBTInt[], type: "INT" | 3): NBTList<NBTInt>;
        (list: number[] | NBTLong[], type: "LONG" | 4): NBTList<NBTLong>;
        (list: number[] | NBTFloat[], type: "FLOAT" | 5): NBTList<NBTFloat>;
        (list: number[] | NBTDouble[], type: "DOUBLE" | 6): NBTList<NBTDouble>;
        (list: string[] | NBTString[], type: "STRING" | 8): NBTList<NBTString>;
        (list: NBTCompoundRaw[] | NBTCompound[], type: "COMPOUND" | 10): NBTList<NBTCompound>;
        (list: NBTTag[] | number[] | string[] | NBTCompoundRaw[]): NBTList<GetTagType<typeof list[0]>>;

        isNBTList(value: unknown): boolean;
    }

    interface NBTCompound extends NBTTag<NBTCompoundRaw> {
        keys(): string[];
        entries(): [string, NBTTag][];
        get(key: string): NBTTag | null;
        getTyped(key: string, type: "BYTE"): NBTByte | null;
        getTyped(key: string, type: "SHORT"): NBTShort | null;
        getTyped(key: string, type: "INT"): NBTInt | null;
        getTyped(key: string, type: "LONG"): NBTLong | null;
        getTyped(key: string, type: "FLOAT"): NBTFloat | null;
        getTyped(key: string, type: "DOUBLE"): NBTDouble | null;
        getTyped(key: string, type: "BYTE_ARRAY"): NBTByteArray | null;
        getTyped(key: string, type: "STRING"): NBTString | null;
        getTyped(key: string, type: "LIST", listType: "FLOAT"): NBTList<NBTFloat> | null;
        getTyped(key: string, type: "LIST", listType: "DOUBLE"): NBTList<NBTDouble> | null;
        getTyped(key: string, type: "LIST", listType: "STRING"): NBTList<NBTString> | null;
        getTyped(key: string, type: "LIST", listType: "LIST"): NBTList<NBTList<NBTTag>> | null;
        getTyped(key: string, type: "LIST", listType: "COMPOUND"): NBTList<NBTCompound> | null;
        getTyped(key: string, type: "COMPOUND"): NBTCompound | null;
        getTyped(key: string, type: "INT_ARRAY"): NBTIntArray | null;
        getTyped(key: string, type: "LONG_ARRAY"): NBTLongArray | null;
        getTyped(key: string, type: "SHORT_ARRAY"): NBTShortArray | null;
        set(key: string, value: NBTTag): void;
        setByte(key: string, value: NBTByte | number): void;
        setShort(key: string, value: NBTShort | number): void;
        setInt(key: string, value: NBTInt | number): void;
        setLong(key: string, value: NBTLong | number): void;
        setFloat(key: string, value: NBTFloat | number): void;
        setDouble(key: string, value: NBTDouble | number): void;
        setString(key: string, value: NBTString | string): void;
    }
    interface NBTCompoundConstructor {
        new(compound: NBTCompound | NBTCompoundRaw): NBTCompound;
        new(): NBTCompound;
        (compound: NBTCompound | NBTCompoundRaw): NBTCompound;
        (): NBTCompound;
        isNBTCompound(x: unknown): boolean;
    }

    type NBTIntArray = NBTArrayTag<NBTInt>;
    type NBTShortArray = NBTArrayTag<NBTShort>;
    type NBTLongArray = NBTArrayTag<NBTLong>;
    
    export const NBTTag: NBTTagConstructor;
    export const NBTByte: NBTByteConstructor;
    export const NBTShort: NBTShortConstructor;
    export const NBTInt: NBTIntConstructor;
    export const NBTLong: NBTLongConstructor;
    export const NBTFloat: NBTFloatConstructor;
    export const NBTDouble: NBTDoubleConstructor;
    export const NBTString: NBTStringConstructor;
    export const NBTList: NBTListConstructor;
    export const NBTCompound: NBTCompoundConstructor;
    export function parseNBTFromByteStream(data: number[]): NBTCompound;
}

export interface ArrayReader {
    readonly length: number;
    readonly done: boolean;
    [Symbol.iterator]: Iterator<any, undefined>;
    read(count?: number): any | any[];
}

interface ArrayReaderConstructor {
    new(array: any[]): ArrayReader;
    (array: any[]): ArrayReader;
}

export const ArrayReader: ArrayReaderConstructor;
export function decompressStream(stream: ReadableStream, method?: "gzip" | "deflate" | "deflate-raw"): number[];