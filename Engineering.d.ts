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