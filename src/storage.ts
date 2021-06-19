import * as fs                          from "fs";
import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";

// .. ======================================================================

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

// .. ======================================================================
