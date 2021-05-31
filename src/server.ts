import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";

const title = "-----Parser 1---";
const version = "2.0.0";
console.clear();
console.log( "###" +title +"###\n###-----v." +version +"----###\n" );

// .. ======================================================================

let startTime = new Date().getTime(), 
    currentTime = new Date().getTime();

let quality = 100;
let dupC = 0;
let dMax = [ ...storage.db_kafi, ...storage.db_misc ];

// .. ======================================================================
console.time( "App Clock" );
// .. ======================================================================

// .. do update DBs
tools.do_charSpacer( dMax );


                // .. from no on we have tunned DBs in Hand                 


//.. add some new properties to the DBs
tools.addTmpProps( dMax );

let co = [];
let cVal;
for ( let i=0; i<dMax.length; i++ ) {
    // tools.timer( dMax.length, i, currentTime, startTime, title, version, quality, dupC );
    for ( let j=0; j<dMax.length; j++ ) {
        cVal = tools.correlationCalculator(i,j,dMax);
        if(cVal[2]>30) co.push(cVal);
    }
}

storage.info_save( co, "tunned", "correlations_"+"dMax" );



// .. save results
storage.db_save( storage.db_kafi, "tunned", "Al-Kafi" );
storage.db_save( storage.db_misc, "tunned", "misc" );

// .. ======================================================================
console.log( "\n" );
console.timeEnd( "App Clock" );
console.log( "\n###-----Done!------###\n\n" );
// .. ======================================================================

