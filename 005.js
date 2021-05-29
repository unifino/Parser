import * as fs                          from "fs";

console.clear();
console.log( "### Misc. Unifier ### ###    v.1.0.0    ###\n" );

// .. ======================================================================

let filePath_kafi = "db/output/Al-Kafi.json";
// .. check Al-Kafi
await fs.promises.access( filePath_kafi, fs.constants.F_OK )
// .. file is found
.then( () => {} )
// .. file is NOT found
.catch( e => console.log(e) );

let filePath_misc = "db/output/Misc.json";
// .. check Misc.
await fs.promises.access( filePath_misc, fs.constants.F_OK )
// .. file is found
.then( () => {} )
// .. file is NOT found
.catch( e => console.log(e) );

// .. ======================================================================

// .. get sources
let al_kafi = fs.readFileSync( filePath_kafi , 'utf8' );
let db_kafi = JSON.parse( al_kafi );
let al_misc = fs.readFileSync( filePath_misc , 'utf8' );
let db_misc = JSON.parse( al_misc );

// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

let startTime = new Date().getTime();
let currentTime = new Date().getTime();

let dupC = 0;

console.time( "App" );

console.time( "pre" );
pre();
console.timeEnd( "pre" );

console.log( "\n--------------------------------------------------------\n" );

console.time( "examine_X_by_A" );

// examine_X_by_A( db_misc[ 13662 ], db_misc[ 24003 ] ); 

let limit = 50;
let passedTime;
let ets;
let p_H, p_M, p_S;
let ets_H, ets_M, ets_S;
let ets_M_r, ets_S_r;
let p_M_r, p_S_r;
for ( let i = 0; i < db_misc.length; i++ ) {
    console.clear();
    console.log( "### Misc. Unifier ### ###    v.1.0.0    ###\n" );
    currentTime = new Date().getTime();
    passedTime = ( currentTime - startTime ) / 1000;

    p_H = ( passedTime/3600 )|0;
    p_M = ( passedTime/60 )|0;
    p_S = ( passedTime )|0;
    p_M_r = ( ( passedTime - p_H*3600 ) /60 ) |0;
    p_S_r = ( ( passedTime - ( (p_H*3600) + (p_M_r*60) ) ) ) | 0;


    ets = db_misc.length * passedTime / i;
    ets_H = ( ets/3600 )|0;
    ets_M = ( ets/60 )|0;
    ets_S = ( ets )|0;
    ets_M_r = ( ( ets - ets_H*3600 ) /60 ) |0;
    ets_S_r = ( ( ets - ( (ets_H*3600) + (ets_M_r*60) ) ) ) | 0;
    console.log( 
        ( (i/db_misc.length ) *100 ).toFixed(2) + 
        "% | F: " + dupC + 
        " | T: " + p_H + "°: " + p_M_r + "': " + p_S_r +
        " | ETS: " + ets_H + "°: " + ets_M_r + "': " + ets_S_r + "\"" 
    );

    for ( let j = i+1; j < db_misc.length; j++ ) {
        examine_X_by_A( db_misc[ i ], db_misc[ j ] ); 
    }

}

// .. write down db
for ( let x of db_misc ) {
    delete x.inFarsi;
    delete x.farsiInParts;
}
let exp = "db/tmp/db_" + db_misc.length + ".json";
fs.writeFileSync( exp, JSON.stringify( db_misc, null, "\t" ) );

console.timeEnd( "examine_X_by_A" );

console.log( "\n--------------------------------------------------------\n" );

console.timeEnd( "App" );
console.log( "###     Done!     ###\n\n" );


// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function pre () {
    let i = 0;
    for ( let h of db_misc ) {
        h.i = i;
        h.inFarsi = inFarsiLetters( h.a );
        i++;
    }
}

// .. ======================================================================

