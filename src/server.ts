import * as dbExporter                  from "./server_db_exporter";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
import * as tools                       from "./tools";
// .. ======================================================================

// .. major init function
async function ignite () {
    // .. create title
    tools.notify();
    // .. capture time
    console.time( "App Clock" );
    // .. actual steps goes here:
    await server002.init();
    // .. end of the application
    tools.notify( null, true );
}

ignite();

// .. ======================================================================

