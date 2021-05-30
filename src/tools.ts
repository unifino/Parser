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

export function timer ( length: number, i: number, currentTime: number, startTime: number, title: string, version: string, quality: number, dupC: number ) {

    let passedTime, ets;
    let p_H, p_M, p_S, p_M_r, p_S_r;
    let ets_H, ets_M, ets_S, ets_M_r, ets_S_r;

    console.clear();
    console.log( "### " + title + " ### ###    v." + version + "    ###\n" );

    currentTime = new Date().getTime();
    passedTime = ( currentTime - startTime ) / 1000;

    p_H = ( passedTime/3600 )|0;
    p_M = ( passedTime/60 )|0;
    p_S = ( passedTime )|0;
    p_M_r = ( ( passedTime - p_H*3600 ) /60 ) |0;
    p_S_r = ( ( passedTime - ( (p_H*3600) + (p_M_r*60) ) ) ) | 0;

    ets = length * passedTime / i;
    ets_H = ( ets/3600 )|0;
    ets_M = ( ets/60 )|0;
    ets_S = ( ets )|0;
    ets_M_r = ( ( ets - ets_H*3600 ) /60 ) |0;
    ets_S_r = ( ( ets - ( (ets_H*3600) + (ets_M_r*60) ) ) ) | 0;
    console.log( 
        ( (i/length ) *100 ).toFixed(2) + "%" +
        " | QC: " + quality +
        " | F: " + dupC + 
        " | T: " + p_H + "°: " + p_M_r + "': " + p_S_r +
        " | ETS: " + ets_H + "°: " + ets_M_r + "': " + ets_S_r + "\""
    );

}
