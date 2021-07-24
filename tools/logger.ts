import * as readline from 'readline'

// .. ====================================================================

export function timer ( i: number, z: number, time: number, line=4 ) {

    let passedTime: number,
        p_H: number, p_M: number, p_S: number, p_M_r, p_S_r,
        ets: number,
        e_H: number, e_M: number, e_S: number, e_M_r, e_S_r,
        dialog: string = "";

    passedTime = ( new Date().getTime() - time ) / 1000;

    p_H = ( passedTime/3600 )|0;
    p_M = ( passedTime/60 )|0;
    p_S = ( passedTime )|0;
    p_M_r = ( ( passedTime - p_H*3600 ) /60 ) |0;
    p_S_r = ( ( passedTime - ( (p_H*3600) + (p_M_r*60) ) ) ) | 0;

    ets = ( z * passedTime / i ) - passedTime;
    e_H = ( ets/3600 )|0;
    e_M = ( ets/60 )|0;
    e_S = ( ets )|0;
    e_M_r = ( ( ets - e_H*3600 ) /60 ) |0;
    e_S_r = ( ( ets - ( (e_H*3600) + (e_M_r*60) ) ) ) | 0;
    dialog = ( (i/z) *100 ).toFixed(2) + "%";
    dialog += " | T: " + p_H + "°: " + p_M_r + "': " + p_S_r;
    dialog += " | ETS: " + e_H + "°: " + e_M_r + "': " + e_S_r + "\"";

    readline.clearLine( process.stdout, 0 );
    cursor( line, 0 );
    console.log( dialog );
    cursor( line+1, 0 );

}

// .. ====================================================================

export function notify ( title?: string, end?: boolean, line?: number ) {

    cursor( 19, 1 );
    let msg = "########################################";
    let x: number;
    process.stdout.write( msg + "\r" );

    if ( end ) {
        title = "###############  Done  ##################";
        cursor( 19, 0 );
    }

    else {
        if ( title ) {
            x = (40 - title.length)/2|0;
            cursor( line || 1, x );
        }
        else {
            title = "Server Script - v.3";
            x = (40 - title.length)/2|0;
            cursor( 0, x );
        }
    }

    readline.clearLine( process.stdout, 0 );
    process.stdout.write( title + "\n" );

}

// .. ====================================================================

export function cursor ( line: number, x: number  ) {
    readline.cursorTo( process.stdout, x, line );
}

// .. ====================================================================

let time = new Date().getTime();
export function clock () {

    let passedTime = ( new Date().getTime() - time ) / 1000;
    let msg = "Run Time: " + passedTime;
    let x = (40 - msg.length)/2|0;
    cursor( 17, x );
    readline.clearLine( process.stdout, 0 );
    process.stdout.write( msg + "\r" );
    cursor( 22, 0 );

}

// .. ====================================================================
