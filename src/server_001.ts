import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";
// .. ======================================================================

export async function init () {

    tools.notify( "     الکافی   " );

    let db = [];

    // .. get v0 [ Scratch | Cached ]
    db = load_db_v0( "Cached" );

    db = db.map( x => x.a.split("^") );
    for( let i in db ) db[i] = db[i].filter( x => x !== " " );
    fs.writeFileSync( "src/db/tmp/01.json", JSON.stringify(db,null,"\t") );

}

// .. ======================================================================

function load_db_v0 ( mode: "Scratch"|"Cached" ) {

    let db_v0: TS.db,
        _00_Path = "src/db/tmp/00_K.json";

    if ( mode === "Cached" ) {
        db_v0 = JSON.parse( fs.readFileSync( _00_Path, 'utf8' ) );
    }

    if ( mode === "Scratch" ) {

        fs.rmSync( _00_Path, { force: true } );

        let textBook: string,
            book_v0: string[][],
            book_v1: string[][],
            set_v1: string[][] = [],
            set_v2: string[] = [];

        // .. convert all sourceText => set v1
        for ( let i=1; i<=15; i ++ ) {
            textBook = readSrcBook(i);
            book_v0 = getBook_v0( textBook );
            book_v1 = getBook_v1( book_v0 );
            set_v1 = [ ...set_v1, ...book_v1 ];
        }
        // .. convert set v1 to v2 [ string[][]=>string[] ]
        for ( let i in set_v1 ) set_v2 = [ ...set_v2, ...set_v1[i] ];
        // .. get hadith prepared for extraction id from sourceText
        for ( let i in set_v2 ) set_v2[i] = set_trimmer ( set_v2[i] );
        // .. trim set v2
        set_v2 = set_v2.filter( x => x );
        // .. get hadith from sourceText and [ assign d & j ]
        db_v0 = hadith_db_generator( set_v2 );
        // // .. text unifier
        // db_v0 = text_unifier( db_v0 );
        // .. save it in storage
        fs.writeFileSync( _00_Path, JSON.stringify( db_v0, null, "\t" ) );

    }

    return db_v0;

}

// .. ======================================================================

function readSrcBook ( num: number ): string {

    console.log( "reading book num: " + num + "...");

    let filePath = "src/db/source/الكافي/" + num + ".htm";
    // .. check
    fs.accessSync( filePath, fs.constants.R_OK );
    // .. get source
    let txt = fs.readFileSync( filePath , 'utf8' );

    // .. cut beginning and end of the book
    let a = txt.indexOf( "<a name='aaa'></a>" );
    let b = txt.indexOf( "<a name='xxx'></a>" );

    if ( a>0 && b>0 ) {
        txt = txt.slice( a, b +19 );
        txt = lines_PureText( txt );
        return txt;
    }
    else console.log( "err-01",a , b )

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
    txt = txt.replace( /<\/?b>/g, " " );
    txt = txt.replace( /&nbsp;/g, " " );
    txt = txt.replace( /&quot;/g, "\"" );
    txt = txt.replace( /<p class='MsoNormal'>/g, " " );
    txt = txt.replace( /<p><\/p>/g, " " );
    txt = txt.replace( /<p> +<\/p>/g, " " );

    txt = txt.replace( / +/g, " " );
    // .. some edits
    txt = txt.replace( /<p>/g, "<p class=libNormal>" );
    txt = txt.replace( /<p class=libFootnote>__________________<\/p>/g, "<p class=libLine></p>" );
    txt = txt.replace( /<p class=libNormal><\/p>/g, "" );

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
    // .. add last page
    if ( tmpPage.length ) book.push( tmpPage );

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

    for ( let j=0; j<page.length; j++ ) {
        page[j] = removeAlaemTags_Assistant( page[j] );
    }

    return page;

}

// .. ======================================================================

