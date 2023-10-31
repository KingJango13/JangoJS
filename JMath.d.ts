interface Fraction {
    numerator: number;
    denominator: number;
}
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

interface ComplexNumber {
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