import * as tools                       from "./tools";
import * as __                          from "./server_common_tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";
import * as cheerio                     from 'cheerio';

// .. ======================================================================

export let name      = "نهج‌البلاغة";
export let tmpFolder = "src/db/tmp/" + name + "/";
export let tmpDB_Path = tmpFolder + name + ".json";
export let tmpDB;
try { tmpDB = JSON.parse( fs.readFileSync( tmpDB_Path, 'utf8' ) ) } catch {}


// .. ======================================================================

export function init ( mode: "Scratch"|"Cached" ) {


    tools.notify( "  " + name + " " );

    let db = [];

    // .. get v0 [ Scratch | Cached ]
    db = load_db_v0( mode );
    // .. some preparation A=>Z


}

// .. ======================================================================

function load_db_v0 ( mode: "Scratch"|"Cached" ) {

    let db_v0: TS.db,
        _00_Path = tmpFolder + "00.json";

    if ( mode === "Cached" ) {
        db_v0 = JSON.parse( fs.readFileSync( _00_Path, 'utf8' ) );
    }

    if ( mode === "Scratch" ) {

        fs.rmSync( _00_Path, { force: true } );

        let cdn = ( str: string ) => {
            // .. bad situations
            if
            (
                    str === " "
                ||  str === "<p>"
                ||  str === "</p>"
                ||  str === "<br>"
                ||  str === "</div>"
                ||  str === "<span class=\"arabic\"></span>"
            )
                return false;
            // .. return str itself
            return str;
        }

        let textBook: string,
            box: string[],
            book_v0: string[][] = [];

        // .. convert all sourceText => set v1
        for ( let i=1; i<=489; i ++ ) {
            // .. reset Box
            box = [];
            // .. read Source
            textBook = readSrcBook(i);
            textBook = __.some_edits( textBook );
            textBook = snipper( textBook, i );
            textBook = my_some_edits( textBook );
            // .. put in Box
            box = textBook.split( "\n" );
            // .. some-edit-s
            box = box.filter( x => cdn(x) );
            box = box.map( x => x.replace( "<div>", "" ) );
            box = box.map( x => x.replace( "<p>", "" ) );
            box = box.map( x => x.replace( "<br>", "" ) );
            box = box.filter( x => x );
            // .. register in Book
            book_v0.push( box );
        }

        storage.saveData( book_v0, tmpFolder, "00-H" );

    }

    return db_v0;

}

// .. ======================================================================

function readSrcBook ( num: number ): string {

    // tools.notify( "  book num: " + num + ( num > 9 ? "" : " ") );

    let filePath = "src/db/tmp/" + name + "/H/" + num + ".html";
    // .. check
    fs.accessSync( filePath, fs.constants.R_OK );
    // .. get source
    let txt = fs.readFileSync( filePath, 'utf8' );

    return txt;

}

// .. ======================================================================

function snipper ( str: string, i: number ) {

    let $: cheerio.CheerioAPI,
        target: cheerio.Cheerio<cheerio.Element>;

    // .. load it
    $ = cheerio.load( str );
    // .. Aiming ꕢ
    target = $( ".content.clearfix" );
    // .. check integrity
    if ( target.length !== 3 ) console.log( "ERR: 01" );
    // .. load it
    $( ".Page-Number" ).remove();
    $ = cheerio.load( $( target[1] ).children()[0] );
    // .. Aiming ꕢ
    target = $( ".field-item.even" );
    // .. check integrity
    if ( target.length !== 1 && target.length !== 2 ) console.log( "ERR: 02", i, target.length );
    // .. remove some items
    $( "table" ).remove();
    $( ".field-label-hidden" ).remove();
    // .. convert it back as textBook
    str = $( $( target[0] ) ).html();

    return str;

}
// .. ======================================================================

function my_some_edits ( str: string ) {

    str = str.replace( /\n/g, " " );
    str = str.replace( /<strong(.*?)<\/strong>/g, "" );
    str = str.replace( / +/g, " " );
    str = str.replace( /</g, "\n<" );
    str = str.replace( /\n<\/span>/g, "</span>" );
    str = str.replace( /font-family : tahoma;/g, "" );
    str = str.replace( /text-align : center;/g, "" );
    str = str.replace( /text-align : justify;/g, "" );
    str = str.replace( / dir="RTL"/g, "" );
    str = str.replace( / dir="rtl"/g, "" );
    str = str.replace( /text-align : right;/g, "" );
    str = str.replace( /font-size : 12px;/g, "" );
    str = str.replace( /line-height : 2 . 5em;/g, "" );
    str = str.replace( /line-height : 30px;/g, "" );
    str = str.replace( /background-color : rgb\(255, 255, 255\);/g, "" );
    str = str.replace( / style=" +"/g, "" );
    str = str.replace( / style=""/g, "" );
    str = str.replace( / align="Right"/g, "" );
    str = str.replace( /&nbsp;/g, "" );
    str = str.replace( /> /g, ">" );
    str = str.replace( /<span class="arabic">\n/g, '<span class="arabic">' );
    // .. in hadith
    str = str.replace( ">قَالَ عليه‌السلام ", ">" );
    str = str.replace( ">وَ قَالَ عليه‌السلام", ">" );
    str = str.replace( ">وَ كَانَ عليه‌السلام يَقُولُ", ">" );
    str = str.replace( "> : ", ">" );
    str = str.replace( "> : ", ">" );
    str = str.replace( ">1- و في حديثه عليه‌السلام :", ">" );
    str = str.replace( ">2- و في حديثه عليه‌السلام :", ">" );
    str = str.replace( ">3- و في حديثه عليه‌السلام :", ">" );
    str = str.replace( ">4- و في حديثه عليه‌السلام :", ">" );
    str = str.replace( ">5- و في حديثه عليه‌السلام :", ">" );
    str = str.replace( ">6- و في حديثه عليه‌السلام :", ">" );
    str = str.replace( ">7- و في حديثه عليه‌السلام :", ">" );
    str = str.replace( ">8- و في حديثه عليه‌السلام :", ">" );
    str = str.replace( ">9- و في حديثه عليه‌السلام :", ">" );
    return str;

}

// .. ======================================================================
