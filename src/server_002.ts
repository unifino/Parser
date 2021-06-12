import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";
// .. ======================================================================

export async function init () {

    fs.rmSync( "src/db/tmp/01.txt", { force: true } );
    fs.rmSync( "src/db/tmp/02.txt", { force: true } );

    let textBook: string,
        book_v0: string[][],
        book_v1: string[][],
        set_v1: string[][] = [],
        set_v2: string[] = [],
        db_v1: TS.db;

    // .. convert all sourceText => set v1
    for ( let i=1; i<=29; i ++ ) {
        textBook = readSrcBook(i);
        book_v0 = getBook_v0( textBook );
        book_v1 = getBook_v1( book_v0 );
        set_v1 = [ ...set_v1, ...book_v1 ];
    }

    // .. convert set v1 to v2 [ string[][]=>string[] ]
    for ( let i in set_v1 ) set_v2 = [ ...set_v2, ...set_v1[i] ];
    // .. get hadith prepared for extraction id from sourceText
    for ( let i in set_v2 ) set_v2[i] = pre_d_executer ( set_v2[i] );
    // .. trim set v2
    set_v2 = set_v2.filter( x => x );
    // .. get hadith-id from sourceText [ assign d & j ]
    db_v1 = d_executer( set_v2 );
    // .. text unifier
    for ( let i in db_v1 ) db_v1[i].a = basic_tools.charSpacer( db_v1[i].a );
    // .. assign c
    for ( let i in db_v1 ) db_v1[i] = c_executer( db_v1[i] );


    fs.writeFileSync( "src/db/tmp/01.txt", JSON.stringify(db_v1,null,"\t") );

}

// .. ======================================================================

function readSrcBook ( num: number ): string {

    console.log( "reading book num: " + num + "...");

    let filePath = "src/db/source/وسائل الشيعة/" + num + ".htm";
    // .. check
    fs.accessSync( filePath, fs.constants.R_OK );
    // .. get source
    let txt = fs.readFileSync( filePath, 'utf8' );

    // .. cut beginning and end of the book
    let a = txt.indexOf( "<a name='aaa'></a>" );
    let b = txt.indexOf( "<a name='xxx'></a>" );

    if ( a>0 && b>0 ) {
        txt = txt.slice( a, b );
        txt = lines_PureText( txt );
        return txt;
    }
    else console.log( "err-01", a, b );

}

// .. purify ===============================================================

function lines_PureText ( txt: string ) {

    // .. remove arabic numbers:
    txt = basic_tools.removeArabicDigits( txt );
    // .. remove break-Lines
    txt = txt.replace( /\n/g, " " );
    // .. add break-Line
    txt = txt.replace( /<p/g, "\n<p" );
    txt = txt.replace( /<a/g, "\n<a" );
    txt = txt.replace( /<t/g, "\n<t" );
    txt = txt.replace( /<\/t/g, "\n</t" );
    // .. remove tables
    txt = txt.replace( /<.?t(.*?)>/g, " " );
    // .. remove footnote marks
    let regx = /<span class=libFootnotenum>(.*?)<\/span>/g;
    txt = txt.replace( regx, " " );
    // .. some trims
    txt = txt.replace( /<br clear=all>/g, " " );
    txt = txt.replace( /<br>/g, " " );
    txt = txt.replace( / +/g, " " );
    return txt;

}

// .. ======================================================================

function getBook_v0 ( source: string ): string[][] {

    let book: string[][] = [],
        tmpPage: string[] = [],
        lines = source.split( "\n" );

    // ..  do some trims
    for ( let i in lines ) lines[i] = lines[i].trim();

    // .. do the Action f
    for ( let line of lines.filter( x => x ) ) {

        if ( line.startsWith( "<a name=" ) && line.endsWith( "</a>" ) ) {
            // .. add Page to the Book
            book.push( tmpPage );
            // .. get a new Page
            tmpPage = [];
        }
        // .. add to the Page
        else if ( line.startsWith( "<p" ) && line.endsWith( "</p>" ) )
            tmpPage.push( line );
        // .. report error
        else console.warn( "\n", line );

    }

    // .. return it back
    return book.filter( x => x.length );

}

// .. ======================================================================

function getBook_v1 ( book: string[][] ) {

    // .. remove FootNote Sections
    for ( let i=0; i<book.length; i++ ) {

        let page = book[i];
        let hr_ID = -1;
        let hr: RegExpMatchArray;
        let HR = "<p class=libLine>";

        [ hr, page ] = hrCtr( page, HR );

        // .. page has multiple divide lines!
        if ( hr.length > 1 ) console.log( "Unexpected Page: ", page );
        // .. divide page by the LineID
        else if ( hr.length === 1 ) {
            hr_ID = page.findIndex( x => x.startsWith(HR) );
            // .. just Upper-Part of Pages remains!
            if ( ~hr_ID ) book[i] = page.filter( (x,i) => i < hr_ID );
            else console.log( "Unexpected HR Location: ", page );
        }
        // .. do nothing
        else {}

        book[i] = removeAlaemTags( book[i] );
        book[i] = removeUnimportantLines( book[i] );

    }

    book = book.filter( p => p.length );

    return book;

}

