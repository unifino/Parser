const tools = require( "./tools" );
const { workerData, parentPort, threadId } = require('worker_threads');

let R = [];
let db = workerData;

async function _R_ () {

    let r;
    let fragment = tools.fragment;

    let A = db.length*( threadId-1 )/fragment | 0;
    let B = db.length*( threadId )/fragment | 0;
    for ( let i=A; i<B; i++ ) {
        await tools.R( db[i], db.slice( i+1 ) ).then( x => r = x );
        R = [ ...R, ...r ];
        await new Promise( _ => setTimeout( _, 10 ) );
    }

    parentPort.postMessage( R );

} 

_R_();
