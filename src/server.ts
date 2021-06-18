import * as SCT                         from "./server_common_tools";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
import * as storage                     from "./storage";
import * as tools                       from "./tools";
import * as fs                          from "fs";
import * as TS                          from "./types";

// .. ======================================================================

// .. major init function
async function ignite () {
    // .. create title
    tools.notify();
    // .. capture time
    console.time( "App Clock" );

    // .. actual steps goes here:

        // await server001.ignite( "Cached" );
        // await server002.ignite( "Cached" );
        SCT.R_R( server001.db_v1, server002.db_v1 );

    // .. end of the application
    tools.notify( null, true );

}

ignite();

// .. ======================================================================
