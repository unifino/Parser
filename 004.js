import * as fs                          from "fs";

console.log( "\n... Al-Kafi vs. Misc. DBs Unifier ( v.1.0.0 ) ...\n");

// .. ======================================================================

let filePath_kafi = "db/output/Al-Kafi.json";
// .. check Al-Kafi
await fs.promises.access( filePath_kafi, fs.constants.F_OK )
// .. file is found
.then( () => {} )
// .. file is NOT found
.catch( e => console.log(e) );

let filePath_misc = "db/Misc.json";
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
let test = "";

// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

pre();
init();

// .. remove i(s)
for ( let h of db_misc ) delete h.i;

// .. write down db
let exp = "db/output/Misc.json";
fs.writeFileSync( exp, JSON.stringify( db_misc, null, "\t" ) );

console.log( "\n... Done!\n" );

// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

async function assignID () {
    for ( let hID in db_misc ) db_misc[ hID ].i = Number( hID );
}

// .. ======================================================================

async function dub_check () {

    db_misc = db_misc.reduce( (soFar, thisOne) => {

        let dup = soFar.find( x => x.a2 === thisOne.a2 );
        return !dup ? soFar.concat( [ thisOne ] ) : soFar;

    }, [] );

}

// .. ======================================================================

async function pre () {

    for ( let h of db_misc ) {
        if ( 
            h.a.includes("پ") || 
            h.a.includes("چ") || 
            h.a.includes("ژ") || 
            h.a.includes("گ") 
        ) console.log( h );
    }

}

// .. ======================================================================

async function init () {

    assignID();

    for ( let h of db_misc ) h.a2 = erabTrimmer( h.a );
    for ( let k of db_kafi ) k.a2 = erabTrimmer( k.a );

    dub_check();

    // .. remove exactly duplicated (~Kafi) from Misc
    db_misc = db_misc.filter( x => !db_kafi.find( k => x.a2 === k.a2 ) );
    // .. remove exactly -(.)| -( )| -( .) duplicated (~Kafi) from Misc
    db_misc = db_misc.filter( x => !db_kafi.find( k => x.a2 === k.a2+"." ) );
    db_misc = db_misc.filter( x => !db_kafi.find( k => x.a2 === k.a2+" " ) );
    db_misc = db_misc.filter( x => !db_kafi.find( k => x.a2 === k.a2+" ." ) );

    // .. find some-others :
    re_cure ();

    // .. remove temporary a2
    db_misc = db_misc.map( x => {
        return {
            a: x.a,
            b: x.b,
            c: x.c,
            d: x.d,
            i: x.i,
        }
    } );

}

// .. ======================================================================

async function re_cure () {

    let cur = db_misc.reduce( (soFar, thisOne) => {

        let dup = db_kafi.findIndex( k => 
            ( Math.abs( k.a2.length - thisOne.a2.length ) < 1000 )
            &&
            ( k.a2.includes( thisOne.a2 ) || thisOne.a2.includes( k.a2 ) )

        );

        return dup > -1 ? soFar.concat( [ { 
            misc_ID:    thisOne.i, 
            misc_b:     thisOne.b, 
            misc_a:     thisOne.a, 
            kafi:       db_kafi[ dup ].a, 
            kafi_ID:    db_kafi[ dup ].d,
            act:        0
        } ] ) : soFar;

    }, [] );

    let exp = "db/tmp/dupped.json";
    fs.writeFileSync( exp, JSON.stringify( cur, null, "\t" ) );

}

// .. ======================================================================

function erabTrimmer ( str ) {

    const erabs = [ 

        "ٕ", "ٓ", "ٖ", "ۡ", "ۚ", "ۢ", "ۖ", "ۗ", "ٌۚ", "ۥ", " ٌ",

        "ً", "ٌ", "ٍ",  "َ", "ُ",  "ِ",  "ّ",  "ْ", "‎ٓ", "ٔ",  "ٰ", 

    ];

    for ( const erab of erabs ) str = str.replace( new RegExp( erab, 'g' ), "" );

    return str;
}

// .. ======================================================================

function erabTrimmerTest ( str ) {
    const erabs = [ 
        // "ٕ", 
        // "ٓ", 
        // "ٖ", 
        // "ۡ", 
        // "ۚ", 
        // "ۢ", 
        // "ۖ", 
        // "ۗ", 
        // "ٌۚ", 
        // "ۥ", 
        // " ٌ", 
        "ً", 
        "ٌ",
        "ٍ", 
        "َ",
        "ُ", 
        "ِ", 
        "ّ", 
        "ْ",
        "‎ٓ",
        "ٔ",

        "ٰ", 


        "پ",
        "‏ی",
        "گ",
        "ی",
        "چ",
        "ۀ",
        "…",


        "ر",
        "ح",
        "أ",
        "ا",
        "ب",
        "ل",
        "غ",
        "ز",
        "م",
        "ن",
        "ه",
        "س",
        "ي",
        "ط",
        "ف",
        "ظ",
        "و",
        "ع",
        "ى",
        "ت",
        "ق",
        "ص",
        "ج",
        "ذ",
        "ث",
        "ئ",
        "ض",
        "ك",
        "خ",
        "د",
        "ش‌",
        "ش",
        "ک",
        "ة",
        "إ",
        "ء",
        "،",
        "آ",
        "ؤ",
        "«",
        "»",
        "؛",
        "<",
        ">",
        "Q",
        ":",
        "-",
        "ـ",
        "_",
        "–",
        "؟",
        " ‌ ",
        " ",
        "0",
        "1",
        "9",
        "2",
        "7",
        "3",
        "8",
        "4",
        "5",
        "6",


        "۳",
        "۰",
        "=",
        "¨",
        "ﺉ",
        "ڑ",
        
    ];
    for ( const erab of erabs ) str = str.replace( new RegExp( erab, 'g' ), "" );
    str = str.replace( /ٱ/g, 'ا' );
    str = str.replace( /\./g, '' );
    str = str.replace( /\(/g, '' );
    str = str.replace( /\)/g, '' );
    str = str.replace( /\//g, '' );
    str = str.replace( /\?/g, '' );
    str = str.replace( /\!/g, '' );
    str = str.replace( /\*/g, '' );
    str = str.replace( /\[/g, '' );
    str = str.replace( /\]/g, '' );
    str = str.replace( /"/g, '' );
    str = str.replace( / /g, '' );
    str = str.replace( /\t/g, '' );
    str = str.replace( /\n/g, '' );
    str = str.replace( /\r/g, '' );
    str = str.replace( /&quot;/g, '' );
    str = str.replace( /;/g, '' );
    str = str.replace( /,/g, '' );
    str = str.replace( / /g, '' );

    
    // console.log( "d" + String.fromCharCode(1619));
    str = str.replace( new RegExp(String.fromCharCode(8204), "g"), '' );
    str = str.replace( new RegExp(String.fromCharCode(8205), "g"), '' );
    str = str.replace( new RegExp(String.fromCharCode(8206), "g"), '' );
    str = str.replace( new RegExp(String.fromCharCode(8207), "g"), '' );
    if ( str ) {
        for (var i = 0; i < str.length; i++) {
            console.log(str.charCodeAt(i));
          }
    }
    return str;
}