function removeAlaemTags_Assistant ( text: string ) {

    text = text.replace( /<span class=libAlaem>عزوجل<\/span>/g, " عزوجل " );
    text = text.replace( /<span class=libAlaem>رحمه‌الله<\/span>/g, " رحمه‌الله " );
    text = text.replace( /<span class=libAlaem>رحمهم‌الله<\/span>/g, " رحمهم‌الله " );
    text = text.replace( /<span class=libAlaem>عليه‌السلام<\/span>/g, " عليه‌السلام " );
    text = text.replace( /<span class=libAlaem>عليها‌السلام<\/span>/g, " عليها‌السلام " );
    text = text.replace( /<span class=libAlaem>عليهم‌السلام<\/span>/g, " عليهم‌السلام " );
    text = text.replace( /<span class=libAlaem>عليه‌السلام\(<\/span>/g, " عليه‌السلام " );
    text = text.replace( /<span class=libAlaem>عليهما‌السلام<\/span>/g, " عليهما‌السلام " );
    text = text.replace( /<span class=libAlaem>رضي‌الله‌عنه<\/span>/g, " رضي‌الله‌عنه " );
    text = text.replace( /<span class=libAlaem>عليها‌السلام\(<\/span>/g, " عليها‌السلام " );
    text = text.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله‌<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله\(<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله‌وسلم<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );

    text = text.replace( /- صَلَوَاتُ اللهِ عَلَيْهَا -/g, " عليها‌السلام " );
    text = text.replace( /- صَلَوَاتُ الله عَليْهَا -/g, " عليها‌السلام " );
    text = text.replace( /- صَلَوَاتُ اللهِ عَلَيْهِ -/g, " عليه‌السلام " );
    text = text.replace( /- صَلَوَاتُ اللهِ عَلَيْه -/g, " عليه‌السلام " );
    text = text.replace( /- صَلَوَاتُ‌ اللهِ عَلَيْهِ -/g, " عليه‌السلام " );
    text = text.replace( /أَمِيرُ الْمُؤْمِنِينَ صَلَواتُ اللهِ وَسَلامُهُ عَلَيِه/g, "أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام " );
    text = text.replace( /- صَلَوَاتُ اللهِ وسَلَامُهُ عَلَيْهِ -/g, " عليه‌السلام " );
    text = text.replace( /- صَلَوَاتُ اللهِ وَسَلَامُهُ عَلَيْهِ -/g, " عليه‌السلام " );
    text = text.replace( /- صَلَوَاتُ اللهِ وَسَلَامُهُ عَلَيْهِ-/g, " عليه‌السلام " );
    text = text.replace( /الْمُؤْمِنِينَ صَلَوَاتُ اللهِ عَلَيْهِ/g, " الْمُؤْمِنِينَ عليه‌السلام " );
    text = text.replace( /الْمُؤْمِنِينَ صَلَوَاتُ اللهِ عَلَيهِ/g, " الْمُؤْمِنِينَ عليه‌السلام " );
    text = text.replace( /- صَلَوَاتُ اللهِ عَلَيْهِمَا -/g, " عليهما‌السلام " );
    text = text.replace( /صَلَوَاتُ اللهِ عَلَيْهِمَا :/g, " عليهما‌السلام :" );
    text = text.replace( /- صَلَوَاتُ اللهِ عَلَيْهِمْ أَجْمَعِينَ -/g, " عليهم‌السلام " );
    text = text.replace( /- صَلَوَاتُ اللهِ عَلَيْهِمْ -/g, " عليهم‌السلام " );
    text = text.replace( /- صَلَوَاتُ اللهِ عَلَيْهِ وَآلِهِ -/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /صَلَوَاتُ اللهِ عَلَيْهِ وَسَلَامُهُ/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /صَلَوَاتُ اللهِ عَلَيْهِ :/g, " عليه‌السلام :" );
    text = text.replace( /صَلَوَاتُ اللهِ عَلَيْهِ ،/g, " عليه‌السلام ،" );

    text = text.replace( /أَبِي عَبْدِ اللهِ صلى‌الله‌عليه‌وآله‌وسلم/g, " أَبِي عَبْدِ اللهِ عليه‌السلام " );
    text = text.replace( /أَبَا عَبْدِ اللهِ صلى‌الله‌عليه‌وآله‌وسلم/g, " أَبَا عَبْدِ اللهِ عليه‌السلام " );

    text = text.replace( /<span class=libAlaem>\(<\/span>/g, "" );
    text = text.replace( /<span class=libAlaem>\)<\/span>/g, "" );

    // .. replace libAie with native Q tag
    let q = ( text.match( /<span class=libAie>(.*?)<\/span>/g ) || [] );
    for ( let c of q ) {
        let r = c;
        r = r.replace( "<span class=libAie>", " #Q# ) " );
        r = r.replace( "<\/span>", " ( #/Q# " );
        text = text.replace( c, r );
    }

    // .. remove some Tags
    text = text.replace( /<p class=libNormal>/g, " " );
    text = text.replace( /<p class=libNormal0>/g, " " );
    text = text.replace( /<p class=libPoem>/g, " " );
    text = text.replace( /<p class=libCenter>/g, " " );
    text = text.replace( /<p class=libCenterBold1>/g, " " );
    text = text.replace( /<p class=libBold1>/g, " " );
    text = text.replace( /<\/p>/g, " " );
    text = text.replace( /<span class=libAlaem>/g, " " );
    text = text.replace( /<span class=libNormal0>/g, " " );
    text = text.replace( /<span class=libNormal>/g, " " );
    text = text.replace( /<span class=libBold2>/g, " " );
    text = text.replace( /<span class=libFootnoteBold>/g, " " );
    text = text.replace( /<span class=libFootnoteAlaem>/g, " " );
    text = text.replace( /<span class=libFootnoteAie>/g, " " );
    text = text.replace( /<span class=libPoemTiniChar0>/g, " " );
    text = text.replace( /<\/span>/g, " " );
    // .. some fine trims
    text = text.replace( /<span class=libFootnote0>/g, " " );
    text = text.replace( /<p class=libBold2>/g, " " );
    text = text.replace( /<p class=libFootnote0>/g, " " );

    // .. trim
    text = text.replace( /\.\.\.\.\.+/g, "....." );
    text = text.replace( /\.\.\.\.\./g, " " );
    text = text.replace( /\[\.\.\.\]/g, " " );
    text = text.replace( / +/g, " " );
    text = text.trim();

    return text;

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

function set_trimmer ( str: string ) {

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

    let a = ( str.match( /\[/g ) || [] ).length;
    let b = ( str.match( /\]/g ) || [] ).length;
    // .. report errors
    if ( a !== b ) console.log( "Unexpected ID Format: ", a, b, str );

    return str;

}

// .. ======================================================================

function hadith_db_generator ( book: string[] ) {

    let newBook: TS.db = [],
        hadith: TS.db_item = {} as any;

    for ( let p of book ) {

        let cdn = p.match( /[0-9]+ ?\/ ?[0-9]+ ?\.? / ) || [];
        // .. just append line
        if ( cdn.length === 0 ) hadith.a += " ^" + p;
        // .. beginning of a new Hadith
        else if ( cdn.length === 1 ) {
            if ( hadith.a ) newBook.push( hadith );
            hadith = {} as any;
            hadith.a = " ^" + p.slice( cdn[0].length );
            let dp = cdn[0].split( "/" );
            hadith.d = Number( dp[0] );
            hadith.idInSection = Number( dp[1] );
        }
        // .. error report
        else console.log( "Unexpected Line:", p );
    }
    // .. add ĺast item
    if ( hadith.a ) newBook.push( hadith );

    return newBook;

}

// .. ======================================================================
