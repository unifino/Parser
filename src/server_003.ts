import * as tools                       from "./tools";
import * as __                          from "./server_common_tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";
import * as cheerio                     from 'cheerio';

// .. ====================================================================

export let name      = "نهج‌البلاغة";
export let tmpFolder = "src/db/tmp/" + name + "/";
export let tmpDB_Path = tmpFolder + name + ".json";
export let tmpDB;
try { tmpDB = JSON.parse( fs.readFileSync( tmpDB_Path, 'utf8' ) ) } catch {}


// .. ====================================================================

export function init () {

    tools.notify( "  " + name + " " );

    let db = [];

    // .. get v0 [ Scratch | Cached ]
    db = load_db_v0();


    // .. write-down DB
    storage.saveData( db, tmpFolder, "01" );

}

// .. ====================================================================


function load_db_v0 () {

    let db_v0: TS.db,
        _00_Path = tmpFolder + "00.json";


    fs.rmSync( _00_Path, { force: true } );

    let textBook: string,
        book_v0: string[][],
        book_v1: string[][],
        set_v1: string[][] = [],
        set_v2: string[] = [];

    // .. convert all sourceText => set v1
    for ( let p of [ "K", "L", "H" ] ) {
        book_v0 = readSrcBook(p);
        book_v1 = getBook_v1( book_v0, p as any );
    }
    // set_v1 = [ ...set_v1, ...book_v1 ];
    // textBook = __.some_edits( textBook );
    // tools.notify( " Books Loaded!" );
    // // .. convert set v1 to v2 [ string[][]=>string[] ]
    // for ( let i in set_v1 ) set_v2 = [ ...set_v2, ...set_v1[i] ];
    // // .. get hadith prepared for extraction id from sourceText
    // for ( let i in set_v2 ) set_v2[i] = __.set_trimmer ( set_v2[i] );
    // // .. trim set v2
    // set_v2 = set_v2.filter( x => x );
    // // .. get hadith from sourceText and [ assign d & j ]
    // db_v0 = hadith_db_generator( set_v2 );
    // // .. text unifier
    // db_v0 = text_unifier( db_v0 );

    // .. save it in storage
    storage.saveData( db_v0, tmpFolder, "00" );

    return db_v0;

}

// .. ====================================================================

function readSrcBook ( code: string ): string[][] {

    let filePath = "src/db/source/" + name + "/00-" + code + ".json";
    // .. check
    fs.accessSync( filePath, fs.constants.R_OK );
    // .. get source
    let txt = fs.readFileSync( filePath, 'utf8' );

    return JSON.parse( txt )

}

// .. ====================================================================

function getBook_v1 ( book: string[][], code: "H"|"L"|"T" ) {

    console.log(book.length,code);
    
    return book;

}