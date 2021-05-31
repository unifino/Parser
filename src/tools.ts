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

export function rBig2ClipBox ( db: TS.r ) {

    let startTime = new Date().getTime(), 
        currentTime = new Date().getTime(),
        clipBox = [],
        clip: number[];

    for ( let i=0; i<db.length; i++ ) {
        timer( db.length, i, currentTime, startTime );
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

export function _rBIG ( data: TS.r ) {

    data = data.filter( x => x[0] !== x[1] && x[2] > 50 );
    data.sort( (a,x) => x[2] > a[2] ? 1 : -1 );
    data = data.map( x => [ x[0]>x[1] ? x[1]:x[0], x[0]>x[1] ? x[0]:x[1], x[2]] );

    data = data.reduce( ( sigma, one ) => {
        if ( !sigma.find( x => x[0] === one[0] && x[1] === one[1] && x[2] === one[2] ) )
            sigma.push(one);
        return sigma;
    }, [] );

    return data;

}

// .. ======================================================================

export function timer ( 
    length: number, 
    i: number, 
    currentTime: number, 
    startTime: number, 
    title: string = "Timer", 
    version: string = "v.1.0.1", 
    quality: number = null, 
    dupC: number = null 
) {

    let passedTime, ets;
    let p_H, p_M, p_S, p_M_r, p_S_r;
    let ets_H, ets_M, ets_S, ets_M_r, ets_S_r;
    let dialog: string = "";

    console.clear();
    console.log( "### " + title + " ### ###    v." + version + "    ###\n" );

    currentTime = new Date().getTime();
    passedTime = ( currentTime - startTime ) / 1000;

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
