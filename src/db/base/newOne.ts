import * as TS                          from "../../types";
let new_one = require( "./new.json" );

export let newOnes: TS.newDB = [ ...new_one.filter( x => x.a ) ];

