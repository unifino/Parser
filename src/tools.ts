import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";
import * as storage                     from "./storage";

// .. ======================================================================

export function do_charSpacer ( db: TS.db ): void  {
    for ( let cell of db ) {
        cell.a = basic_tools.charSpacer( cell.a );
        cell.b = basic_tools.charSpacer( cell.b );
        if ( typeof cell.d === "string" ) 
            cell.d = basic_tools.charSpacer( cell.d );
    }
}

// .. ======================================================================

export function addTmpProps ( db: TS.db ) {

    let tmp_1: string;
    let tmp_2: string[];

    for ( let cell of db ) {
        tmp_1 = basic_tools.inFarsiLetters( cell.a );
        cell.tmp_inFarsiLetter = basic_tools.cutSomePhrases( tmp_1 );
        tmp_2 = cell.tmp_inFarsiLetter.split( " " );
        cell.tmp_kalamat = basic_tools.deleteSomeWords( tmp_2 );
    }

}

// .. ======================================================================

export function R ( i: number, j: number, db: TS.db ) {

    let partsA = db[i].tmp_kalamat.slice(0);
    let partsX = db[j].tmp_kalamat.slice(0);
    let totalParts = partsA.length + partsX.length;

    // .. trimming by A on (X and A)
    pAOX( partsA, partsX );
    partsA = partsA.filter( a => a );

    let totalRemains = partsA.length + partsX.length;
    let correlationRate = ( (totalParts - totalRemains) / totalParts )*100;

    let r: TS.R = [ i, j, (correlationRate*100|0)/100 ];

    return R;

}

// .. ======================================================================

function pAOX ( A: string[], X: string[] ) {

    let found: number;

    for ( let i=0; i<A.length; i++ ) {
        found = X.findIndex( x => x === A[i] );
        if ( ~found ) {
            X.splice( found, 1 );
            delete A[i];
        }
    }

}

// .. ======================================================================

export function R_optimizer ( data: TS.R[], min: number ) {

    // .. not a-a situation + r > min ( ?50 )
    data = data.filter( x => x[0] !== x[1] && x[2] > min );
    // .. sort by R
    data.sort( (a,x) => x[2] > a[2] ? 1 : -1 );
    // .. put a,b,R <== a<b
    data = data.map( x => [ x[0]>x[1] ? x[1]:x[0], x[0]>x[1] ? x[0]:x[1], x[2]] );

    // .. condition defined
    function cnd ( x, a: [number, number, number] ) {
        return x[0] === a[0] && x[1] === a[1] && x[2] === a[2];
    }
    // .. remove duplicates
    data = data.reduce( ( sigma, one ) => {
        if ( !sigma.find( x => cnd( x, one ) ) ) sigma.push(one);
        return sigma;
    }, [] );

    return data;

}

// .. ======================================================================

export function R2Bound ( R: TS.R[], length: number ) {

    let sTime = new Date().getTime(),
        boundBox: TS.boundBox = [],
        boundLine: TS.boundLine,
        a: number,
        b: number;

    for ( let i=0; i<length; i++ ) {
        if ( !(i%100) ) timer( length, i, sTime, "    R2Bound   " );
        boundLine = [];
        for ( let j=0; j<R.length; j++ ) {
            a = R[j][0];
            b = R[j][1];
            if ( a === i ) boundLine.push(b);
            if ( b === i ) boundLine.push(a);
        }
        boundBox.push( boundLine );
    }

    if ( boundBox.length !== length ) console.log( "Critical Error!" );
    else return boundBox;

}

// .. ======================================================================

export function boundBoxDivider( boundBox: TS.boundBox ) {

    let single: TS.s = [],
        double: TS.d = [],
        other: TS.m = [],
        m_1: TS.ClusterBox,
        child: number;

    // .. get singles
    for ( let i in boundBox ){
        if ( boundBox[i].length === 0 ) {
            single.push( Number(i) );
            delete boundBox[i];
        }
    }
    // .. get doubles
    for ( let i in boundBox ) {
        if ( boundBox[i] ) {
            if ( boundBox[i].length === 1 ) {
                child = boundBox[i][0];
                if ( boundBox[ child ].length === 1 ) {
                    if ( boundBox[ child ][0] === Number(i) ) {
                        double.push( [ Number(i), child ] );
                        delete boundBox[i];
                        delete boundBox[ child ];
                    }
                }
            }
        }
    }

    for ( let i in boundBox ) 
        if ( boundBox[i] )
            other.push( [ Number(i), ...boundBox[i] ] );


    m_1 = simpleClusterPeptics ( other );

    // .. report
    return {
        single: single,
        double: double,
        m_1: m_1,
    };

}

