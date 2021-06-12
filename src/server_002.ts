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
    for ( let i=15; i<=15; i ++ ) {
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
    db_v1 = db_v1.filter( x => x );
    console.log(db_v1.length);
    let e = [ 
        4742, 4744, 5079, 5301, 5368, 5429, 5430, 5727, 5912, 
        5995, 6128, 6161, 6221, 6273, 6465, 6494, 6517, 6759,
        6803, 7735, 7963, 8422, 
        10053, 10584, 10585,
        11855, 
        13995,
        14181, 14296, 14645,
        14970, 15040, 15083, 15209,
        19427
    ];
    let c = 19900;
    for ( let i=1; i <= db_v1.length; i++ ) {
        // .. correct idx
        for ( let p of e ) if ( i+c === p ) c++;

        if ( i+c !== Number(db_v1[i-1].d) ) {
            console.log( "Expect:", i+c, "But says:", Number(db_v1[i-1].d) );
            require('child_process').
            exec( 'echo '+Number(db_v1[i-1].d)+' | xclip -selection clipboard' );
            break;
        }
    }

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
        txt = txt.slice( a, b +19 );
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
        let cdn = p.match( /\[ ?[0-9 ]+ ?\] ?([0-9]+)? ?- ?/g) || [];
        if ( cdn.length === 0 ) {
            // .. append line
            hadith.a += " " + p;
        }
        else if ( cdn.length === 1 ) {
            if ( hadith.a ) newBook.push( hadith );
            hadith = {} as any;
            hadith.a = p.slice( cdn[0].length );
            let dp = cdn[0].split( "-" )[0].split( "]" );
            hadith.d = dp[0].replace( "[", "" ).replace( / /g, "" );
            hadith.j = (dp[1].trim() || null)as any;
        }
        else console.log( "Unexpected Line: ", p );
    }

    return newBook;

}

// .. ======================================================================

