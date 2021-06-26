import * as __                          from "./server_common_tools";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002-old";
import * as server003                   from "./server_003";
import * as storage                     from "./storage";
import * as tools                       from "./tools";
import * as fs                          from "fs";
import * as Path 						from "path";
import * as TS                          from "./types";

// .. ====================================================================

let tmpFolder = "src/db/tmp/";

// .. ====================================================================

console.clear();

// .. ====================================================================

let appendixPath = "src/db/base/appendix.json"
let appendixBOX: TS.db = JSON.parse( fs.readFileSync( appendixPath, "utf-8" ) );

// .. ====================================================================

export function init () {

    let mmm = [ ...server001.db, ...server002.db, ...server003.db ];
    let R: TS.R[];

    // .. update box
    tools.n_allocation( appendixBOX , 90100 );

    // R = __.R_R( appendixBOX, mmm );
    // R = tools.R_optimizer( R, 67 );

    // let clusterBox: number[][] = [];
    // for ( let p of appendixBOX ) clusterBox.push( tools.cluster( p.n, R ) );

    // storage.saveData( R, "src/db/tmp", "R_app" );
    // storage.saveData( clusterBox, "src/db/tmp", "C_app" );
    storage.saveData( appendixBOX, "src/db/tmp", "appendix.json" );

	// .. 1 . replace arabic text [ ++alaem++ ]
	// .. 2 . add b in vacant slots if founds
	// .. delete 1 & 2
	// .. 3 . add unique-ones

    // clusterBox = clusterBox.map( x => {
    //     if ( x.length === 1 ) return x;
    //     else {
    //         let picked = -1;
    //         for ( let y of x.slice(1) ) {
    //             if ( mmm.find( z => z.n === y ).cDB ) {
    //               if ( picked !== -1 ) console.log( "DOUBLE:" , picked, y );
    //                 picked = y;
    //             }
    //         }
    //         return [ x[0], picked ];
    //     }
    // } )

    // storage.saveData( PBox, "src/db/ready", "نهاية" );


}

// .. ====================================================================
