const tools = require( "./tools" );
const report = require( "./logger" );
const readline = require( "readline" );
const { workerData, parentPort, threadId } = require('worker_threads');

let R = [];
let dbs = workerData;
let db = [];
for ( let p of dbs ) db = [ ...db, ...p ];

( async () => {

    let r;
    let time = new Date().getTime();

    let A = db.length*( threadId-1 )/tools.frag | 0;
    let B = db.length*( threadId )/tools.frag | 0;

    for ( let i=A; i<B; i++ ) {
        report.timer( i, B, time, threadId +4 );
        await tools.R( db[i], db.slice( i+1 ) ).then( x => r = x );
        R = [ ...R, ...r ];
    }

    parentPort.postMessage( R );

} )();
