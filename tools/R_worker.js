const tools = require( "./tools" );
const { workerData, parentPort, threadId } = require('worker_threads');

let R = [];
let dbs = workerData;
let db = [];
for ( let p of dbs ) db = [ ...db, ...p ];

( async function rrr () {

    let r;
    let fragment = tools.fragment;

    let A = db.length*( threadId-1 )/fragment | 0;
    let B = db.length*( threadId )/fragment | 0;

    for ( let i=A; i<B; i++ ) {
        await tools.R( db[i], db.slice( i+1 ) ).then( x => r = x );
        R = [ ...R, ...r ];
    }

    parentPort.postMessage( R );

} )();