function c_executer ( item: TS.db_item ) {

    let cut_ID: number = -1,
        cdnBOX: { text: string, c: number, after: boolean }[];

    // .. pre-set
    item.c = null;

    // .. trimEndOfHadith
    let endHadithCDN = "الحديث .";
    cut_ID = item.a.indexOf( endHadithCDN );
    if ( ~cut_ID ) {
        // .. add more text than CDN itself
        if ( endHadithCDN !== item.a.slice( cut_ID ) ) 
            ( item as any ).b2 = item.a.slice( cut_ID + endHadithCDN.length );
        item.a = item.a.slice( 0, cut_ID );
    }
    cut_ID = -1;

    cdnBOX = [
        { text: "عن أبي جعفر عليه‌السلام", c: 5, after: true },
        { text: "قال لأبي عبدالله عليه‌السلام :", c: 6, after: false },
        { text: "عن أبي عبدالله عليه‌السلام", c: 6, after: true },
        { text: "عن الصادق عليه‌السلام", c: 6, after: true },
        { text: "قلت لأبي عبدالله عليه‌السلام", c: 6, after: false },
        { text: "يسأل أبا عبدالله عليه‌السلام", c: 6, after: false },
        { text: "قال أبو جعفر عليه‌السلام", c: 5, after: true },
        { text: "خطب أمير المؤمنين عليه‌السلام", c: 6, after: true },
        { text: "عن زينب بنت علي عليه‌السلام", c: 77, after: true },
        { text: "سمعت أبا جعفر عليه‌السلام يقول :", c: 5, after: true },
        { text: "قال الصادق عليه‌السلام", c: 6, after: true },
        { text: "قال أبوجعفر عليه‌السلام", c: 5, after: true },
        { text: "سمعت أبا الحسن عليه‌السلام يقول", c: 8, after: true },
        { text: "عن الصادق جعفر بن محمد عليهما‌السلام قال", c: 6, after: true },
        { text: "كتبت إلى الرضا عليه‌السلام", c: 8, after: false },
        { text: "سألت أبا عبدالله عليه‌السلام", c: 6, after: false },
        { text: "عن الرضا عليه‌السلام قال", c: 8, after: true },
        { text: "رفع الحديث إلى علي عليه‌السلام", c: 1, after: false },
        { text: "عن أمير المؤمنين عليه‌السلام", c: 1, after: true },
        { text: "قال أبوعبدالله عليه‌السلام :", c: 6, after: true },
        { text: "قلت لأبي جعفر عليه‌السلام", c: 5, after: false },
        { text: "سألت أبا جعفر عليه‌السلام", c: 5, after: false },
        { text: "موسى بن جعفر عليه‌السلام قال", c: 7, after: true },
        { text: "كتب إلى أبي الحسن عليه‌السلام :", c: 8, after: false },
        { text: "عن جعفربن محمد", c: 6, after: true },
        { text: "موسى بن جعفر عليه‌السلام قال", c: 7, after: true },
        { text: "عن علي بن الحسين عليه‌السلام", c: 4, after: true },
        { text: "قال أبو عبدالله عليه‌السلام :", c: 6, after: true },
        { text: "عن أحدهما عليه‌السلام قال", c: 5, after: true },
        { text: "عن أبي الحسن موسى عليه‌السلام", c: 7, after: true },
        { text: "سألنا أبا عبدالله عليه‌السلام", c: 6, after: false },
        { text: "قال أبو عبدالله عليه‌السلام", c: 6, after: true },
        { text: "عن أبي الحسن الرضا عليه‌السلام", c: 8, after: true },
        { text: "كنا جلوسا عند أبي عبدالله عليه‌السلام", c: 6, after: false },
        { text: "سمعت أبا عبدالله عليه‌السلام يقول", c: 6, after: true },
        { text: "قال الصادق جعفربن محمد عليه‌السلام", c: 6, after: true },
        { text: "، عن جعفر بن محمد ،", c: 5, after: true },
        { text: "، عن أبي عبدالله ،", c: 6, after: true },
        { text: "قال أبوذر رحمه‌الله", c: 77, after: true },
        { text: "قال لي أبوعبدالله عليه‌السلام", c: 6, after: true },
        { text: "الصادق جعفر بن محمد عليه‌السلام", c: 6, after: true },
        { text: "الصادق جعفر بن محمد", c: 6, after: true },
        { text: "قلت لأبي عبد الله عليه‌السلام", c: 6, after: false },
        { text: "عن أحدهما عليهما‌السلام", c: 5, after: true },
        { text: "عن أبي عبد الله عليه‌السلام", c: 6, after: true },
        { text: "قلت لابي عبدالله عليه‌السلام", c: 6, after: false },
        { text: " عن أبي الحسن عليه‌السلام ", c: 7, after: true },
        { text: "سألت أبا الحسن عليه‌السلام", c: 7, after: false },
        { text: "قال أبو عبد الله عليه‌السلام", c: 6, after: true },
        { text: "سألت أبا عبد الله عليه‌السلام", c: 6, after: false },
        { text: "قال لي أبو عبد الله عليه‌السلام", c: 6, after: true },
        { text: "قال لي أبو عبدالله عليه‌السلام", c: 6, after: true },
        { text: "عن الرضا عليه‌السلام", c: 8, after: true },
        { text: "عن أبي الحسن الماضي", c: 77, after: true },
        { text: "موسى بن جعفر عليهما‌السلام", c: 7, after: true },
        { text: "عن أبي جعفر الباقر عليه‌السلام", c: 6, after: true },
        { text: "سئل أبو عبد الله عليه‌السلام", c: 6, after: false },
        { text: "سمعت أبا عبد الله عليه‌السلام", c: 6, after: false },
        { text: "عن أخيه موسى عليه‌السلام", c: 7, after: true },
        { text: "دخلت على أبي جعفر عليه‌السلام", c: 5, after: false },
        { text: "سأل أبا عبدالله عليه‌السلام", c: 6, after: false },
        { text: "قال أمير المؤمنين عليه‌السلام", c: 1, after: true },
        { text: "أبي عبدالله عليه‌السلام قال", c: 6, after: true },
        { text: "عن علي عليه‌السلام", c: 1, after: true },
        { text: "قال علي بن الحسين", c: 4, after: true },
        { text: "عن أبي جعفر وأبي عبدالله عليهما‌السلام", c: 5, after: true },
        { text: "قلت للرضا عليه‌السلام", c: 8, after: false },
        { text: "قلت لأبي الحسن", c: 7, after: false },
        { text: "محمد بن علي بن الحسين قال", c: 5, after: true },
        { text: "كنت عند أبي عبدالله عليه‌السلام", c: 6, after: false },
        { text: "قال أبو الحسن عليه‌السلام", c: 7, after: true },
        // ! put in end
        { text: "، عن جعفر ،", c: 6, after: true },
        { text: "سمعت علي بن الحسين", c: 4, after: true },
        { text: "عن أبي جعفر الثاني عليه‌السلام", c: 77, after: true },
        { text: "عن أبي جعفر ،", c: 5, after: true },
        { text: "عن الرضا ،", c: 8, after: true },
        { text: "قال الرضا عليه‌السلام", c: 8, after: true },
        { text: "، عن الصادق ،", c: 6, after: true },
        { text: "عن جعفر بن محمّد", c: 6, after: true },
        { text: "دخلت على سيدي علي بن محمد عليهما‌السلام", c: 10, after: false },
        { text: "عن أخيه أبي الحسن عليه‌السلام", c: 7, after: true },
        // ! check again
        { text: " موسى بن جعفر عليه‌السلام ", c: 7, after: true },
        { text: "علي بن أبي طالب", c: 1, after: true },
        { text: "قال رسول الله صلى‌الله‌عليه‌وآله", c: 13, after: true },
        { text: "عن النبي صلى‌الله‌عليه‌وآله‌وسلم", c: 13, after: true },
        { text: "عن النبي صلى‌الله‌عليه‌وآله", c: 13, after: true },
        { text: "الرضا عليه‌السلام", c: 8, after: true },
        { text: "أبي جعفر عليه‌السلام", c: 5, after: true },
        { text: "عند أبي عبدالله عليه‌السلام", c: 6, after: false },
        // ! end???
        { text: "قال :", c: 77, after: true },
        { text: "قال عليه‌السلام :", c: 77, after: true },
        { text: ":", c: 77, after: true },

    ]

    for ( let cdn of cdnBOX ) {
        cut_ID = item.a.indexOf( cdn.text );
        if ( ~cut_ID ) {
            item.b = item.a.slice( 0, cut_ID );
            if ( cdn.after ) cut_ID += cdn.text.length;
            item.a = item.a.slice( cut_ID );
            item.c = cdn.c;
            return item;
        }
    }


 
    return item;

}

// .. ======================================================================
