import * as fs                          from "fs";
import { kafi }                         from "./export.js";

// kafi.forEach( (x,i) => {
//     if ( x.d == i+1 ) console.log( i+1, x.d );
// } )
// err 10793

let test = "";
for ( let x of kafi ) {
    // .. unify some tags
    x.a = x.a.replace( /libFootnoteAie/g, "libAie" );
    x.a = x.a.replace( /libFootnoteAlaem/g, "libAlaem" );
    // .. simplify
    x.a = x.a.replace( /<span class=libAlaem>عزوجل<\/span>/g, " عزوجل " );
    x.a = x.a.replace( /<span class=libAlaem>عليه‌السلام<\/span>/g, " عليه‌السلام " );
    x.a = x.a.replace( /<span class=libAlaem>\(<\/span>/g, "" );
    x.a = x.a.replace( /<span class=libAlaem>\)<\/span>/g, "" );
    x.a = x.a.replace( /<span class=libAlaem>عليه‌السلام<\/span>/g, " عليه‌السلام " );
    x.a = x.a.replace( /<span class=libAlaem>عليهم‌السلام<\/span>/g, " عليهم‌السلام " );
    x.a = x.a.replace( /<span class=libAlaem>عليهما‌السلام<\/span>/g, " عليهما‌السلام " );
    x.a = x.a.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    x.a = x.a.replace( /<span class=libAlaem>عليه‌السلام<\/span>/g, " عليه‌السلام " );
    x.a = x.a.replace( /<span class=libAlaem>رضي‌الله‌عنه<\/span>/g, " رضي‌الله‌عنه " );
    x.a = x.a.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    x.a = x.a.replace( /<span class=libAlaem>عليها‌السلام<\/span>/g, " عليها‌السلام " );
    x.a = x.a.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله\(<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    x.a = x.a.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله‌<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    x.a = x.a.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله‌وسلم<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    x.a = x.a.replace( /<span class=libAlaem>عليها‌السلام\(<\/span>/g, " عليها‌السلام " );
    x.a = x.a.replace( /<span class=libAlaem>رحمه‌الله<\/span>/g, " رحمه‌الله " );
    x.a = x.a.replace( /<span class=libAlaem>رحمهم‌الله<\/span>/g, " رحمهم‌الله " );
    x.a = x.a.replace( /<span class=libAlaem>رحمه‌الله<\/span>/g, " رحمه‌الله " );
    x.a = x.a.replace( /<span class=libAlaem>.<\/span>/g, " . " );
    x.a = x.a.replace( /<span class=libFootnote0>.<\/span>/g, " . " );
    x.a = x.a.replace( /<span class=libFootnoteBold>.<\/span>/g, " . " );
    x.a = x.a.replace( /<span class=libAlaem>عليه‌السلام‌....<\/span>/g, " عليه‌السلام " );
    // .. Caution
    x.a = x.a.replace( /<span class=libAlaem>عليه‌السلام\(<\/span>/g, " عليه‌السلام " );
    // .. trim
    x.a = x.a.replace( /<span class=libAlaem>‌<\/span>/g, " " );
    x.a = x.a.replace( /<p class=libPoem>/g, " " );
    x.a = x.a.replace( / +/g, " " );
    x.a = x.a.trim();

    // .. << on start
    let start = x.a.slice( 0, x.a.indexOf( "«" ) );
    let e = [299,1386,1439,2560,3205,3258,3312,3358,3375,3394,3450,3456,3563,3584,3820,3827,3907,3913,3926,3929,3991,3995,4073,4249,4278,4304,4305,4335,4345,4346,4352,4510,4548,4676,4735,4759,4835,4848,4851,5029,5088,5109,5288,5377,5417,5457,5472,5606,5623,5777,5800,5820,5821,5847,5928,6030,6101,6359,6406,6425,6428,6539,6636,6652,7022,7308,7311,7342,7415,7422,7456,7497,7797,7807,7809,7817,7826,7834,7888,7949,7999,8155,8257,8314,8453,8463,8510,8544,8545,8561,8579,8607,8632,8809,8864,9011,9081,9248,9304,9535,9576,9883,9885,9921,9933,9934,9958,10153,10155,10429,10458,10486,10522,10532,10535,10561,10571,10751,10936,10939,10947,10980,10987,10999,11015,11042,11111,11117,11132,11171,11264,11307,11327,11349,11351,11399,11410,11420,11424,11427,11451,11457,11487,11720,11881,11912,11944,11945,11956,12082,12171,12291,12322,12341,12349,12360,12648,12662,12664,12669,12693,12696,12711,12785,12876,12896,12947,13014,13176,13383,13392,13393,13397,13398,13403,13415,13425,13453,13525,13573,13602,13621,13623,13634,13640,13644,13673,13754,13762,13784,13801,13849,13924,13927,13933,13941,13967,14029,14203,14267,14345,14424,14496,14499,14523,14756,14888,15030,15069,15101,15121,15227,15289,15322,15323];
    if ( start.length < 40 && ( !e.includes( x.d )) ) x.a = x.a.slice( x.a.indexOf( "«" ) +1 ).trim();
    // .. >> at end
    let end = x.a.slice( x.a.lastIndexOf( "»" ) );
    if ( end.length < 7 ) { 
        let count2 = ( x.a.match( /»/g ) || [] ).length;
        if ( count2 % 2 ) x.a = x.a.slice( 0, x.a.lastIndexOf( "»" ) ).trim();
        else x.a = x.a.slice( 0, x.a.lastIndexOf( "»" ) +1 ).trim();
    }
    // .. remove libNormal Tags
    let m = ( x.a.match( /<span class=libNormal>(.*?)<\/span>/g ) || [] );
    for ( let c of m ) {
        x.a = x.a.replace( c, c.replace( "<span class=libNormal>", " " ).replace( "<\/span>", " " ) );
    }
    // .. replace libAie with native Q tag
    let q = ( x.a.match( /<span class=libAie>(.*?)<\/span>/g ) || [] );
    for ( let c of q ) {
        x.a = x.a.replace( c, c.replace( "<span class=libAie>", " <Q>" ).replace( "<\/span>", "</Q> " ) );
    }
    // .. trim
    x.a = x.a.replace( / +/g, " " );
    x.a = x.a.trim();

    test += x.a + "\n\n";
}

fs.writeFileSync( "../test.txt", test );
