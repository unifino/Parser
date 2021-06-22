import * as tools                       from "./tools";
import * as __                          from "./server_common_tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";
import * as cheerio                     from 'cheerio';
import { db } from "./server_001";

// .. ====================================================================

export let name      = "نهج‌البلاغة";
export let tmpFolder = "src/db/tmp/" + name + "/";
export let tmpDB_Path = tmpFolder + name + ".json";
export let tmpDB;
try { tmpDB = JSON.parse( fs.readFileSync( tmpDB_Path, 'utf8' ) ) } catch {}


// .. ====================================================================

export function init ( mode: "Scratch"|"Cached" ) {

    tools.notify( "  " + name + " " );

    let db = [];

    // .. get v0 [ Scratch | Cached ]
    db = load_db_v0( mode );
    // .. rename d section
    db = setTitle( db );

    // .. write-down DB
    // storage.saveData( db, tmpFolder, "01" );
    storage.saveData( db, "src/db/ready", name );

}

// .. ====================================================================


function load_db_v0 ( mode: "Scratch"|"Cached" ) {

    let db_v0: TS.db = [];

    if ( mode === "Cached" ) {
        let path = tmpFolder + "00-";
        let K = JSON.parse( fs.readFileSync( path + "K.json", 'utf8' ) );
        let L = JSON.parse( fs.readFileSync( path + "L.json", 'utf8' ) );
        let H = JSON.parse( fs.readFileSync( path + "H.json", 'utf8' ) );
    }

    if ( mode === "Scratch" ) {

        fs.rmSync( tmpFolder + "00.json", { force: true } );
        fs.rmSync( tmpFolder + "01.json", { force: true } );
        fs.rmSync( tmpFolder + "00-K.json", { force: true } );
        fs.rmSync( tmpFolder + "00-L.json", { force: true } );
        fs.rmSync( tmpFolder + "00-H.json", { force: true } );

        let book_v0: string[][];

        // .. convert all sourceText => set v1
        for ( let p of [ "K", "L", "H" ] ) {
            book_v0 = readSrcBook(p);
            book_v0 = setBook_v0( book_v0, p as any );
            db_v0 = [ ...db_v0, ...getDBFromBook( book_v0, p as any ) ];
        }

        // .. save it in storage
        storage.saveData( db_v0, tmpFolder, "00" );

    }

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

function setBook_v0 ( book: string[][], code: "H"|"L"|"T" ) {

    console.log(book.length,code);

    let cdn = "<span class=\"arabic\">";
    let id: number;

    // .. check integrity of all lines
    for ( let p of book ) {
        // .. loop [in this page] on lines
        for ( let i=0; i<p.length; i++ ) {
            // .. check this line
            if ( p[i].includes( cdn ) ) {
                // .. chcek position cdn
                id = p[i].indexOf( cdn );
                if ( id > 0 ) console.log( "ERR 1: Unexpected Position!" );
                // .. get Last </span>
                id = p[i].lastIndexOf( "</span>" );
                // .. check multi closing Tag
                if ( id !== p[i].indexOf( "</span>" ) ) console.log( "ERR 2: Bad Closing Tag!", p[i] );
                // .. check end of line
                if ( p[i].length - id !== 7 ) console.log( "ERR 3: No Closing Tag!", p[i] );
            }
        }
    }

    // .. merge Neighbor Arabic-s
    for ( let p of book ) {
        // .. loop [in this page] on lines
        for ( let i=0; i<p.length-1; i++ ) {
            // .. check Neighbor Arabic-s
            if ( p[i].includes( cdn ) && p[i+1].includes( cdn ) ) {
                // .. open End of Tag on first Line
                p[i] = p[i].replace( "</span>", " " );
                // .. open Beginning of Tag on second Line
                p[i+1] = p[i+1].replace( cdn, " " );
                // .. merge lines on second one
                p[i+1] = p[i] + p[i+1];
                // .. truncate first line
                delete p[i];
            }
        }
    }

    // .. remove empty lines
    for ( let i in book ) book[i] = book[i].filter( x => x );

    // .. edit each line
    for ( let p of book )
        for ( let i in p )
            p[i] = __.some_edits( p[i] );

    for ( let p of book ) p = getPageAdvise (p);

    // .. save it
    storage.saveData( book, tmpFolder, "00-" + code );

    // .. return book
    return book;

}

// .. ====================================================================

function getDBFromBook ( book: string[][], code: "H"|"L"|"T" ) {

    let db: TS.db = [];
    let tmp: TS.db_item = {} as TS.db_item;
    let tmp_pre_ar: string;
    let tmp_pre_fa: string;
    let page: string[];
    let x: number;

    // .. loop on book => page
    for ( let i in book ) {

        // .. reset section indicator
        x = 1;
        page = book[i];

        // .. loop on page => line
        for ( let line of page ) {

            if ( line.includes( "prefix_ar" ) ) {
                tmp_pre_ar = cheerio.load( line ).text();
            }
            else if ( line.includes( "prefix_fa" ) ) {
                tmp_pre_fa = cheerio.load( line ).text();
            }
            // .. if this line is Arabic
            else if ( line.includes( "arabic" ) ) {

                // .. register in DB
                db.push( tmp );
                // ..  reset tmp
                tmp = {} as TS.db_item;
                // .. register tmp_pre_ar
                if ( tmp_pre_ar ) tmp[0] = tmp_pre_ar;
                // .. register arabic
                tmp.a = cheerio.load( line ).text();
                tmp.b = "";
                // .. register tmp_pre_ar
                if ( tmp_pre_fa ) tmp.b = tmp_pre_fa;
                tmp.c = 1;
                tmp.d = code + " " + ( Number(i) +1 ) + " " + x;
                // .. reset tmp_pre_x
                tmp_pre_ar = null;
                tmp_pre_fa = null;
                // .. section up
                x++;

            }
            else if ( line.includes( "suffix" ) ) {
                // ..
            }
            else {
                tmp.b += " " + cheerio.load( line ).text(); 
            }

        }

    }

    // .. trim DB
    db = db.filter( x => x.a );

    return db;

}

// .. ====================================================================

function getPageAdvise ( page: string[] ) {

    let id = page.findIndex( x => x.includes( "arabic" ) );
    let $: cheerio.CheerioAPI;

    if ( !~id ) console.log("ERR 0: No Header", page );
    else if ( id === 0 ) {}
    else if ( id === 1 ) {
        $ = cheerio.load( "<div>" );
        $( "div" ).addClass( "prefix_ar" ).text( page[0] );
        page[0] = $("body").html();
    }
    else if ( id === 2 ) {
        $ = cheerio.load( "<div>" );
        $( "div" ).addClass( "prefix_ar" ).text( page[0] );
        page[0] = $("body").html();
        $ = cheerio.load( "<div>" );
        $( "div" ).addClass( "prefix_fa" ).text( page[1] );
        page[1] = $("body").html();
    }
    else if ( id > 2 ) console.log("ERR 1: Unexpected Format!", page );

    // for ( let i in page ) {
    //     if ( page[i].includes( "الشريف " ) ) {
    //         $ = cheerio.load( "<div>" );
    //         $( "div" ).addClass( "suffix_ar" ).text( page[i] );
    //         page[i] = $("body").html();

    //         // $ = cheerio.load( "<div>" );
    //         // $( "div" ).addClass( "suffix_fa" ).text( page[i+1] );
    //         // page[i+1] = $("body").html();
    //     }
    // }

    return page;

}

// .. ====================================================================

function setTitle ( db: TS.db ) {

    let parts: string[];
    let tmp: string;

    for ( let i=0; i<db.length; i++ ) {
        tmp = db[i].d as string;
        if ( tmp.endsWith( "1" ) )
            if ( !db[i+1] || ( db[i+1].d as string ).endsWith( "1" )  )
                db[i].d = tmp.slice( 0, tmp.length -2 );
    }

    for ( let p of db ) {
        parts = ( p.d as string ).split( " " );
        parts[0] = parts[0].replace( "K", "خطبة " );
        parts[0] = parts[0].replace( "L", "رسالة " );
        parts[0] = parts[0].replace( "H", "كلمةالقصار " );
        parts[1] = basic_tools.arabicDigits( parts[1] );
        try { parts[2] = " ، القطاع " + basic_tools.arabicDigits( parts[2] ) } catch {}
        parts.unshift( name + ": " );
        p.d = parts.join( "" );
    }

    return db;

}

// .. ====================================================================
