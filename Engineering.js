/**
 * 
 * @param {number} tempIn 
 * @param {"CELCIUS" | "FAHRENHEIT" | "KELVIN" | "RANKIN"} typeIn 
 * @param {"CELCIUS" | "FAHRENHEIT" | "KELVIN" | "RANKIN"} typeOut 
 * @returns 
 */
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

/**
 * 
 * @param {{[unit: string]}} conversionTable 
 * @returns {(value, typeIn: string, typeOut: string) => number}
 */
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

/**
 * 
 * @param {number} value 
 * @param {"ATMOSPHERES" | "BAR" | "FEET_H2O" | "IN_MERCURY" | "MM_MERCURY" | "PASCALS" | "PSI"} typeIn 
 * @param {"ATMOSPHERES" | "BAR" | "FEET_H2O" | "IN_MERCURY" | "MM_MERCURY" | "PASCALS" | "PSI"} typeOut 
 * @returns {number}
 */
function convertPressure(value, typeIn, typeOut) {
    return __convPressure(value, typeIn, typeOut);
}

let xPorts = {convertTemp, PressureUnit, convertPressure};
if(typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = xPorts;
} else if(window.jango && !window.jango.engineering) {
    window.jango.engineering = xPorts;
}