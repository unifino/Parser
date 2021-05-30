import * as fs                          from "fs";

const title = "Unifier Source [A | X]";
const version = "1.0.0";

console.clear();
console.log( "### " + title + " ### ###    v." + version + "    ###\n" );

const A_QC = 50;
const X_QC = 50;
const A_QC_R = "__50";
const X_QC_R = "__50";

// .. ======================================================================

let filePath_kafi = "db/output/Al-Kafi_" + A_QC + A_QC_R + ".json";
// .. check Al-Kafi
await fs.promises.access( filePath_kafi, fs.constants.F_OK )
// .. file is found
.then( () => {} )
// .. file is NOT found
.catch( e => console.log(e) );

let filePath_misc = "db/output/Misc_" + X_QC + X_QC_R + ".json";
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

db_kafi = marker ( db_kafi, true );
db_misc = marker ( db_misc, false );

// .. write down db
let exported_A = "db/exported_db/Al-Kafi.json";
fs.writeFileSync( exported_A, JSON.stringify( db_kafi, null, "\t" ) );
// .. write down db
let exported_X = "db/exported_db/Misc.json";
fs.writeFileSync( exported_X, JSON.stringify( db_misc, null, "\t" ) );


// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function marker ( db, isKafi = false ) {

    let kafi = 15413;
    for ( let i=0; i < db.length; i++ ) {
        db[i].n = isKafi ? db[i].d : ( i +1 + kafi );
    }
    return db;

}

// .. ======================================================================
