export type child_item = {
    a: string,
    b: string,
    c: number,
    d: string|number,
    n: number,
    r?: number,
    j: number,
};
export type db = {
    a: string,
    b: string,
    c: number,
    d: string|number,
    n: number,
    r?: number,
    j: number,
    z: number,
    childBasket: child_item[],
    tmp_inFarsiLetter: string,
    tmp_kalamat: string[],
}[];

export type s = number[];
export type d = [ number, number ][];
export type m = ClusterBox;

export type R = [ number, number, number ];
export type boundLine = number[];
export type boundBox = number[][];
export type Cluster = number[];
export type ClusterBox = Cluster[];

export type source = "Al-Kafi" | "misc" | "mox";

export type Repo = { 
    any: number, 
    uniqe: number, 
    diff: number, 
    seq: number[] 
}