// .. ======================================================================

function removeAlaemTags ( page: string[] ) {

    let regx: RegExp;
    let salam = [ 
        "عليها‌السلام","صلى‌الله‌عليه‌وآله‌وسلم","صلى‌الله‌عليه‌وآله","صلى‌الله‌عليه‌وآله‌","عليه‌السلام",
        "عليهم‌السلام","عليهما‌السلام","رضي‌الله‌عنه","رحمه‌الله","رحمهم‌الله","قدس‌سره",""
    ];

    for ( let j=0; j<page.length; j++ ) {
        page[j] = page[j].replace( /<span class=libAlaem><\/span>/g, " " );
        page[j] = page[j].replace( /<span class=libNormal><\/span>/g, " " );
        for ( let p of salam ) {
            regx = new RegExp( "<span class=libAlaem>" + p + "<\/span>", "g" );
            page[j] = page[j].replace( regx, " " + p + " " );
            regx = new RegExp( "<span class=libAlaemHeading2>" + p + "<\/span>", "g" );
            page[j] = page[j].replace( regx, " " + p + " " );
        }
        for ( let p of salam ) {
            regx = new RegExp( "<span class=libFootnoteAlaem>" + p + "<\/span>", "g" );
            page[j] = page[j].replace( regx, " " + p + " " );
            regx = new RegExp( "<span class=libFootnoteAlaem>" + p + "<\/span>", "g" );
            page[j] = page[j].replace( regx, " " + p + " " );
        }
        page[j] = page[j].replace( /<span class=libAlaem>\(<\/span>/g, ' ( ' );
        page[j] = page[j].replace( /<span class=libAlaem>\)<\/span>/g, ' ) ' );
        page[j] = page[j].replace( /<span class=libAlaem>\)\.<\/span>/g, ' ) . ' );
        page[j] = page[j].replace( /<span class=libAlaem>\*<\/span>/g, ' * ' );
        page[j] = page[j].replace( /<span class=libAlaemHeading2>\*<\/span>/g, ' * ' );
        page[j] = page[j].replace( /<span class=libAlaemHeading2>\*\*<\/span>/g, ' ** ' );
        // .. replace libAie with native Q tag
        let q = ( page[j].match( /<span class=libAie>(.*?)<\/span>/g ) || [] );
        for ( let c of q ) {
            let r = c;
            r = r.replace( "<span class=libAie>", " #Q# ) " );
            r = r.replace( "<\/span>", " ( #/Q# " );
            page[j] = page[j].replace( c, r );
        }
    }

    return page;

}

// .. ======================================================================

function hrCtr ( page: string[], HR: string ) {

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

function removeUnimportantLines ( page: string[] ) {
    page = page.filter( x => { 
        if ( x.replace( /(<([^>]+)>)/ig, '' ).trim().length < 2 ) return false;
        if ( x === "<p class=libFootnote>" ) return false;
        if ( x.startsWith( "<p class=libCenterBold2>" ) ) return false;
        if ( x.startsWith( "<p class=Heading1Center>" ) ) return false;
        if ( x.startsWith( "<p class=Heading2Center>" ) ) return false;

        // ! double check
        if ( x.startsWith( "<p class=libCenterBold1" ) ) return false;

        return true;
    } );
    return page;
}

// .. ======================================================================

function pre_d_executer ( str: string ) {

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

    str = ( str.startsWith( "أقول: " ) ) ? "" : str;
    str = ( str.startsWith( "ورواه " ) ) ? "" : str;

    str = str.replace( /(<([^>]+)>)/ig, '' );

    let a = ( str.match( /\[/g ) || [] ).length;
    let b = ( str.match( /\]/g ) || [] ).length;
    // .. report errors
    if ( a !== b ) console.log( "Unexpected ID Format: ", a, b, str );

    return str;

}

// .. ======================================================================

function d_executer ( book: string[] ) {

    let newBook: TS.db = [],
        hadith: TS.db_item = {} as any;

    for ( let p of book ) {
        let cdn = p.match( /\[ ?[0-9]+ ?\] [0-9]+ - /g) || [];
        if ( cdn.length === 0 ) {
            // .. append line
            hadith.a += " " + p;
        }
        else if ( cdn.length === 1 ) {
            newBook.push( hadith );
            hadith = {} as any;
            hadith.a = p.slice( cdn[0].length );
            let dp = cdn[0].split( "-" )[0].split( "]" );
            hadith.d = dp[0].replace( "[", "" ).trim();
            hadith.j = dp[1].trim() as any;
        }
        else console.log( "Unexpected Line: ", p );
    }

    return newBook;

}

// .. ======================================================================

function c_executer ( item: TS.db_item ) {

    

    return item;

}

// .. ======================================================================