function examine_X_by_A ( A, X ) {

    let A_word, X_word, idx;
    A.farsiInParts = A.inFarsi.split( " " );
    X.farsiInParts = X.inFarsi.split( " " );

    // .. trimming by A on (X and A)
    for ( let i in A.farsiInParts ) {

        A_word = A.farsiInParts[i];

        // .. find in X
        idx = X.farsiInParts.findIndex( x => x === A_word );

        // .. remove from X and A
        if ( ~idx ) {
            X.farsiInParts.splice( idx, 1 );
            delete A.farsiInParts[i];
        }

    }

    A.farsiInParts = removeUnimportantWords ( A.farsiInParts );
    X.farsiInParts = removeUnimportantWords ( X.farsiInParts );

    // .. trimming remaining parts by A
    for ( let i in A.farsiInParts ) {

        A_word = A.farsiInParts[i];

        // .. find (similar) in X
        idx = X.farsiInParts.findIndex( x => similarWords( x, A_word ) );

        if ( ~idx ) {
            X.farsiInParts.splice( idx, 1 );
            delete A.farsiInParts[i];
        }

    }

    // ..bug resolver
    A.farsiInParts = A.farsiInParts.filter( a => a );

    // .. trimming remaining parts by X
    for ( let i in X.farsiInParts ) {

        X_word = X.farsiInParts[i];

        // .. find (similar) in X
        idx = A.farsiInParts.findIndex( a => similarWords( a, X_word ) );

        if ( ~idx ) {
            A.farsiInParts.splice( idx, 1 )
            delete X.farsiInParts[i];
        }

    }

    // .. trim empty cells
    A.farsiInParts = A.farsiInParts.filter( a => a )
    X.farsiInParts = X.farsiInParts.filter( x => x )

    // .. report important ones
    if 
    ( 
        A.farsiInParts.length < 3 &&
        X.farsiInParts.length < 3 &&
        A.i !== X.i &&
        X.inFarsi.length > 50
    ) 
    {
        dupC++;
        let pickedID = ( A.a.length > X.a.length ) ? A.i : X.i;
        let outID = ( A.a.length > X.a.length ) ? X.i : A.i;
        let cont = [];
        delete db_misc[ outID ].inFarsi;
        delete db_misc[ outID ].farsiInParts;
        if ( typeof db_misc[ pickedID ].x === "object" ) {
            cont = [ db_misc[ outID ] , ...db_misc[ pickedID ].x ] ;
        }
        else {
            if ( db_misc[ outID ].x ) {
                let tmpX = db_misc[ outID ].x;
                delete db_misc[ outID ].x;
                cont = [ db_misc[ outID ], ...tmpX ];
            }
            else cont = [ db_misc[ outID ] ];
        }
            let picked = {
            a: db_misc[ pickedID ].a,
            inFarsi: db_misc[ pickedID ].inFarsi,
            b: db_misc[ pickedID ].b,
            c: db_misc[ pickedID ].c,
            d: db_misc[ pickedID ].d,
            i: db_misc[ pickedID ].i,
            x: cont,
        }

        db_misc[ pickedID ] = picked;
        db_misc[ outID ] = { a: "", inFarsi: "", i: outID };

    }

}

// .. ======================================================================

function similarWords ( a, x ) {
    return a.includes( x ) 
}

// .. ======================================================================

function removeUnimportantWords ( arr ) {

    let omit = [ "و", "ان" ];

    for ( let i in arr ) 
        if ( ~omit.indexOf( arr[i] ) ) 
            delete arr[i]

    arr = arr.filter( a => a )
    return arr;

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

export function erabTrimmer ( str ) {
    if ( !str ) return "";
    const erabs = [
        "ٕ", "ٓ", "ٖ", "ۡ", "ۚ", "ۢ", "ۖ", "ۗ", "ٌۚ", "ۥ", " ٌ",
        "ً", "ٌ", "ٍ",  "َ", "ُ",  "ِ",  "ّ",  "ْ", "‎ٓ", "ٔ",  "ٰ",
        "،"
    ];
    for ( const erab of erabs ) str = str.replace( new RegExp( erab, 'g' ), "" );
    str = str.replace( /ٱ/g, 'ا' );
    str = str.replace( /\./g, '' );
    return str;
}

// .. ======================================================================