// .. ======================================================================

export function multiScatter( multiBox: TS.boundBox ) {

    let clusterBox: TS.ClusterBox = [],
        other: TS.m = []

    // .. get singles
    for ( let row of multiBox )
        if ( row.length === 0 ) 
            console.log("ERROR!");

    if ( clusterBoxRealLengthReport( multiBox ).diff ) {
        console.log( "ERROR!!" );
        return;
    }

    for ( let i in multiBox ) {
        if ( multiBox[i].length <= 14 ) {
            clusterBox.push( multiBox[i] );
            delete multiBox[i];
        }
    }

    multiBox = multiBox.filter( x => x );

    return {
        multi: clusterBox,
        other: multiBox
    }

}

// .. ======================================================================

export function multiUnifier ( raw_multi:TS.ClusterBox ) {
    // .. remove duplicates
    let tmp_01: string[] = [];
    let multiples: TS.ClusterBox = [];
    // .. sort and stringify
    for ( let line of raw_multi ) 
        tmp_01.push( line.sort( (a,b) => a>b ? 1:-1 ).join(":") )
    let tmp_02: string[] = [ ...new Set(tmp_01) ];
    for ( let line of tmp_02 ) multiples.push( line.split(":").map( x => Number(x) ) );
    return multiples;
}

// .. ======================================================================

export function simpleClusterPeptics ( other: TS.ClusterBox ) {

    let oneCluster: TS.Cluster = [],
        clusterBox: TS.ClusterBox = [],
        startTime = new Date().getTime(),
        c = 0,
        total = other.length;

    for ( oneCluster of other ) {
        timer( total, c, startTime, "clusterPeptic-" );
        oneCluster = [ ...new Set( oneCluster ) ];
        clusterBox.push( oneCluster );
        c++;
    }

    return multiUnifier( clusterBox );

}

// .. ======================================================================

export function aggressiveClusterPeptics ( m_1: TS.ClusterBox, R: TS.R[] ) {

    let clusterBox: TS.ClusterBox = [],
        startTime = new Date().getTime();

    // .. unify multiDB
    let uni = []
    for ( let r of m_1 ) uni = [ ...uni, ...r  ];
    uni = [ ...new Set(uni) ];

    for ( let i in uni ) {
        timer( uni.length, Number(i), startTime, "clusterPeptic+" );
        clusterBox.push( cluster( uni[i], R ) );
    }

    return multiUnifier( clusterBox );
}

// .. ======================================================================

export function cluster ( start: number, r: TS.R[] ) {

    let hand = [ start ];
    let cluster: TS.Cluster = [];

    while ( hand.length ) {
        for ( let i=0; i<r.length; i++ ) {
            if ( r[i][0] === hand[0] || r[i][1] === hand[0] ) {
                hand.push( r[i][0], r[i][1] );
            }
        }
        hand = [ ... new Set(hand) ];
        cluster.push( hand[0] );
        hand.shift();
        hand = hand.filter( x => !cluster.includes(x) );
    }

    return cluster;

}

// .. ======================================================================

export function jAllocator ( kafi: TS.db, misc: TS.db ) {
    // .. allocate fromSourceID: j
    for ( let i in kafi ) {
        kafi[i].j = Number(i) +1;
    }
    for ( let i in misc ) {
        misc[i].j = Number(i) +kafi.length +1;
    }
}

// .. ======================================================================

let trace = [];
export function MOX ( src: TS.ClusterBox, ref: TS.db ) {

    // let mox: TS.db = [],
    //     tmpX: TS.child_item[],
    //     child: TS.child_item[];

    // for ( let rowOfIDs of src ) {

    //     let seq: {
    //         len: number,
    //         id: number
    //     }[] = [];

    //     for ( let x of rowOfIDs ) {

    //         seq.push( {
    //             len: ref[x].a.length,
    //             id: x
    //         } );
    //     }
    //     let max = seq.reduce( (soFar, one) => {
    //         if ( one.len >= soFar.len ) soFar = one;
    //         return soFar;
    //     } , { len: -1, id: -1 } );

    //     let head = ref[ max.id ];
    //     if ( seq.length > 1 ) {
    //         head.childBasket = [];
    //         for ( )
    //     }

    //     mox.push( head );

    // }

    // return mox;

}

// .. ======================================================================

