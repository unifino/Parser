import * as fs                          from "fs";

const title = "Misc. Sorter";
const version = "1.0.0";

console.clear();
console.log( "### " + title + " ### ###    v." + version + "    ###\n" );

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

let t1 = "اِنَّ عَلَى الاِْمامِ اَنْ يُخْرِجَ الُْمحْبَسينَ فِى الدَّيْنِ يَوْمَ الْجُمُعَةِ اِلَى الْجُمُعَةِ وَ يَوْمَ الْعيدِ اِلَى الْعيدِ وَ يُرْسِلَ مَعَهُمْ فَاِذا قَضَوْا الصَّلاةَ رَدَّهُمْ اِلَى السِّجْنِ";
let t2 = "على الإمامِ أنْ يُخرِجَ المَحْبوسينَ في الدَّينِ يَومَ الجُمُعةِ إلى الجُمُعةِ، ويَومَ العِيدِ إلى العِيدِ، فيُرسِلَ مَعهُم، فإذا قَضَوُا الصَّلاةَ والعِيدَ رَدّهُم إلى السِّجنِ.";
t1 = t1.replace( /؛/g , " ؛ " );
t1 = t1.replace( /؟/g , " ؟ " );
t1 = t1.replace( /:/g , " : " );
t1 = t1.replace( /\(/g , " ( " );
t1 = t1.replace( /\)/g , " ) " );
t1 = t1.replace( /\[/g , " [ " );
t1 = t1.replace( /\]/g , " ] " );
t1 = t1.replace( /ـ/g , "" );
t1 = t1.replace( /  +/g , " " );

t2 = t2.replace( /؛/g , " ؛ " );
t2 = t2.replace( /؟/g , " ؟ " );
t2 = t2.replace( /:/g , " : " );
t2 = t2.replace( /\(/g , " ( " );
t2 = t2.replace( /\)/g , " ) " );
t2 = t2.replace( /\[/g , " [ " );
t2 = t2.replace( /\]/g , " ] " );
t2 = t2.replace( /ـ/g , "" );
t2 = t2.replace( /  +/g , " " );
// .. ! this line differs (1/2)
// db_misc = db_kafi;

let startTime = new Date().getTime(), currentTime = new Date().getTime();
let dupC = 0;
let quality = 80;

console.time( "App" );
init();
console.timeEnd( "App" );
console.log( "###     Done!     ###\n\n" );

// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function init () {

    dupC = 0;

    db_misc = pre( db_misc );

    db_misc = add_FLP( db_misc );

    db_misc = sort_byLength( db_misc );

    db_misc = wrapper_examine_X_by_A( db_misc );

    // db_misc = finalizer ( db_misc )

    // // .. write down db
    // // .. ! this line differs (2/2)
    // let exported = "db/output/Misc_" + quality + ".json";
    // fs.writeFileSync( exported, JSON.stringify( db_misc, null, "\t" ) );

    // if ( dupC ) init();
    // else if ( quality > 50 ) {
    //     quality = quality -10;
    //     init();
    // }

}

// .. ======================================================================

function finalizer ( db ) {

    for ( let i in db ) { 
        if ( !db[i].a ) delete db[i];
        else {
            delete db[i].inFaParts; 
            delete db[i].inFarsi;
            delete db[i].i;
            if ( db[i].x ) {
                for ( let j in db[i].x ) { 
                    delete db[i].x[j].inFaParts; 
                    delete db[i].x[j].inFarsi;
                    delete db[i].x[j].i;
                    if ( db[i].x[j].b === db[i].b ) delete db[i].x[j].b; 
                    if ( db[i].x[j].c === db[i].c ) delete db[i].x[j].c; 
                    if ( db[i].x[j].d === db[i].d ) delete db[i].x[j].d; 
                    if ( db[i].x[j].d === db[i].d + "." ) delete db[i].x[j].d; 
                    if ( db[i].x[j].d + "." === db[i].d ) delete db[i].x[j].d; 
                }
            }

        }
    }

    db = db.filter( d => d );
    return db;

}

// .. ======================================================================

function wrapper_examine_X_by_A ( db ) {

    for ( let i = 0; i < db.length; i++ ) {

        // timer( db.length, i );
        // if ( db[i].a === t2 )console.log("i, t2", i);
        // if ( db[i].a === t1 )console.log("i, t1", i);
        // i, t2 33526
        // i, t1 34571


        let goFrom = i+1;
        while ( !!~goFrom && goFrom < db.length ) {
            db = examine_X_by_A( i, goFrom, db );


            if ( db[goFrom].a === t1 || db[i].a === t1 )
                if ( db[goFrom].a === t2 || db[i].a === t2 )
                    console.log("hatef",goFrom,i);

            if ( db[ goFrom ].inFaParts.length - db[ i ].inFaParts.length > 7 ) 
                goFrom = -1;
            else goFrom++;
        }

    }

    return db;

}

// .. ======================================================================

function pre ( db ) {
    for ( let sec of db ) {

        sec.a = sec.a.replace( /؛/g , " ؛ " );
        sec.a = sec.a.replace( /؟/g , " ؟ " );
        sec.a = sec.a.replace( /:/g , " : " );
        sec.a = sec.a.replace( /\(/g , " ( " );
        sec.a = sec.a.replace( /\)/g , " ) " );
        sec.a = sec.a.replace( /\[/g , " [ " );
        sec.a = sec.a.replace( /\]/g , " ] " );
        sec.a = sec.a.replace( /ـ/g , "" );
        sec.a = sec.a.replace( /  +/g , " " );

    }
    return db;
}

