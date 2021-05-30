export type db = {
    a: string,
    b: string,
    c: number,
    d: string|number,
    n: number,

    tmp_inFarsiLetter: string,
    tmp_kalamat: string[],
    childBasket: {
        a: string,
        b: string,
        c: number,
        d: string|number,
        n: number,
        r: number,
    }[],
}[];

export type source = "Al-Kafi" | "misc";