export function getPepticR ( peptic: TS.ClusterBox, R: TS.R[] ) {
    let patients = [];
    for ( let r of peptic ) patients = [ ...patients, ...r  ];
    let pR = R.filter( x => patients.includes(x[0]) && patients.includes(x[1]) );
    return pR;
}

// .. ======================================================================

export function timer ( 
    length: number, 
    i: number, 
    startTime: number, 
    title: string = "Timer", 
    version: string = "1.0.4", 
    quality: number = null, 
    dupC: number = null 
) {

    let passedTime, ets;
    let p_H, p_M, p_S, p_M_r, p_S_r;
    let ets_H, ets_M, ets_S, ets_M_r, ets_S_r;
    let dialog: string = "";

    console.clear();
    console.log( "### " + title + " ###\n###     v." + version + "    ###\n" );

    passedTime = ( new Date().getTime() - startTime ) / 1000;

    p_H = ( passedTime/3600 )|0;
    p_M = ( passedTime/60 )|0;
    p_S = ( passedTime )|0;
    p_M_r = ( ( passedTime - p_H*3600 ) /60 ) |0;
    p_S_r = ( ( passedTime - ( (p_H*3600) + (p_M_r*60) ) ) ) | 0;

    ets = ( length * passedTime / i ) - passedTime;
    ets_H = ( ets/3600 )|0;
    ets_M = ( ets/60 )|0;
    ets_S = ( ets )|0;
    ets_M_r = ( ( ets - ets_H*3600 ) /60 ) |0;
    ets_S_r = ( ( ets - ( (ets_H*3600) + (ets_M_r*60) ) ) ) | 0;
    dialog = ( (i/length ) *100 ).toFixed(2) + "%";
    if ( quality !== null ) dialog += " | QC: " + quality;
    if ( dupC !== null ) dialog += " | F: " + dupC;
    dialog += " | T: " + p_H + "°: " + p_M_r + "': " + p_S_r;
    dialog += " | ETS: " + ets_H + "°: " + ets_M_r + "': " + ets_S_r + "\"";
    console.log( dialog );

}

// .. ======================================================================

export function clusterBoxRealLengthReport ( db: TS.ClusterBox, tag?: string ) {

    let t = [],
        report: TS.Repo = {} as any;

    for ( let r of db ) t = [ ...t, ...r  ];
    report.any = t.length;
    t = [ ...new Set(t) ];
    report.uniqe = t.length;
    report.diff = report.any - report.uniqe;

    if ( tag ) {
        if ( report.diff ) console.log( tag,"\t",report );
        else console.log( tag,"\t",report.any );
    }

    report.seq = t;
    return report;

}

// .. ======================================================================

export function checkPresents ( src: TS.db, s: TS.s, d: TS.d, m: TS.m ) {

    let mix = [],
        tmp = [];

    mix = [ ...mix, ...s ];
    for ( let x of d ) tmp = [ ...tmp, ...x  ];
    mix = [ ...mix, ...tmp ];
    for ( let x of m ) tmp = [ ...tmp, ...x  ];
    mix = [ ...new Set( [ ...mix, ...tmp ] ) ];

    return mix.length === src.length;

}

// .. ======================================================================

export function resultValidator () {
    let s = storage.single.length;
    console.log( "\nsingle", "\t", s );
    let d = clusterBoxRealLengthReport( storage.double, "double" );
    let m = clusterBoxRealLengthReport( storage.multi, "multi" );
    let o = clusterBoxRealLengthReport( storage.other, "other" );
    let t = s + d.any + m.any + o.any;
    let answer = storage.grand_db.length === t ;
    console.log( "\nAnswer is: " + ( answer ? "OK!" : "BAD!!" ) );
    let collection = [...storage.single,...d.seq,...m.seq,...o.seq]
    collection = [ ...new Set(collection) ];
    console.log("------> " , collection.length );
    console.log("------> " , collection.length===storage.grand_db.length );
    let hasR = [];
    for ( let pp of storage.R ) hasR.push( pp[0], pp[1] );
    hasR = [ ...new Set(hasR) ];
    console.log(storage.grand_db.length-hasR.length);
    let noR = [];
    for ( let i=0; i<storage.grand_db.length; i++ ) 
        if ( !hasR.includes(i) )
        noR.push(i);
    console.log("------> " ,storage.grand_db.length-hasR.length-noR.length===0);
    let swr = 0;
    let swor = 0;
    for ( let x of storage.single ) {
        if ( noR.includes(x) ) swor++;
        else swr++;
    }
    console.log(swr,swor);
    
    return answer;
}

// .. ======================================================================
