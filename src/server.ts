import * as SCT                         from "./server_common_tools";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
import * as storage                     from "./storage";
import * as tools                       from "./tools";
import * as fs                          from "fs";
import * as TS                          from "./types";

// .. ======================================================================

console.clear();

// .. ======================================================================

// .. major init function
async function ignite () {
    // .. create title
    tools.notify();
    // .. capture time
    console.time( "App Clock" );

    // .. actual steps goes here:

        let n_pad: number;
        n_pad = await server001.ignite( "Scratch", 0 );
        // n_pad = 15413
        n_pad = await server002.ignite( "Scratch", n_pad );
        // n_pad = 51282 = 15413 + 35869

        // .. Self-R
        // SCT._R_( server002.db_v1, server002.tmpFolder );
        // .. Mutual-R
        // SCT.R_R( server001.db_v1, server002.db_v1 );

    // .. end of the application
    tools.notify( null, true );

}

ignite();

// .. ======================================================================

function R_updater() {

    let filePath = "src/db/tmp/R_1x2.json";
    // .. check
    fs.accessSync( filePath, fs.constants.R_OK );
    // .. get source
    let src = fs.readFileSync( filePath, 'utf8' );
    let R: TS.R = JSON.parse( src );
    for ( let p of R ) p[0] += server001.db_v1.length;
    // for ( let p of server002.R ) {
    //     p[0] += 15413;
    //     p[1] += 15413;
    // }
    storage.saveData( R, "src/db/tmp/", "R_1x2_u", true );

}

// .. ======================================================================
