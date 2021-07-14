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

        fs.rmSync( db_v0_Path, { force: true } );

        let textBook: string = "";
        let tmp_db: TS.db = [];

        // .. merge Books as Source
        textBook += " " + readSrcBook( "source/مستدرك‌الوسائل/base.html" );
        // ..  do some edits
        textBook = __.some_edits( textBook );
        // .. remove unwanted parted => neat
        textBook = getNeatBook( textBook );
        // .. build first db => rawDB
        let raw_db = getRawDB( textBook );
        // // .. provide a preview for checking
        // preview_1( raw_db.join("</p>") );
        // .. build main db
        tmp_db = hadith_db_generator( raw_db );
        // .. scatter 0-a-9
        tmp_db = a_0_9( tmp_db );
        storage.saveData( tmp_db, "tmp", "cdn" );
        // .. provide a preview for checking
        let tmp = "";
        for ( let p of tmp_db ) tmp += "<p>" + p.d + p.tmp.w.join( " " ) + "</p>";

        preview_1( tmp );
        // // .. assign c code
        // tmp_db = c_allocator( tmp_db );
        // // .. sum up Books
        // db_v0 = [ ...db_v0, ...tmp_db ];

        // // .. provide a preview for checking
        // preview_2( db_v0 );

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

    if ( a>0 && b>0 ) return txt.slice( a+6, b );
    else console.log( "err-01",a , b )

}

// .. ====================================================================

function getNeatBook ( text: string ) {

    text = text.replace( /<p class="pagen">[0-9]+<\/p>/g, "" );
    text = text.replace( /<h1(.*?)<\/h1>/g, "" );
    text = text.replace( /<h2(.*?)<\/h2>/g, "" );
    text = text.replace( /<h3(.*?)<\/h3>/g, "" );
    text = text.replace( /<h4(.*?)<\/h4>/g, "" );
    text = text.replace( /\n+/g, "" );
    text = text.replace( /\r+/g, "" );
    text = text.replace( /<p/g, "\n<p" );
    text = text.replace( /<p><\/p>/g, " " );

    let box = text.split( "\n" );
    for ( let i=box.length-1; i>0; i-- ) {
        if ( !( box[i].match( /[0-9]+-? [0-9]+/) || [] ).length ) {
            box[i-1] = box[i-1] + box[i];
            box[i] = "";
        } 
    }
    box = box.filter( x => x );

    text = box.join( "\n" );

    text = removeAlaemTags( text );

    return text;

}

// .. ====================================================================

function removeAlaemTags ( text: string ) {

    text = text.replace( /<\/p><p>/g, " " );

    text = text.replace( /<span class="fm"> ?عزوجل ?<\/span>/g, " عزوجل " );
    text = text.replace( /<span class="fm"> ?رحمه‌الله ?<\/span>/g, " رحمه‌الله " );
    text = text.replace( /<span class="fm"> ?رحمهم‌الله ?<\/span>/g, " رحمهم‌الله " );
    text = text.replace( /<span class="fm"> ?عليه‌السلام ?<\/span>/g, " عليه‌السلام " );
    text = text.replace( /<span class="fm"> ?عليها‌السلام ?<\/span>/g, " عليها‌السلام " );
    text = text.replace( /<span class="fm"> ?عليهم‌السلام ?<\/span>/g, " عليهم‌السلام " );
    text = text.replace( /<span class="fm"> ?عليهما‌السلام ?<\/span>/g, " عليهما‌السلام " );
    text = text.replace( /<span class="fm"> ?رضي‌الله‌عنه ?<\/span>/g, " رضي‌الله‌عنه " );
    text = text.replace( /<span class="fm"> ?قدس‌سره ?<\/span>/g, " قدس‌سره " );
    text = text.replace( /<span class="fm"> ?صلى‌الله‌عليه‌وآله‌وسلم ?<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );

    // .. replace libAie with native Q tag
    let q = ( text.match( /<span class="quran">(.*?)<\/span>/g ) || [] );
    for ( let c of q ) {
        let r = c;
        r = r.replace( "<span class=\"quran\">", " <Q> " );
        r = r.replace( "<\/span>", " </Q> " );
        text = text.replace( c, r );
    }

    text = text.replace( / +/g, " " );
    text = text.trim();

    text = text.replace( /<\/span> ?<span class="hadith">/g, "" );

    return text;

}

// .. ====================================================================

function getRawDB ( text: string ) {

    let db: string[] = [];

    // .. build DB: based on <P>
    for ( let p of text.split( "</p>" ) ) {
        // .. remove number span tags
        let match = p.match( /<span class="hadith">(.*?)<\/span>/ ) || [];
        let rgx = new RegExp( match[0], "g" );
        if ( match.length )
            if ( ( match[1].match( /[0-9]+-? [0-9].?/ ) || [] ).length ) 
                p = p.replace( rgx, match[1] );
        // .. register in DB
        db.push(p);
    }

    return db;

}

// .. ====================================================================

