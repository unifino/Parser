import * as tools                       from "../tools/tools";
import * as report                      from "../tools/logger"
import * as __                          from "../tools/__";
import * as TS                          from "../types/types";
import * as storage                     from "../tools/storage";
import * as basic_tools                 from "../tools/basic_tools";
import * as fs                          from "fs";
import * as WS                          from "worker_threads";
import * as cheerio                     from 'cheerio';

// .. ====================================================================

export let name         = "مستدرك‌الوسائل";
export let db           : TS.db;
export let R            : TS.R[];

let tmpFolder           = "tmp/" + name + "/";
let R_Path              = tmpFolder + "/" + name + "-R.json";

resource_update ();

// .. ====================================================================

export async function ignite ( mode: "Scratch"|"Cached", n_pad: number ) {

    // .. init server
    report.notify( name );
    // .. init DB
    db = [];
    // .. get v0 [ Scratch | Cached ]
    db = load_db_v0( mode );
    // // .. get Actual DB
    // db = build_db ( db );
    // // .. N allocation
    // n_pad = tools.n_allocation( db, n_pad );
    // // .. R allocation
    // R = await __.R_wrapper( R_Path, db );
    // // .. Get R_67
    // R = tools.R_optimizer( R, 67 );
    // // .. search for optimizing
    // __.cook( R, db, tmpFolder );
    // // .. check optimized info
    // await tools._db_check_( tmpFolder, db );
    // // .. merge similar ones
    // db = tools.relation_definer( tmpFolder, db );
    // // .. create and save DBs
    // db_exporter();
    // .. clean the tmpFolder
    __.janitor( tmpFolder );
    // .. N-PAD report
    return n_pad;

}

// .. ====================================================================

function load_db_v0 ( mode: "Scratch"|"Cached" ) {

    let db_v0: TS.db = [];
    let db_v0_Path = tmpFolder + "/" + name + "-00.json";

    if ( mode === "Cached" ) {
        db_v0 = JSON.parse( fs.readFileSync( db_v0_Path, 'utf8' ) );
    }

    if ( mode === "Scratch" ) {
        let list = JSON.parse( fs.readFileSync( "tmp/files.json", 'utf8' ) );

        fs.rmSync( db_v0_Path, { force: true } );

        let textBook: string = "";
        let tmp_db = [];

        // .. merge Books as Source
        for ( let i=1; i<list.length; i ++ ) {
            textBook += " " + readSrcBook(list[i]);
            // // ..  do some edits
            // textBook = __.some_edits( textBook );
            // // .. remove FootNotes => main Text
            // textBook = removeFootNotes( textBook );
            // // .. remove unwanted parted => neat
            // textBook = getNeatBook( textBook );
            // // .. build first db => rawDB
            // let raw_db = getRawDB( textBook );
            // // // .. provide a preview for checking
            // // preview_1( raw_db );
            // // .. build main db
            // tmp_db = hadith_db_generator( raw_db );
            // // .. scatter 0-a-9
            // tmp_db = a_0_9( tmp_db );
            // // .. assign c code
            // tmp_db = c_allocator( tmp_db );
            // // .. sum up Books
            // db_v0 = [ ...db_v0, ...tmp_db ];
        }

        // // .. provide a preview for checking
        // preview_2( db_v0 );
        // .. save it
        fs.writeFileSync( tmpFolder+"/base.html", textBook );
    }

    return db_v0;

}


// .. ====================================================================

function readSrcBook ( link: string ): string {

    // .. check
    fs.accessSync( link, fs.constants.R_OK );
    // .. get source
    let txt = fs.readFileSync( link, 'utf8' );

    // .. cut beginning and end of the book
    let a = txt.indexOf( "<body>" );
    let b = txt.indexOf( "</body>" );

    if ( a>0 && b>0 ) return txt.slice( a, b );
    else console.log( "err-01",a , b )

}

// .. ====================================================================

export function resource_update () {

    let db_Path = "db/" + name + ".json";

    try { fs.mkdirSync( tmpFolder ) } catch {}
    try { db = JSON.parse( fs.readFileSync( db_Path, 'utf8' ) ) } catch {}
    try { R  = JSON.parse( fs.readFileSync( R_Path,  'utf8' ) ) } catch {}

}

// .. ====================================================================

