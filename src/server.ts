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
// // .. ----------------------------------------------------------------
// tools.resultValidator();
// .. ----------------------------------------------------------------
// .. allocate j index
tools.jAllocator( storage.db_kafi, storage.db_misc );
let mix = [ ...storage.double, ...storage.multi ];
let r_mix = tools.clusterRichMaker( mix )
let mox: TS.db = [];
for ( let p of r_mix ) {
    let head = tools.clusterHeadPicker( p );
    let children = p.filter( x => x.index !== head ).map( x => x.index );
    let cell: TS.db_item = storage.grand_db[ head ];
    cell.childBasket = [];
    for ( let child of children )
        cell.childBasket.push( storage.grand_db[ child ] );
    mox.push( cell );
}
for ( let x of storage.single ) mox.push( storage.grand_db[x] );
// .. control by Hand
let r_last = tools.clusterRichMaker( storage.other );
let head = tools.clusterHeadPicker( r_last[0] );
let children = r_last[0].filter( x => x.index !== head ).map( x => x.index );
let cell: TS.db_item = storage.grand_db[ head ];
cell.childBasket = [];
for ( let child of children ) cell.childBasket.push( storage.grand_db[ child ] );
mox.push( cell );
// .. sort
mox = mox.sort( (a,b) => a.j > b.j ? 1 : -1 );
// .. allocate n index
for ( let i=0; i<mox.length; i++ ) mox[i].n = i+1;
// .. save it
storage.db_save( mox, "ready", "mox" );
// .. done! :)
// .. ----------------------------------------------------------------




























// console.log("s_50\t",storage.single_50.length);
// tools.clusterBoxRealLengthReport(storage.double_50,"d_50")
// tools.clusterBoxRealLengthReport(storage.multi_50,"m_50")
// tools.clusterBoxRealLengthReport(storage.other_50,"o_50")
// console.log("\ns\t",storage.single.length);
// tools.clusterBoxRealLengthReport(storage.double,"d")
// tools.clusterBoxRealLengthReport(storage.multi,"m")
// tools.clusterBoxRealLengthReport(storage.other,"o")

// let d = tools.clusterBoxRealLengthReport(storage.other)
// let m = tools.clusterBoxRealLengthReport(storage.other)
// console.log(d.seq.includes(51947));
// console.log(m.seq.includes(51947));
// console.log(d.seq.includes(24778));
// console.log(m.seq.includes(24778));
// console.log(storage.single.includes(51947))
// console.log(storage.single.includes(24778))

// let willNotProcessedBY67 = [];
// for ( let i of storage.single ) 
//     if ( !storage.single_50.includes( i ) )
//         willNotProcessedBY67.push(i);
// console.log(willNotProcessedBY67.length);
// let solvedBy50 = []
// for ( let x of willNotProcessedBY67 )
//     solvedBy50.push(storage.double_50.find( y => y[0] === x || y[1] === x));
// solvedBy50 = solvedBy50.filter(x=>x);
// for(let x of solvedBy50) {
//     console.log(x[0],storage.grand_db[x[0]].a);
//     console.log(x[1],storage.grand_db[x[1]].a);
//     console.log("\n\n\n\n");
// }

// // .. [MOX] (match for singles doubles multiples)
// let mox: TS.db = [];
// // .. match for singles
// for ( let a of storage.single ) mox.push( storage.grand_db[a] );
// // .. match for doubles
// mox = [ ...mox, ...tools.MOX( storage.double, storage.grand_db ) ];
// // .. match for multiples
// mox = [ ...mox, ...tools.MOX( storage.multi, storage.grand_db ) ];

// // .. save
// storage.db_save( mox, "ready", "mox" );
// // .. done!

// .. ======================================================================
console.log( "\n" );
console.timeEnd( "App Clock" );
console.log( "\n###-----Done!------###\n\n" );
// .. ======================================================================

