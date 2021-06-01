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
// .. [addTmpProps]
tools.addTmpProps( storage.db_kafi );
tools.addTmpProps( storage.db_misc );
// .. loop on [R] => TS.R
// ........ Code Omitted ............
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
// // .. ----------------------------------------------------------------
// tools.resultValidator();
// .. ----------------------------------------------------------------
// let c = 0;
// for ( let x of storage.single ) {
//     let t = storage.R.find( y => y[0] === x );
//     let f = false;
//     if ( t )
//         if ( t[2] > 66 ) {
//             f = true;
//             break;
//         }
//     if ( !f ) c++;
// }
// console.log(storage.single.length-c);

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

