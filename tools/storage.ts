import * as fs                          from "fs";
import * as TS                          from "../types/types";
import * as basic_tools                 from "./basic_tools";

// .. ====================================================================

export function saveData (
    data: []|{},
    path: string,
    name: string,
    beautify?: boolean
)
{
    path = path + "/" + name + ".json";
    // .. remove File
    if ( !data ) fs.rmSync( path, { force: true } );
    // .. write down Data
    else {
        let str = JSON.stringify( data, null, "\t" );
        if ( beautify ) str = basic_tools.beautyJSON( str );
        fs.writeFileSync( path, str );
    }
}

// .. ====================================================================

export function saveTMP ( data: string, format: "text"|"html" ) {
    // .. write down Data
    fs.writeFileSync( "tmp/ctl." +  format, data );
}

// .. ====================================================================

export function getParts ( tmpFolder: string ) {

    let single_Path = tmpFolder + "single.json";
    let double_Path = tmpFolder + "double.json";
    let multi_Path = tmpFolder + "multi.json";
    let other_Path = tmpFolder + "other.json";

    let single = JSON.parse( fs.readFileSync( single_Path, 'utf8' ) );
    let double = JSON.parse( fs.readFileSync( double_Path, 'utf8' ) );
    let multi = JSON.parse( fs.readFileSync( multi_Path, 'utf8' ) );
    let other = JSON.parse( fs.readFileSync( other_Path, 'utf8' ) );

    return {
        single: single,
        double: double,
        multi: multi,
        other: other,
    }

}

// .. ====================================================================
