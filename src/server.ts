import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import { newOnes }                      from "./db/base/newOne"

// .. ======================================================================
tools.notify( " Add New Items" );
// .. ======================================================================
console.time( "App Clock" );
// .. ======================================================================
// .. read DBs
storage.update();
let newDB = tools.newDBConverter( newOnes );
let mox = storage.mox;
// .. ======================================================================
// .. section for new DBs
if ( newDB.length ) {
    // .. ----------------------------------------------------------------
    // .. [addTmpProps]
    tools.addTmpProps( newDB );
    tools.addTmpProps( storage.mox );
    // .. ----------------------------------------------------------------
    // .. create new R for newDB
    let R = tools.R( newDB, storage.mox );
    // .. ----------------------------------------------------------------
    // .. [R_optimizer] ( ?>67 )
    let R__ = tools.R_optimizer ( R, 67 );
    // .. ----------------------------------------------------------------
    if ( R__.length ) {
        // // .. [R2Bound]
        // let tmpB = tools.R2Bound( R__, storage.grand_db.length );
        // // .. [boundBoxDivider_SD]
        // let tmpE = tools.boundBoxDivider( tmpB );
        // storage.info_save( tmpE.single, "tunned", "single", true );
        // storage.info_save( tmpE.double, "tunned", "double", true );
        // storage.info_save( tmpE.m_1, "tmp", "m_1", true );
        // // .. refresh DBs
        // storage.update();
        // // .. --------------------------------------------------------
        // // .. re-do the process for remaining "m_1" ==> "m_2"
        // let m_2 = tools.aggressiveClusterPeptics( storage.m_1, R__ );
        // storage.info_save( m_2, "tmp", "m_2", true );
        // // .. refresh DBs
        // storage.update();
        // let tmpE2 = tools.multiScatter( storage.m_2 );
        // storage.info_save( tmpE2.multi, "tunned", "multi", true );
        // storage.info_save( tmpE2.other, "tunned", "other", true );
        // // .. refresh DBs
        // storage.update();
        console.log("CODE IT!");
    }
    // .. ----------------------------------------------------------------
    else {
        tools.dbCleaner( newDB, true );
        mox = [ ...storage.mox, ...newDB ];
    }
}
// .. ======================================================================
// .. last text edits
tools.dbCleaner( mox, false );
mox = tools.finalEditor( mox );
// .. save it
tools.dbExporter( mox );
// .. save it
// .. done! :)
// .. ======================================================================


// newDB.forEach( x => {
//     console.log(x);
    
// } )


// .. ======================================================================
// .. done! :)
// .. ======================================================================
tools.notify( null, true );
// .. ======================================================================

