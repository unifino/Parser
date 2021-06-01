export type db = {
    a: string,
    b: string,
    c: number,
    d: string|number,
    n: number,
    z: number,

    tmp_inFarsiLetter: string,
    tmp_kalamat: string[],
    childBasket: {
        a: string,
        b: string,
        c: number,
        d: string|number,
        n: number,
        r?: number,
        j: number,
    }[],
    j: number,

}[];

export type s = number[];
export type d = [ number, number ][];
export type m = number[][];

export type R = [ number, number, number ];
export type boundBox = { [key: string]: number[] };
export type Cluster = number[];
export type ClusterBox = Cluster[];

export type source = "Al-Kafi" | "misc" | "mox";