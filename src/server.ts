import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";

const title = "-----Parser-----";
const version = "2.0.0";
console.clear();
console.log( "###" +title +"###\n###-----v." +version +"----###\n" );

// .. ======================================================================
console.time( "App Clock" );
// .. ======================================================================
// .. read DBs
storage.update();
// .. alter DBs
tools.do_charSpacer( storage.db_kafi );
tools.do_charSpacer( storage.db_misc );
// .. ----------------------------------------------------------------
// // .. [addTmpProps]
// tools.addTmpProps( storage.db_kafi );
// tools.addTmpProps( storage.db_misc );
// // .. loop on [R] => TS.R
// // ........ Code Omitted ............
// .. ----------------------------------------------------------------
// // .. [R_optimizer] ( ?>67 )
// let tmpR = tools.R_optimizer ( storage.R, 67 );
// // .. [R2Bound]
// let tmpB = tools.R2Bound( tmpR, storage.grand_db.length );
// // .. [boundBoxDivider_SD]
// let tmpE = tools.boundBoxDivider( tmpB, storage.R );
// storage.info_save( tmpE.single, "tunned", "single", true );
// storage.info_save( tmpE.double, "tunned", "double", true );
// storage.info_save( tmpE.multi, "tunned", "multi", true );
// // .. refresh DBs
// storage.update();
// .. ----------------------------------------------------------------

// // .. allocate j index
// tools.jAllocator( storage.db_kafi, storage.db_misc );
// // .. [MOX] (match for singles doubles multiples)
// let mox: TS.db = [];
// // .. match for singles
// for ( let a of storage.single ) mox.push( storage.grand_db[a] );
// // .. match for doubles
// mox = [ ...mox, ...tools.MOX( storage.double, storage.grand_db ) ];
// // .. match for multiples
// mox = [ ...mox, ...tools.MOX( storage.multi, storage.grand_db ) ];
// // .. allocate n index
// for ( let i=0; i<mox.length; i++ ) mox[i].n = i+1;
// // .. save
// storage.db_save( mox, "ready", "mox" );
// // .. done!



// .. ======================================================================
console.log( "\n" );
console.timeEnd( "App Clock" );
console.log( "\n###-----Done!------###\n\n" );
// .. ======================================================================

