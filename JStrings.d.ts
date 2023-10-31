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