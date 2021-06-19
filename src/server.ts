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

        let n_pad = await server001.ignite( "Cached", 0 );
        // n_pad = 15413
        await server002.ignite( "Cached", n_pad );
        // SCT.R_R( server001.db_v1, server002.db_v1 );

    // .. end of the application
    tools.notify( null, true );

}

ignite();

// .. ======================================================================

function  R_updater() {
    for ( let p of server002.R ) {
        p[0] += 15413;
        p[1] += 15413;
    }
    storage.tmp_save( server002.R, server002.tmpFolder, "RR", true )
}

// .. ======================================================================
