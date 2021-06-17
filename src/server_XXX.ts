import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";

tools.notify();
// .. ======================================================================
console.time( "App Clock" );
// .. ======================================================================
// .. read DBs
storage.update();
// .. alter DBs
tools.do_charSpacer( storage.db_kafi );
tools.do_charSpacer( storage.db_misc );
// // .. ----------------------------------------------------------------
// // .. [addTmpProps]
// tools.addTmpProps( storage.db_kafi );
// tools.addTmpProps( storage.db_misc );
// // .. loop on [R] => TS.R
// // ........ Code Omitted ............
// // .. ----------------------------------------------------------------
// // .. [R_optimizer] ( ?>67 )
// let R__ = tools.R_optimizer ( storage.R, 67 );
// // .. ----------------------------------------------------------------
// // .. [R2Bound]
// let tmpB = tools.R2Bound( R__, storage.grand_db.length );
// // .. [boundBoxDivider_SD]
// let tmpE = tools.boundBoxDivider( tmpB );
// storage.info_save( tmpE.single, "tunned", "single", true );
// storage.info_save( tmpE.double, "tunned", "double", true );
// storage.info_save( tmpE.m_1, "tmp", "m_1", true );
// // .. refresh DBs
// storage.update();
// // .. ----------------------------------------------------------------
// // .. re-do the process for remaining "m_1" ==> "m_2"
// let m_2 = tools.aggressiveClusterPeptics( storage.m_1, R__ );
// storage.info_save( m_2, "tmp", "m_2", true );
// // .. refresh DBs
// storage.update();
// // .. ----------------------------------------------------------------
// let tmpE2 = tools.multiScatter( storage.m_2 );
// storage.info_save( tmpE2.multi, "tunned", "multi", true );
// storage.info_save( tmpE2.other, "tunned", "other", true );
// // .. refresh DBs
// storage.update();
// .. ----------------------------------------------------------------
tools.resultValidator();
// .. ----------------------------------------------------------------
// .. allocate temporary ref j index
tools.jAllocator( storage.db_kafi, storage.db_misc );
// .. create DBs
let mox = tools.dbBuilder();
// .. last text edits
mox = tools.finalEditor( mox );
// .. save it
tools.dbExporter( mox );
// .. done! :)
// .. ======================================================================
tools.notify( null, true );
// .. ======================================================================

