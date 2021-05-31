import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";

// .. ======================================================================

export function lastClip ( boundBox_rest: TS.bound[], R: TS.r ) {

    let lastClip = [],
        startTime = new Date().getTime(),
        c =0,
        total = Object.keys( boundBox_rest ).length;

    for ( let key of Object.keys( boundBox_rest ) ) {
        timer( total,c,startTime )
        lastClip.push( clipper(Number(key), R ) );
        c++;
    }

}

// .. ======================================================================

export function boundBoxDivider_SD( boundBox: TS.bound ) {

    let singles = [],
        doubles: [number,number][] = [],
        child: number;

    // .. get singles
    for ( let key of Object.keys( boundBox ) ){
        if ( boundBox[ key ].length === 0 ) {
            singles.push( Number(key) );
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
                        doubles.push( [ Number( parent ), child ] );
                        delete boundBox[ parent ];
                        delete boundBox[ child ];
                    }
                }
            }
        }
    }

    // .. report
    return {
        singles: singles,
        doubles: doubles,
        rest: boundBox
    };

}

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

export function correlationCalculator ( i: number, j: number, db: TS.db ) {

    let partsA = db[i].tmp_kalamat.slice(0);
    let partsX = db[j].tmp_kalamat.slice(0);
    let totalParts = partsA.length + partsX.length;

    // .. trimming by A on (X and A)
    pAOX( partsA, partsX );
    partsA = partsA.filter( a => a );

    let totalRemains = partsA.length + partsX.length;
    let correlationRate = ( (totalParts - totalRemains) / totalParts )*100;

    return [ i, j, (correlationRate*100|0)/100 ];

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

export function R2BoundBox ( db: TS.r ) {

    let sTime = new Date().getTime(), 
        boundBox: TS.bound = {};

    for ( let i=0; i<db.length; i++ ) {
        if ( !(i%9) ) timer( db.length, i, sTime, "1/2" );
        if ( !boundBox[ db[i][0] ] ) boundBox[ db[i][0] ] = [];
        if ( !boundBox[ db[i][1] ] ) boundBox[ db[i][1] ] = [];
        boundBox[ db[i][0] ].push( db[i][1] );
        boundBox[ db[i][1] ].push( db[i][0] );
    }

    for ( let i=0; i<Object.keys( boundBox ).length; i++ ) {
        if ( !(i%99) ) timer( Object.keys( boundBox ).length, i, sTime, "2/2" );
        boundBox[i] = [ ...new Set(boundBox[i]) ];
    }

    return boundBox;

}

// .. ======================================================================

export function R2ClipBox ( db: TS.r ) {

    let sTime = new Date().getTime(), 
        clipBox = [],
        clip: number[];

    for ( let i=0; i<db.length; i++ ) {
        timer( db.length, i, sTime );
        clip = clipper( i, db );
        if ( clip.length > 1 ) clipBox.push( clip );
    }
    return clipBox;

}

// .. ======================================================================

export function clipper ( start: number, db: TS.r ) {

    let hand = [ start ];
    let clip = [];

    while ( hand.length ) {
        for ( let i=0; i<db.length; i++ ) {
            if ( db[i][0] === hand[0] || db[i][1] === hand[0] ) {
                hand.push( db[i][0], db[i][1] );
            }
        }
        hand = [ ... new Set(hand) ];
        clip.push( hand[0] );
        hand.shift();
        hand = hand.filter( x => !clip.includes(x) );
    }

    return clip;

}

// .. ======================================================================

export function R ( data: TS.r ) {

    // .. not a-a situation + r > 50
    data = data.filter( x => x[0] !== x[1] && x[2] > 50 );
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