function hadith_db_generator ( raw_db: string[] ) {

    let db: TS.db = [],
        hadith: TS.db_item = { tmp: { 0: [], 9:[], a: [], w: [] } } as any;

    for ( let p of raw_db ) {

        let cdn = p.match( /[0-9]+-? [0-9]+/ ) || [];
        // .. append this line
        if ( cdn.length === 0 ) hadith.tmp.w.push( p );
        // .. beginning of a new Hadith
        else if ( cdn.length === 1 ) {
            // .. add to newBook
            if ( hadith.tmp.w.length ) {
                hadith.tmp.w[0] = hadith.tmp.w[0].replace( /<span/g, "\n<span" );
                hadith.tmp.w[0] = hadith.tmp.w[0].replace( /<\/span>/g, "</span>\n" );
                hadith.tmp.w = hadith.tmp.w[0].split( "\n" );
                hadith.tmp.w = hadith.tmp.w.filter( x => x );
            }
            db.push( hadith );
            // .. reset the HadithBox
            hadith = { tmp: { 0: [], 9:[], a: [], w: [] } } as any;
            p = p.slice( cdn.index + cdn[0].length );
            hadith.tmp.w.push( p );
            let dp = cdn[0].split( " " );
            hadith.d = Number( dp[0].replace("-","") ).toString();
            hadith.idInSection = Number( dp[1].trim() );
        }
        // .. error report
        else console.log( "Unexpected Line:", p );
    }
    // .. add ĺast item
    if ( hadith.tmp.w.length ) {
        hadith.tmp.w[0] = hadith.tmp.w[0].replace( /<span/g, "\n<span" );
        hadith.tmp.w[0] = hadith.tmp.w[0].replace( /<\/span>/g, "</span>\n" );
        hadith.tmp.w = hadith.tmp.w[0].split( "\n" );
        hadith.tmp.w = hadith.tmp.w.filter( x => x );
        db.push( hadith );
    }

    // .. remove first cell
    db.shift();

    // .. return
    return db;

}

// .. ====================================================================

function a_0_9 ( db: TS.db ) {

    let find_ID: number;

    for( let p of db ) {

        // .. module A
        if ( p.tmp.w.length === 1 )
            if ( p.tmp.w[0].includes( "مِثْل" ) || p.tmp.w[0].includes( "أَيْضاً" ) ) {
                p[0] = p.tmp.w[0];
                p.a = "remove it";
            }

        // .. module S - H
        if ( p.tmp.w.length === 2 )
            if ( !p.tmp.w[0].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) ) {
                    p[0] = p.tmp.w[0];
                    p.a = p.tmp.w[1];
                }

        // .. module S - H - A
        if ( p.tmp.w.length === 3 )
            if ( !p.tmp.w[0].includes( "class" ) )
                if
                (
                    p.tmp.w[2].includes( "مِثْل" ) ||
                    p.tmp.w[2].includes( "رَوَى" ) ||
                    p.tmp.w[2].includes( "رَوَاهُ" ) ||
                    p.tmp.w[2].includes( "يَأْتِي" )
                )
                    if ( p.tmp.w[1].includes( "hadith" ) ) {
                        p[0] = p.tmp.w[0];
                        p.a = p.tmp.w[1];
                        p[9] = p.tmp.w[2];
                    }

        // // .. module S - H - S - H
        // if ( p.tmp.w.length === 4 ) {
        //     if ( !p.tmp.w[0].includes( "class" ) && !p.tmp.w[2].includes( "class" ) )
        //     if ( p.tmp.w[1].includes( "hadith" ) && p.tmp.w[3].includes( "hadith" ) ) {
        //         p[0] = p.tmp.w[0];
        //         p.a = p.tmp.w[1];
        //     }
        // }

        // .. module 3: x H x
        if ( p.tmp.w.length === 3 )
            if ( !p.tmp.w[0].includes( "class" ) && !p.tmp.w[2].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) ) {
                    p[0] = p.tmp.w[0];
                    p.a = p.tmp.w[1];
                    p[9] = p.tmp.w[2];
                }

        // .. module S - H - Q - H
        if ( p.tmp.w.length === 4 ) {
            if ( !p.tmp.w[0].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) && p.tmp.w[3].includes( "hadith" ) ) 
                    if ( p.tmp.w[2].includes("Q") ) {
                        p[0] = p.tmp.w.splice(0,1)[0];
                        p.a = p.tmp.w.join( " " );
                    }
        }
        // .. module S - H - S - A
        if ( p.tmp.w.length === 4 ) {
            if ( !p.tmp.w[0].includes( "class" ) && !p.tmp.w[2].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) && p.tmp.w[3].includes( "hadith" ) ) 
                    if ( !p.tmp.w[2].includes("Q") ) {
                        p[0] = p.tmp.w[0];
                        p.a = p.tmp.w[1];
                        p[9] = p.tmp.w[2] + " " + p.tmp.w[3];
                    }
        }
        // .. control by hand
        // let cdnBox_1 = [
        //     154,173,247,255,760,1105,1303,1689,1788,2094,2320,2343,2884,
        //     2888,2891,3064,3162,3862,4431,4693,
        // ];

    }

    return db.filter( x => !x.a );

}

// .. ====================================================================

function preview_1 ( text: string ) {

    let header = "<!DOCTYPE html><html><head>"+
    '<link rel="stylesheet" type="text/css" href="main.css" />'+
    "</head><body>";

    storage.saveTMP( header + text , "html" );

}

// .. ====================================================================

export function resource_update () {

    let db_Path = "db/" + name + ".json";

    try { fs.mkdirSync( tmpFolder ) } catch {}
    try { db = JSON.parse( fs.readFileSync( db_Path, 'utf8' ) ) } catch {}
    try { R  = JSON.parse( fs.readFileSync( R_Path,  'utf8' ) ) } catch {}

}

// .. ====================================================================

