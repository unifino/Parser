import * as fs                          from "fs";

const title = "... NO NAME";
const version = "1.0.0";

// console.clear();
// console.log( "### " + title + " ### ###    v." + version + "    ###\n" );

// .. ======================================================================

let db_kafi = JSON.parse( fs.readFileSync( "db/base/Al-Kafi.json", 'utf8' ) );
let db_misc = JSON.parse( fs.readFileSync( "db/base/Misc.json", 'utf8' ) );
let quality = 100;
let dupC = 0;

// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

let startTime = new Date().getTime(), currentTime = new Date().getTime();
console.log(startTime);

// console.time( "App" );




// db_kafi = do_charSpacer( db_kafi );
// db_misc = do_charSpacer( db_misc );




// console.timeEnd( "App" ); console.log( "###     Done!     ###\n\n" );

// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// .. ======================================================================

function do_charSpacer (db) {
    // for ( let cell of db ) {}
    console.log( db.length );
    return db;
}

// .. ======================================================================

function inFarsiLetters ( str ) {

    if ( !str ) return "";

    str = erabTrimmer( str );
    str = str
        .replace( /ء/g, 'ا' )
        .replace( /إ/g, 'ا' )
        .replace( /أ/g, 'ا' )
        .replace( /آ/g, 'ا' )
        .replace( /ة/g, 'ه' )
        .replace( /ؤ/g, 'و' )
        .replace( /ك/g, 'ک' )
        .replace( /ي/g, 'ی' )
        .replace( /ﺉ/g, 'ی' )
        .replace( /ئ/g, 'ی' )
        .replace( /ى/g, 'ی' );
        // .replace( /ڑ/g, 'ر' );

    return str;

}

// .. ======================================================================

export function charSpacer ( str ) {
    if ( !str ) return "";
    str = str.replace( /،/g , " ، " );
    str = str.replace( /؛/g , " ؛ " );
    str = str.replace( /؟/g , " ؟ " );
    str = str.replace( /:/g , " : " );
    str = str.replace( /\(/g , " ( " );
    str = str.replace( /\)/g , " ) " );
    str = str.replace( /\[/g , " [ " );
    str = str.replace( /\]/g , " ] " );
    str = str.replace( /\./g, ' . ' );
    str = str.replace( /  +/g , " " );
    return str;
}

// .. ======================================================================

export function erabTrimmer ( str ) {
    if ( !str ) return "";
    const erabs = [
        "ٕ", "ٓ", "ٖ", "ۡ", "ۚ", "ۢ", "ۖ", "ۗ", "ٌۚ", "ۥ", " ٌ",
        "ً", "ٌ", "ٍ",  "َ", "ُ",  "ِ",  "ّ",  "ْ", "‎ٓ", "ٔ",  "ٰ", 
        "ـ",
    ];
    for ( const erab of erabs ) str = str.replace( new RegExp( erab, 'g' ), "" );
    str = str.replace( /ٱ/g, 'ا' );
    return str;
}

// .. ======================================================================

function timer ( length, i ) {

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

// .. ======================================================================
