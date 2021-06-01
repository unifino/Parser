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
// .. read db
storage.update();
// .. do update DBs
tools.do_charSpacer( storage.db_kafi );
tools.do_charSpacer( storage.db_misc );
// .. ----------------------------------------------------------------
// // .. [addTmpProps]
// tools.addTmpProps( storage.db_kafi );
// tools.addTmpProps( storage.db_misc );
// // .. loop on [R] => TS.R
// // ........ Code Omitted ............
// .. ----------------------------------------------------------------
// .. [R_optimizer] ( ?>70 )
let tmpR = tools.R_optimizer ( storage.R, 70 );
// .. [R2Bound]
let tmpB = tools.R2Bound( tmpR );
// .. [boundBoxDivider_SD]
let tmpE = tools.boundBoxDivider( tmpB );
storage.info_save( tmpE.single, "tunned", "single", true );
storage.info_save( tmpE.double, "tunned", "double", true );
storage.info_save( tmpE.pBound, "tunned", "pBound", true );
storage.update();
// .. ----------------------------------------------------------------
// .. [clusterPepticBounds]
let multi = tools.clusterPepticBounds ( storage.pBound, storage.R )
storage.info_save( multi, "tunned", "multi", true );
storage.update();
// .. ----------------------------------------------------------------
// .. check if multi has error ( <= 14 && > 14 )
let peptic = multi.filter( x => x.length > 14 );
if ( peptic.length ) console.log( "ERROR! PEPTIC", peptic.length );
else console.log( ":)" );
for ( let p of peptic ) { console.log(p.length) }
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
// .. save. done!


// .. ======================================================================
console.log( "\n" );
console.timeEnd( "App Clock" );
console.log( "\n###-----Done!------###\n\n" );
// .. ======================================================================

