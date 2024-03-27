declare class TerrariaItem {
    id: number;
    count: number;
    modifier: number | null;

    constructor(bufferOrId: Uint8Array | number[] | number, count?: number, modifier?: number | null);

    serialize(): number[];
}

declare class TerrariaPlayer {
    name: string;
    hairStyle: number;
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    hairColor: number;
    skinColor: number;
    eyeColor: number;
    shirtColor: number;
    undershirtColor: number;
    pantsColor: number;
    shoeColor: number;
    inventory: Array<TerrariaItem | null>;
    coins: Array<TerrariaItem | null>;
    ammo: Array<TerrariaItem | null>;
    pet: TerrariaItem | null;
    lightPet: TerrariaItem | null;
    minecart: TerrariaItem | null;
    mount: TerrariaItem | null;
    grapple: TerrariaItem | null;

    constructor(buffer: Uint8Array | number[]);

    serialize(): number[];
}