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
interface NBTTag {
    readonly type: "NONE";
    value: undefined;
    toByteStream(): Uint8Array;
}

type NBTType = number | string | NBTTag | number[] | NBTCompoundRaw | NBTListRaw;
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
}

interface NBTNumberTag extends NBTTag {
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

interface NBTArrayTag<T extends NBTNumberTag> extends NBTTag {
    at(index: number): T;
    set(index: number, value: T): void;
}

export const NBTTag: NBTTagConstructor;
export const NBTByte: NBTByteConstructor;
export const NBTShort: NBTShortConstructor;
export const NBTInt: NBTIntConstructor;
export const NBTLong: NBTLongConstructor;
export const NBTFloat: NBTFloatConstructor;
export const NBTDouble: NBTDoubleConstructor;