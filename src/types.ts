export type newDB = {
    a: string,
    b: string,
    c?: number,
    d?: string
}[];

export type db_item = {
    0?: string,
    9?: string,
    a: string,
    b: string,
    c: number,
    d: string|number,
    n: number,
    old_n?: number,
    idInSection?: number,
    tmp_inFarsiLetter: string,
    tmp_kalamat: string[],
    cDB: number[]
};
export type db = db_item[];

// .. ====================================================================

export type s = number[];
export type d = [ number, number ][];
export type m = ClusterBox;

// .. ====================================================================

export type R = [ number, number, number ];
export type boundLine = number[];
export type boundBox = number[][];
export type Cluster = number[];

export type ClusterBox = Cluster[];
export type ClusterInfo = {
    id_in_book: number,
    index_in_db: number,
    length: number
}[];
export type ClusterInfoBox = ClusterInfo[];

// .. ====================================================================

export type source = 
      "الكافي"
    | "غررالحکم"
    | "متفرقه"
    | "نهج‌الفصاحة"
    | "نهج‌البلاغة"
    | "كنز‌العمّال"
    | "بحار‌الأنوار"
    | "تحف‌العقول"
    | "وسائل‌الشيعة"
    | "mox"
    ;

export type bookKeys = { [key in source]: string[] };

// .. ====================================================================

export type Repo = {
    any: number,
    uniqe: number,
    diff: number,
    seq: number[]
}

// .. ====================================================================

export type rss_item = { 
    text:string, 
    id:number, 
    _n: number, 
    dxd?: number 
};