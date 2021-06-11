import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as fs                          from "fs";
// .. ======================================================================

let SimpleHadisBox = [];
let HadisBox = [];
let PagesBox = [];

// .. ======================================================================

export async function init () {

    for ( let i=1; i<=29; i ++ ) await readSrcBook (i);

    // let tmpBox = [];
    // for ( let lineNum in SimpleHadisBox ) {
    //     let hasNum = id_extractor ( SimpleHadisBox[ lineNum ] );
    //     if ( hasNum ) {
    //         HadisBox.push( tmpBox );
    //         tmpBox = [];
    //         tmpBox.push( SimpleHadisBox[ lineNum ] );
    //         if ( ( hasNum - HadisBox.length ) ) { 
    //             console.log( hasNum , HadisBox.length );
    //             // break;
    //         }
    //     }
    //     else tmpBox.push( SimpleHadisBox[ lineNum ] );
    // }
    // HadisBox.push( tmpBox );

    // // .. omit empty cell
    // if ( !HadisBox[0].length ) HadisBox.shift();

    // let exp = "../db/tmp/01.json";
    // fs.writeFileSync( exp, JSON.stringify( HadisBox, null, "\t" ) );

    // console.log( "\n... Done!\n" );

}

// .. ======================================================================

async function readSrcBook ( num: number ) {

    console.log( "reading book num: " + num + "...");

    let filePath = "src/db/source/وسائل الشيعة/" + num + ".htm";
    // .. check
    await fs.promises.access( filePath, fs.constants.F_OK )
    // .. file is found
    .then( () => {} )
    // .. file is NOT found
    .catch( e => console.log(e) );

    // .. get source
    let source = fs.readFileSync( filePath , 'utf8' );
    // .. cut beginning and end of the book
    let a = source.indexOf( "<a name='aaa'></a>" );
    let b = source.indexOf( "<a name='xxx'></a>" );
    if ( a>0 && b>0 ) {
        source = source.slice( a, b );
        source = pureSource2Lines( source );
        let lines = linesBox( source );
        fs.writeFileSync( "src/db/tmp/01.txt", JSON.stringify(lines,null,"\t") );
        // createSimpleHadisBox( source );
    }
    else console.log( "err-01", a , b )

}

// .. purify ===============================================================

function pureSource2Lines ( source: string ) {
    // .. remove arabic numbers:
    source = removeArabicDigits( source );
    // .. remove break-Lines
    source = source.replace( /\n/g, " " );
    // .. add break-Line
    source = source.replace( /<p/g, "\n<p" );
    source = source.replace( /<a/g, "\n<a" );
    source = source.replace( /<t/g, "\n<t" );
    source = source.replace( /<\/t/g, "\n</t" );
    // source = source.replace( /<h1/g, "\n<h1" );


    // .. remove tables
    source = source.replace( /<.?t(.*?)>/g, " " );
    // // .. remove footnote marks
    // let footNoteSpanRegExp = /<span class=libFootnotenum>(.*?)<\/span>/g;
    // source = source.replace( footNoteSpanRegExp, " " );
    // .. some trims
    source = source.replace( /<br clear=all>/g, " " );
    source = source.replace( /<br>/g, " " );
    source = source.replace( / +/g, " " );
    // source = source.replace( /<p class='MsoNormal'>/g, " " );
    // source = source.replace( /<p><\/p>/g, " " );
    // source = source.replace( /<p> +<\/p>/g, " " );
    // source = source.replace( /<b>/g, " " );
    // source = source.replace( /<\/b>/g, " " );
    // source = source.replace( /&nbsp;/g, " " );
    // source = source.replace( /&quot;/g, "\"" );
    // // .. some edits
    // source = source.replace( /<p>/g, "<p class=libNormal>" );
    // source = source.replace( /<p class=libFootnote>__________________<\/p>/g, "<p class=libLine></p>" );
    // // .. some trims
    // source = source.replace( /<p class=libNormal><\/p>/g, "" );

    return source;

}

// .. ======================================================================

