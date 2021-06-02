export type db_item = {
    a: string,
    b: string,
    c: number,
    d: string|number,
    n: number,
    j: number,
    tmp_inFarsiLetter: string,
    tmp_kalamat: string[],
    cDB: child_item[]
};
export type db = db_item[];

// .. ======================================================================

export type child_item = {
    a: string,
    b: string,
    c: number,
    d: string|number,
    j: number,
};
export type cDB = { [key: number]: child_item[] };

// .. ======================================================================

export type s = number[];
export type d = [ number, number ][];
export type m = ClusterBox;

// .. ======================================================================

export type R = [ number, number, number ];
export type boundLine = number[];
export type boundBox = number[][];
export type Cluster = number[];

export type ClusterBox = Cluster[];
export type RichCluster = {
    isKafi: boolean
    index: number,
    length: number
}[];
export type RichClusterBox = RichCluster[];

// .. ======================================================================

export type source = 
      "الکافی"
    | "غررالحکم"
    | "متفرقه"
    | "cDB"
    | "نهج‌الفصاحة"
    | "نهج‌البلاغة"
    | "كنز‌العمّال"
    | "بحار‌الأنوار"
    | "تحف‌العقول"
    | "وسائل‌الشيعه"
    ;

export type bookKeys = { [key in source]: string[] };

// .. ======================================================================

export type Repo = {
    any: number,
    uniqe: number,
    diff: number,
    seq: number[]
}

// .. ======================================================================
