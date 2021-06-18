import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";

// .. ======================================================================

export function append_0 ( item: TS.db_item, idx: number ) {

    // .. skip
    if ( !~idx ) return item;

    item[0] = item[0] ? item[0] +" " : "";
    item[0] = item[0] + item.a.slice( 0, idx );
    item.a = item.a.slice( idx );

    return item;

}

// .. ======================================================================

export function append_9 ( item: TS.db_item, idx: number ) {

    // .. skip
    if ( !~idx ) return item;

    item[9] = item[9] ? " " +item[9] : "";
    item[9] = item.a.slice( idx ) + item[9];
    item.a = item.a.slice( 0, idx );

    return item;

}

// .. ======================================================================

export function hrCtr ( page: string[], HR: string ) {

    let hr: RegExpMatchArray;

    for ( let i in page ) {
        page[i] = page[i].replace( /libNormal0/g, 'libNormal' );
        page[i] = page[i].replace( /libFootnote0/g, 'libFootnote' );
        page[i] = page[i].replace( /<p class=libFootnote>______+/g, HR );
        page[i] = page[i].replace( /<p class=libNormal>______+/g, HR );
        page[i] = page[i].replace( /<p>______+/g, HR );
    }

    hr = page.join("").match( /<p class=libLine>/ ) || [];

    return [ hr, page ];

}

// .. ======================================================================

export function set_trimmer ( str: string ) {

    str = str.replace( /<span class=libFootnote>/g, "" );
    str = str.replace( "<p class=libFootnote>", "" );
    str = str.replace( "<p class=libNormal>", "" );
    str = str.replace( "<span class=libNormal>", "" );
    str = str.replace( "<span class=libNum>", "" );
    str = str.replace( "<p class=libPoem>", "" );
    str = str.replace( "<p class=libPoemCenter>", "" );
    str = str.replace( /<\/span>/g, "" );
    str = str.replace( /<p>/g, "" );
    str = str.replace( /<\/p>/g, "" );

    str = str.replace( /(<([^>]+)>)/ig, '' );

    str = str.replace( / ‌/g, " " );
    str = str.replace( / +/g, " " );
    str = str.trim();

    let a = ( str.match( /\[/g ) || [] ).length;
    let b = ( str.match( /\]/g ) || [] ).length;
    // .. report errors
    if ( a !== b ) console.log( "Unexpected ID Format: ", a, b, str );

    return str;

}

// .. ======================================================================

export function saveDB ( db: TS.db, tmpFolder: string, realSave?: boolean ) {
    let _01_path = tmpFolder + "01.json";
    if ( !realSave ) fs.rmSync( _01_path, { force: true } );
    else fs.writeFileSync( _01_path, JSON.stringify(db,null,"\t") );
}

// .. ======================================================================

export function RR ( db: TS.db, tmpFolder: string ) {

    let R: TS.R[] = [],
        start_time = new Date().getTime(),
        title = " R Calculation";

    // .. [addTmpProps]
    tools.addTmpProps( db );
    for ( let cell of db ) { 
        cell.j = cell.d as number; 
        cell.n = cell.d as number; 
    }

    for ( let i in db ) {
        tools.timer( db.length, Number(i), start_time, title );
        R = [ ...R, ...tools.R( db[i], db.slice( Number(i) +1 ) ) ];
    }

    fs.writeFileSync( tmpFolder + "RR.json", JSON.stringify(R) );

}

// .. ======================================================================

export function R_R ( db_01: TS.db, db_02: TS.db ) {

    let R: TS.R[] = [];

    // .. [addTmpProps]
    tools.addTmpProps( db_01 );
    tools.addTmpProps( db_02 );
    for ( let cell of db_01 ) { 
        cell.j = cell.d as number; 
        cell.n = cell.d as number; 
    }
    for ( let cell of db_02 ) { 
        cell.j = cell.d as number; 
        cell.n = cell.d as number; 
    }

    R = tools.R_old( db_02, db_01, false );
    fs.writeFileSync( "src/db/tmp/R_1x2.json", JSON.stringify(R) );

}

// .. ======================================================================
