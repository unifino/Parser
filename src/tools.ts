import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";

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

export function R2Bound ( R: TS.R[] ) {

    let sTime = new Date().getTime(),
        total: number,
        boundBox: TS.boundBox = {};

    for ( let i=0; i<R.length; i++ ) {
        if ( !(i%9) ) timer( R.length, i, sTime, "R2Bound : 1/2" );
        if ( !boundBox[ R[i][0] ] ) boundBox[ R[i][0] ] = [];
        if ( !boundBox[ R[i][1] ] ) boundBox[ R[i][1] ] = [];
        boundBox[ R[i][0] ].push( R[i][1] );
        boundBox[ R[i][1] ].push( R[i][0] );
    }
    total = Object.keys( boundBox ).length;
    for ( let i=0; i<total; i++ ) {
        if ( !(i%99) ) timer( total, i, sTime, "R2Bound: 2/2" );
        boundBox[i] = [ ...new Set(boundBox[i]) ];
    }

    return boundBox;

}

// .. ======================================================================

export function boundBoxDivider( boundBox: TS.boundBox ) {

    let single: TS.s = [],
        double: TS.d = [],
        multi: TS.m = [],
        child: number;

    // .. get singles
    for ( let key of Object.keys( boundBox ) ){
        if ( boundBox[ key ].length === 0 ) {
            single.push( Number(key) );
            delete boundBox[ key ];
        }
    }
    // .. get doubles
    for ( let parent of Object.keys( boundBox ) ) {
        if ( boundBox[ parent ] ) {
            if ( boundBox[ parent ].length === 1 ) {
                child = boundBox[ parent ][0];
                if ( boundBox[ child ].length === 1 ) {
                    if ( boundBox[ child ][0] === Number( parent ) ) {
                        double.push( [ Number( parent ), child ] );
                        delete boundBox[ parent ];
                        delete boundBox[ child ];
                    }
                }
            }
        }
    }

    for ( let key of Object.keys( boundBox ) ) {
        multi.push( [ Number(key), ...boundBox[key] ] );
    }

    // .. report
    return {
        single: single,
        double: double,
        pBound: boundBox,
    };

}

// .. ======================================================================

export function multiUnifier ( raw_multi:TS.ClusterBox ) {
    // .. remove duplicates
    let tmp_01: string[] = [];
    let multiples: TS.ClusterBox = [];
    for ( let line of raw_multi ) tmp_01.push( line.join(":") )
    let tmp_02: string[] = [ ...new Set(tmp_01) ];
    for ( let line of tmp_02 ) multiples.push( line.split(":").map( x => Number(x) ) );
    return multiples;
}

// .. ======================================================================

export function clusterPeptics ( restBox: TS.boundBox, R: TS.R[] ) {

    let oneCluster: TS.Cluster = [],
        clusterBox: TS.ClusterBox = [],
        startTime = new Date().getTime(),
        c = 0,
        total = Object.keys( restBox ).length;

    for ( let key of Object.keys( restBox ) ) {
        timer( total, c, startTime, "clusterPepticBounds" );
        oneCluster = [ Number(key), ...cluster( Number(key), R ) ];
        // .. sort this cluster
        oneCluster = [ ...new Set( oneCluster ) ];
        oneCluster = oneCluster.sort( (a,b) => a>b ? 1:-1 );
        clusterBox.push( oneCluster );
        c++;
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

export function MOX ( src: TS.d|TS.ClusterBox, ref: TS.db ) {

    let mox: TS.db = [];

    for ( let rowOfIDs of src ) {

        let seq: {
            len: number,
            id: number
        }[] = [];

        for ( let x of rowOfIDs ) {
            seq.push( {
                len: ref[x].a.length,
                id: x
            } );
        }
        let max = seq.reduce( (soFar, one) => {
            if ( one.len >= soFar.len ) soFar = one;
            return soFar;
        } , { len: -1, id: -1 } );

        let head = ref[ max.id ];
        head.childBasket = [];
        for ( let x of rowOfIDs ) {
            if ( x !== max.id ) {
                let child = ref[ x ];
                head.childBasket.push( child );
            }
        }

        mox.push( head );

    }

    return mox;

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
    version: string = "1.0.3", 
    quality: number = null, 
    dupC: number = null 
) {

    let passedTime, ets;
    let p_H, p_M, p_S, p_M_r, p_S_r;
    let ets_H, ets_M, ets_S, ets_M_r, ets_S_r;
    let dialog: string = "";

    console.clear();
    console.log( "### " + title + " ###\n###    v." + version + "    ###\n" );

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

export function clusterBoxRealLength ( db: TS.ClusterBox ) {
    let t = []
    for ( let r of db ) t = [ ...t, ...r  ];
    t = [ ...new Set(t) ];
    return t.length;
}

// .. ======================================================================

export function checkPresents ( src: TS.db, s: TS.s, d: TS.d, m: TS.m ) {

    let mix = [],
        tmp = [];

    mix = [ ...mix, ...s ];
    for ( let x of d ) tmp = [ ...tmp, ...x  ];
    mix = [ ...mix, ...tmp ];
    for ( let x of m ) tmp = [ ...tmp, ...x  ];
    mix = [ ...mix, ...tmp ];

    return mix.length === src.length;

}

// .. ======================================================================
