export type newDB = {
    a: string,
    b: string,
    c?: number,
    d?: string
}[];

export type db_item = {
    a: string,
    b: string,
    c: number,
    d: string|number,
    n: number,
    j: number,
    idInSection?: number,
    tmp_inFarsiLetter: string,
    tmp_kalamat: string[],
    cDB: child_item[]
};
export type db = db_item[];

type db_map_info_item = number[];
export type db_map_info = db_map_info_item[];

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
export type ClusterInfo = {
    index: number,
    length: number
}[];
export type ClusterInfoBox = ClusterInfo[];

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
    | "mox"
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

export type rss_item = { 
    text:string, 
    id:number, 
    _n: number, 
    dxd?: number 
};