function linesBox ( source: string ): string[][] {

    let book: string[][] = [],
        tmpPage: string[] = [],
        lines = source.split( "\n" );

    for ( let line of lines.filter( x => x ) ) {

        line = line.trim();

        if ( line === "" ) {
            // .. do nothing
        }
        else if ( line.startsWith( "<a name=" ) && line.endsWith( "</a>" ) ) {
            book.push( tmpPage );
            tmpPage = [];
        }
        else if ( line.startsWith( "<p" ) && line.endsWith( "</p>" ) ) {
            // tmpPage.push( line );
        }
        else {
            tmpPage.push( line );
            console.warn( "\n", line );
        }

    }

    return book.filter( x => x.length );

}

// .. ======================================================================

function createSimpleHadisBox ( source ) {

    // .. remove FootNote Sections
    for ( let pageNum in PagesBox ) {
        let x = 0;
        let p = -1;
        // .. if this page has One and Just One <p class=libLine>?!
        for ( let lineNum in PagesBox[ pageNum ] ) {
            let f = "<p class=libLine>";
            if ( PagesBox[ pageNum ][ lineNum ].startsWith( f ) ) {
                x++;
                p = Number( lineNum );
            }
        }
        if ( x > 1 ) { console.log( "err-02" ); }
        // .. just Actual Pages remains!
        if ( x === 1 ) PagesBox[ pageNum ] = PagesBox[ pageNum ].filter( (x,i) => i < p );
    }

    // .. remove some other lines
    for ( let page of PagesBox ) {
        for ( let lineNum in page ) {
            // .. remove some lines
            if ( 
                page[ lineNum ].startsWith( "<p class=libCenterBold2>" ) ||
                page[ lineNum ].startsWith( "<p class=Heading1Center>" ) ||
                page[ lineNum ].startsWith( "<p class=Heading2Center>" ) ||
                page[ lineNum ].startsWith( "<p class=libFootnote0>(" ) ||
                page[ lineNum ].startsWith( "<p class=libFootnote0></p>" )
            )
                delete page[ lineNum ];
            // .. if line is ok; check if recognize it?
            if ( page[ lineNum ] )
                if ( !page[ lineNum ].startsWith( "<p class=libNormal" ) ) {
                    if (
                        !page[ lineNum ].startsWith( "<p class=libPoem>" ) &&
                        !page[ lineNum ].startsWith( "<p class=libCente" ) &&
                        !page[ lineNum ].startsWith( "<p class=libBold" ) &&
                        !page[ lineNum ].startsWith( "<p class=libFootn" )
                    )
                    console.log( page[ lineNum ] );
                }
        }
    }

    // .. put together in SimpleHadisBox
    for ( let page of PagesBox ) {
        for ( let lineNum in page ) { 
            if ( page[ lineNum ] ) SimpleHadisBox.push( page[ lineNum ] );
        }
    }

    // .. reset PageBox
    PagesBox = [];

}

// .. ======================================================================

function removeArabicDigits ( str ) {

    str = str.replace( /۰/g, "0" );
    str = str.replace( /۱/g, "1" );
    str = str.replace( /۲/g, "2" );
    str = str.replace( /۳/g, "3" );
    str = str.replace( /۴/g, "4" );
    str = str.replace( /۵/g, "5" );
    str = str.replace( /۶/g, "6" );
    str = str.replace( /۷/g, "7" );
    str = str.replace( /۸/g, "8" );
    str = str.replace( /۹/g, "9" );

    str = str.replace( /٠/g, "0" );
    str = str.replace( /١/g, "1" );
    str = str.replace( /٢/g, "2" );
    str = str.replace( /٣/g, "3" );
    str = str.replace( /٤/g, "4" );
    str = str.replace( /٥/g, "5" );
    str = str.replace( /٦/g, "6" );
    str = str.replace( /٧/g, "7" );
    str = str.replace( /٨/g, "8" );
    str = str.replace( /٩/g, "9" );

    return str;

}

// .. ======================================================================