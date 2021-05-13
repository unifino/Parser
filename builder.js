import * as fs                          from "fs";

console.log( "\n... AL-KAFI DB Builder v.1.0.0 ...\n");

// .. ======================================================================

let db = [];

// .. ======================================================================

async function init () {

    let filePath = "db/exported.json";
    // .. check
    await fs.promises.access( filePath, fs.constants.F_OK )
    // .. file is found
    .then( () => {} )
    // .. file is NOT found
    .catch( e => console.log(e) );

    // .. get source
    let extracted = JSON.parse( fs.readFileSync( filePath , 'utf8' ) );

    extracted.forEach( (h, i) => {

        let full = h.join( " " );

        let fDQ = ( full.match( /«/g ) || [] ).length;
        let lDQ = ( full.match( /»/g ) || [] ).length;
        if ( fDQ === 1 && lDQ === 1 ) {

            extracted[ i ] = {
                a: full.substring( full.indexOf( "«" ), full.indexOf( "»" ) +1 ),
                b: null,
                c: null,
                d: i
            };
        }
        else {
            // console.log( fDQ, lDQ );
        }
        // let firstQ = -1;
        // for ( let r=0; r<h.length; r++ ) {
        //     if ( ( h[r].match( /:/g ) || [] ).length ) firstQ = r;
        // }
        // // .. remove it ?!
        // if ( firstQ === -1 ) {
        //     console.log( "removed: ", i );
        //     extracted.splice( h, 1 );
        // }
        // else {
        //     // .. remove these lines
        //     console.log( firstQ, h.length, i )
        // }

    } );

    db = extracted;

}

// .. apply on all books
await init ();


await fs.writeFileSync( "db/db.json", JSON.stringify( db, null, "\t" ) );


// .. tools ================================================================

