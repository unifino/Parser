// book 1 : edit ‌__________________</p> to </p>\n<p class=libLine></p>
// book 5 : add <p class=libTocHeading></p> at line 40399
// book 5 : replace <p class=libLine> to <p class=libNormal> at line 32989
// book 6 : add <p class=libTocHeading></p> at line 30230
// book 7 : add <p class=libTocHeading></p> at line 36962
// book 10 : add <p class=libTocHeading></p> at line 47199
// book 15 : add <br clear=all><a name='864'></a><p class=libTocHeading></p> at line 33043

// </p><p class=libNormal>:
// 1    ٧٥٦
// 2    ٧٧٢ & ١٤٤٨ & remove: ١ / ٥٠٨‌
// 3
// 4
// 5    ٤٣٩٥
// 6    ٥٢٠٠
// 7
// 8    ٧٢١٤ & ٧٢١٥ <br clear=all><a name='395'></a>
// 9
// 10
// 11   ١٠٨٧٨
// 12   ١١١٦٦ & ١١١٨١ & ١٢٠٧٥
// 13
// 14
// 15   لرجل : «ما الفتى عندكم & 15413

// .. no need any more
// book 13 : replace <a name='2'></a> to line 152
// book 4 : add class=libNormal to ٣٣٤٧
// book 6 : add class=libNormal at line 3397
// book 7 : remove all <p></.p> then replave all <p> with <p class=libNormal>
// book 11 : add class=libNormal at line 34274
// book 14 : add class=libNormal at line 85
// book 14 : add class=libNormal at line 42643
// book 15 : remove all <p></p> then replace all <p> with <p class=libNormal>

import * as fs                          from "fs";

console.log( "\n... AL-KAFI Parser v.2.0.0 ...\n");

// .. ======================================================================

let SimpleHadisBox = [];
let HadisBox = [];
let PagesBox = [];

// .. ======================================================================

async function init ( num ) {

    console.log( "\n... parsing book num: " + num + " ...\n");

    let filePath = "db/" + num + ".htm";
    // .. check
    await fs.promises.access( filePath, fs.constants.F_OK )
    // .. file is found
    .then( () => {} )
    // .. file is NOT found
    .catch( e => console.log(e) );

    // .. get source
    let source = fs.readFileSync( filePath , 'utf8' );
    // .. cut beginning and end of the book
    let a = num === 1 ? 
        source.indexOf( "<a name='21'></a>" ) : 
        source.indexOf( "<a name='7'></a>" );
    let b = source.indexOf( "<p class=libTocHeading></p>" );
    if ( a>0 && b>0 ) {
        source = source.slice( a, b );
        source = step01( source );
        source = step02( source );
        createPagesBox( source );
        createSimpleHadisBox( source );
    }
    else console.log( "err-01",a , b )

}

// .. apply on all books
for ( let i=1; i<=15; i ++ ) await init ( i );

let tmpBox = [];
for ( let lineNum in SimpleHadisBox ) {
    let hasNum = id_extractor ( SimpleHadisBox[ lineNum ] );
    if ( hasNum ) {
        HadisBox.push( tmpBox );
        tmpBox = [];
        tmpBox.push( SimpleHadisBox[ lineNum ] );
        if ( ( hasNum - HadisBox.length ) ) { 
            console.log( hasNum , HadisBox.length );
            // break;
        }
    }
    else tmpBox.push( SimpleHadisBox[ lineNum ] );
}
HadisBox.push( tmpBox );

// .. omit empty cell
if ( !HadisBox[0].length ) HadisBox.shift();

await fs.writeFileSync( "db/exported.json", JSON.stringify( HadisBox, null, "\t" ) );


// .. tools ================================================================
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

function id_extractor ( str ) {
    str = str.split( "." )[0].split( "/" )[0];
    str = str.replace( "<p class=libNormal0>", "" );
    str = str.replace( "<p class=libNormal>", "" );
    str = str.replace( "<span class=libBold2>", "" );
    let b = str;
    str = str.replace( " ", "" );
    str = str.replace( "‌", "" ); 
    str = Number( str );
    return str;
}

// .. purify ===============================================================

function step01 ( source ) {
    // .. remove arabic numbers:
    source = removeArabicDigits( source );
    // .. remove break-Lines
    source = source.replace( /\n/g, " " );
    // .. add break-Line
    source = source.replace( /<p/g, "\n<p" );
    source = source.replace( /<a/g, "\n<a" );
    // .. remove tables
    source = source.replace( /<table(.*?)>/g, " " );
    source = source.replace( /<td(.*?)>/g, " " );
    source = source.replace( /<tr(.*?)>/g, " " );
    source = source.replace( /<\/tr>/g, " " );
    source = source.replace( /<\/td>/g, " " );
    source = source.replace( /<\/table>/g, " " );
    // .. remove footnote marks
    let footNoteSpanRegExp = /<span class=libFootnotenum>(.*?)<\/span>/g;
    source = source.replace( footNoteSpanRegExp, " " );
    // .. some trims
    source = source.replace( /<p class='MsoNormal'>/g, " " );
    source = source.replace( /<p><\/p>/g, " " );
    source = source.replace( /<p> +<\/p>/g, " " );
    source = source.replace( /<br clear=all>/g, " " );
    source = source.replace( /<b>/g, " " );
    source = source.replace( /<\/b>/g, " " );
    source = source.replace( /<br>/g, " " );
    source = source.replace( /&nbsp;/g, " " );
    source = source.replace( /&quot;/g, "\"" );
    source = source.replace( / +/g, " " );
    // .. some edits
    source = source.replace( /<p>/g, "<p class=libNormal>" );
    source = source.replace( /<p class=libFootnote>__________________<\/p>/g, "<p class=libLine></p>" );
    // .. some trims
    source = source.replace( /<p class=libNormal><\/p>/g, "" );

    return source;

}

// .. book to pages =========================================================

function step02 ( source ) {
    // .. divide book to pages
    let pages = source.split( "<a name=" );
    return source;
}

// .. create PagesBox ======================================================

function createPagesBox ( source ) {

    let lines = source.split( "\n" );
    let tmpPage = [];

    for ( let line of lines ) {

        if ( line.startsWith( "<a name=") && line.endsWith( "</a> " ) ) {
            PagesBox.push( tmpPage );
            tmpPage = [];
        }
        else if ( line.startsWith( "<p ") && line.endsWith( "</p> " ) ) {
            tmpPage.push( line );
        }
        else if ( line.startsWith( "<p ") && line.endsWith( "</p>" ) ) {
            tmpPage.push( line );
        }
        else if ( !line || line === " " ) {}
        else console.warn( line );

    }

}

// .. create SimpleHadisBox ================================================

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
                p = lineNum;
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
            // .. if line is ok; check if regognize it?
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