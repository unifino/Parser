// .. do update DBs
tools.do_charSpacer( dMax );

let dMax = [ ...storage.db_kafi, ...storage.db_misc ];


//.. add some new properties to the DBs
tools.addTmpProps( dMax );

let co = [];
let cVal;
for ( let i=0; i<dMax.length; i++ ) {
    for ( let j=0; j<dMax.length; j++ ) {
        cVal = tools.correlationCalculator(i,j,dMax);
        if(cVal[2]>30) co.push(cVal);
    }
}

storage.info_save( co, "tunned", "correlations_"+"dMax" );