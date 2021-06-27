const tools = require( "../tools/tools" );
const report = require( "../tools/logger" );
const readline = require( "readline" );
const { workerData, parentPort, threadId } = require('worker_threads');

let R = [];
let db = workerData;

( async function _R_ () {

    let r,
        time = new Date().getTime(),
        title = " R Calc " + "part " + threadId;

    // .. [addTmpProps]
    tools.addTmpProps( db );

    let A = db.length*( threadId-1 )/8 | 0;
    let B = db.length*( threadId )/8 | 0;

    for ( let i=A; i<B; i++ ) {
        report.timer( i, B-1, time, threadId +4 );
        await tools.R( db[i], db.slice( i+1 ) ).then( x => r = x );
        R = [ ...R, ...r ];
    }

    parentPort.postMessage( R );

} )()
