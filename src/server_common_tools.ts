import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";

// .. ======================================================================

export function some_edits ( str: string ) {

    for ( let e of basic_tools.erabs ) {
        let regx = new RegExp( " " +e, "g" );
        str = str.replace( regx, e );
    }

    str = str.replace( / ‌/g, " " );
    str = str.replace( /ـ/g , "" );
    str = str.replace( / +/g, " " );
    str = str.replace( /\.\.\.\.\.+/g, "....." );
    str = str.replace( /\.\.\.\.\./g, " " );
    str = str.replace( /\[\.\.\.\]/g, " " );
    str = str.replace( /\. \. \./g, " ... " );
    str = str.replace( / +/g, " " );
    str = str.replace( /\.\. \./g, " ... " );
    str = str.replace( / +/g, " " );
    str = str.replace( /، +/g, "،" );
    str = str.replace( / +،/g, "،" );
    str = str.replace( / ، /g, "،" );
    str = str.replace( /،/g, " ، " );
    str = str.replace( /،  ،/g, " ، " );
    str = str.replace( /، +/g, "،" );
    str = str.trim();

    str = str.replace( /عَزَّوَجَلَّ/g, " عزوجل " );
    str = str.replace( /- جَلَّ وعَزَّ -/g, " عزوجل " );
    str = str.replace( /- عَزَّ وجَلَّ -/g, " عزوجل " );
    str = str.replace( /- عز وجل -/g, " عزوجل " );
    str = str.replace( /عَزَّ وجَلَّ/g, " عزوجل " );
    str = str.replace( /جَلَّ وعَزَّ/g, " عزوجل " );
    str = str.replace( /عز وجل/g, " عزوجل " );
    str = str.replace( /- عَزَّ وَجَلَّ -/g, " عزوجل " );
    str = str.replace( /عَزَّ وَجَلَّ/g, " عزوجل " );
    str = str.replace( /- عَزَّ وَجَلَ -/g, " عزوجل " );
    str = str.replace( /عَزَّ وَجَلَ/g, " عزوجل " );
    str = str.replace( /- عَزّ وَجَلَّ -/g, " عزوجل " );
    str = str.replace( /عَزّ وَجَلَّ/g, " عزوجل " );
    str = str.replace( /- عَزَّ وجلَّ -/g, " عزوجل " );
    str = str.replace( /عَزَّ وجلَّ/g, " عزوجل " );
    str = str.replace( /- عَزَّ وَ جَلَّ -/g, " عزوجل " );
    str = str.replace( /عَزَّ وَ جَلَّ/g, " عزوجل " );
    str = str.replace( /- عزَّ وَ جَلَّ -/g, " عزوجل " );
    str = str.replace( /- عزَّ وَ جَلَّ -/g, " عزوجل " );
    str = str.replace( /عز و جل/g, " عزوجل " );
    str = str.replace( /عزَّ وَ جَلَّ/g, " عزوجل " );
    str = str.replace( /عزّوجلّ/g, " عزوجل " );
    str = str.replace( /عَزَّوجلَّ/g, " عزوجل " );
    str = str.replace( /عَزَّوَجلَّ \.\.\./g, " عزوجل " );
    str = str.replace( /- عَزَّوَ جَلَّ -/g, " عزوجل " );
    str = str.replace( /تَبَارَكَ اسْمُهُ/g, " عزوجل " );
    str = str.replace( /- تَبَارَكَ وَتَعَالى -/g, " عزوجل " );
    str = str.replace( /تَبَارَكَ وَتَعَالى/g, " عزوجل " );

    str = str.replace( /\( عليه‌السلام \)/g, " عليه‌السلام " );
    str = str.replace( /- علیها السلام -/g, " عليها‌السلام " );
    str = str.replace( /علیها السلام/g, " عليها‌السلام " );
    str = str.replace( /عليهم السلام/g, " عليهم‌السلام " );
    str = str.replace( /- عليهما السلام -/g, " عليهما‌السلام " );
    str = str.replace( /\(علیهما السلام\)/g, " عليهما‌السلام " );
    str = str.replace( /علیهما السلام/g, " عليهما‌السلام " );
    str = str.replace( /علیهم السلام/g, " عليهم‌السلام " );
    str = str.replace( /علیه‏ السلام/g, " عليه‌السلام " );
    str = str.replace( /\(علیه السلام\)/g, " عليه‌السلام " );
    str = str.replace( /علیه السلام/g, " عليه‌السلام " );
    str = str.replace( /- صلى‌الله‌عليه‌وآله‌وسلم -/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /- صلّي الله عليه و آله -/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /علیهماالسلام/g, " عليهما‌السلام " );
    str = str.replace( /علیه السّلام/g, " عليه‌السلام " );
    str = str.replace( /(صلی الله علیه و آله و سلم)/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلی الله علیه و آله و سلم/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلی الله علیه و آله/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /- رَحِمَهُ اللهُ -/g, " رحمه‌الله " );
    str = str.replace( /رَحِمَهُ اللهُ/g, " رحمه‌الله " );

    // str = str.replace( /\. ،/g, " ، " ).replace( /  +/g, " " );
    // str = str.replace( /\. :/g, " . " ).replace( /  +/g, " " );
    // str = str.replace( /\. \./g, " . " ).replace( /  +/g, " " );
    str = str.replace( / +/g, " " );
    str = str.trim();

    return str;

}

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

export function _R_ ( db: TS.db, tmpFolder: string ) {

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

    storage.saveData( R, tmpFolder, "RR", true );

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
    storage.saveData( R, "src/db/tmp/", "R_1x2" );

}

// .. ======================================================================

export function janitor ( tmpFolder: string ) {
    storage.saveData( null, tmpFolder, "single" );
    storage.saveData( null, tmpFolder, "double" );
    storage.saveData( null, tmpFolder, "multi" );
    storage.saveData( null, tmpFolder, "other" );
    storage.saveData( null, tmpFolder, "m_1" );
    storage.saveData( null, tmpFolder, "m_2" );
}

// .. ======================================================================