// .. ======================================================================

function add_FLP ( db ) {
    for ( let sec of db ) {
        sec.inFarsi = sec.a.replace( /قَوْلِ اللهِ عَزَّ وَجَلَّ/g , " " );
        sec.inFarsi = sec.inFarsi.replace( /كَانَ رَسُولُ اللهِ صلى‌الله‌عليه‌وآله‌وسلم/g , " " );
        sec.inFarsi = sec.inFarsi.replace( /قَالَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام :/g , " " );
        sec.inFarsi = sec.inFarsi.replace( /سَأَلْتُ أَبَا عَبْدِ اللهِ عليه‌السلام عَنْ/g , " " );
        sec.inFarsi = sec.inFarsi.replace( /سَأَلْتُ أَبَا عَبْدِ اللهِ عليه‌السلام عَنِ/g , " " );
        sec.inFarsi = sec.inFarsi.replace( /سَأَلْتُ أَبَا عَبْدِ اللهِ عليه‌السلام/g , " " );
        sec.inFarsi = sec.inFarsi.replace( /سَأَلْتُ أَبَا الْحَسَنِ عليه‌السلام/g , " " );
        sec.inFarsi = sec.inFarsi.replace( /سَأَلْتُ أَبَا جَعْفَرٍ عليه‌السلام/g , " " );

        sec.inFarsi = inFarsiLetters( sec.inFarsi );
        sec.inFaParts = removeUnimportantWords( sec.inFarsi.split( " " ) );
    }
    return db;
}

function sort_byLength ( db ) {
    let i = 0
    for ( let sec of db ) sec.i = i++;
    return db.sort( (a,b) => a.a.length > b.a.length ? 1 : -1 );
}

// .. ======================================================================

function removeUnimportantWords ( arr ) {
    let omit = [ 
        "و", "ان", "", "(", ")", "[", "]", 
        ,"ـ","لا","،",":", "؟","»","«", "؛","!",
        "من","لم","ما","به","اذا","عن","مع","الله","لیس","الی","علی","کان","له","لله","له","معه",
        "رب","ی","خیر","شی","ا","یا","الشر", "ه"
    ];
    // .. remove some first letters
    for ( let i in arr ) 
        if ( arr[i].slice(0,1) === "و" || arr[i].slice(0,1) === "ف" || arr[i].slice(0,1) === "ل" || arr[i].slice(0,1) === "ال" ) 
            arr[i] =  arr[i].slice(1);

    arr = arr.filter( a => !~omit.indexOf( a ) && isNaN( Number(a) ) )
    return arr;

}

// .. ======================================================================

function examine_X_by_A ( AID, XID, db ) {

    let A_word, X_word, id_A, id_X, partsA, partsX;
    let totalDiff, totalParts, correlationRate;
    let A = db[ AID ];
    let X = db[ XID ];

    partsA = A.inFaParts.slice(0);
    partsX = X.inFaParts.slice(0);

    // .. trimming by A on (X and A)
    for ( let i in A.inFaParts ) {
        A_word = partsA[i];
        // .. find in X
        id_X = partsX.findIndex( x => x === A_word );
        // .. remove from X and A
        if ( ~id_X ) { partsX.splice( id_X, 1 ); delete partsA[i]; }
        // .. sanitizing partA
    } partsA = partsA.filter( a => a );

    // .. trimming by X on (X and A)
    for ( let i in X.inFaParts ) {
        X_word = partsX[i];
        // .. find in A
        id_A = partsA.findIndex( a => a === X_word );
        // .. remove from X and A
        if ( ~id_A ) { partsA.splice( id_A, 1 ); delete partsX[i]; }
        // .. sanitizing partX
    } partsX = partsX.filter( x => x );

    // .. report important ones
    if ( A.i !== X.i ) {

        totalParts = A.inFaParts.length + X.inFaParts.length;
        totalDiff = partsA.length + partsX.length;
        correlationRate = ( (totalParts - totalDiff) / totalParts )*100 | 0;
        if ( correlationRate > quality ) {

            dupC++;

            let pickedID = ( A.a.length > X.a.length ) ? AID : XID;
            let outID = ( A.a.length > X.a.length ) ? XID : AID;
            let pickedOne = ( A.a.length > X.a.length ) ? A : X;
            let outOne = ( A.a.length > X.a.length ) ? X : A;
            outOne.qc = quality/100
            let cont = [];
            let tmpX = [];
            if ( typeof pickedOne.x === "object" ) {
                if ( outOne.x ) tmpX = outOne.x;
                delete outOne.x;
                cont = [ ...pickedOne.x, ...tmpX, outOne ];
            }
            else {
                if ( outOne.x ) tmpX = outOne.x;
                delete outOne.x;
                cont = [ ...tmpX, outOne ];
            }
            let picked = {
                a: pickedOne.a,
                inFarsi: pickedOne.inFarsi,
                inFaParts: pickedOne.inFaParts,
                b: pickedOne.b,
                c: pickedOne.c,
                d: pickedOne.d,
                i: pickedOne.i,
                x: cont,
            }

            let out = {
                a: null,
                inFaParts: [],
                i: outOne.i,
            }

            db[ pickedID ] = picked;
            db[ outID ] = out;

        }

    }

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
