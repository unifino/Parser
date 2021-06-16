import * as dbExporter                  from "./server_db_exporter";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
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
    await server002.init();



        // .. load db
        let db_Path = "src/db/tmp/01.json";
        let db: TS.db = JSON.parse( fs.readFileSync( db_Path, 'utf8' ) );
        // .. [addTmpProps]
        tools.addTmpProps( db );
        for ( let cell of db ) { 
            cell.j = cell.d as number; 
            cell.n = cell.d as number; 
        }
        // .. ----------------------------------------------------------------
        // .. create new R for newDB
        let R: TS.R[] = [];
        let start_time = new Date().getTime();
        let title = " R Calculation";

        for ( let i in db ) {
            tools.timer( db.length, Number(i), start_time, title );
            R = [ ...R, ...tools.R( db[i], db.slice( Number(i) +1 ) ) ];
            if ( Number(i) % 999 ) R = R.filter( x => x[2] > 30 );
        }
        fs.writeFileSync( "src/db/tmp/R.json", JSON.stringify(R) );



    // .. end of the application
    tools.notify( null, true );

}

ignite();

// .. ======================================================================

