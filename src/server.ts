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

// // .. do update DBs
// tools.do_charSpacer( storage.db_kafi );
// tools.do_charSpacer( storage.db_misc );




// ..
// ..
// ..
// ..
// ..
// ..
// ..
// ..
// ..
// ..


// // .. allocate j index
// tools.jAllocator( storage.db_kafi, storage.db_misc );
// let mox: TS.db = [];
// let ref = [...storage.db_kafi,...storage.db_misc ];
// // .. match for singles
// for ( let a of storage.singles ) mox.push( ref[a] );
// // .. match for doubles
// mox = [ ...mox, ...tools.MOX( storage.doubles, ref ) ];
// // .. match for multiples
// mox = [ ...mox, ...tools.MOX( storage.multiples, ref ) ];
// // .. allocate n index
// for ( let i=0; i<mox.length; i++ ) mox[i].n = i+1;




// .. save results
// storage.db_save( storage.db_kafi, "ready", "Al-Kafi" );
// storage.db_save( storage.db_misc, "ready", "misc" );

// storage.info_save( clipBox, "tunned", "clipBox", true );

// .. ======================================================================
console.log( "\n" );
console.timeEnd( "App Clock" );
console.log( "\n###-----Done!------###\n\n" );
// .. ======================================================================

