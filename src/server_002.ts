import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";
// .. ======================================================================

export async function init () {

    fs.rmSync( "src/db/tmp/01.json", { force: true } );
    fs.rmSync( "src/db/tmp/02.json", { force: true } );

    let textBook: string,
        book_v0: string[][],
        book_v1: string[][],
        set_v1: string[][] = [],
        set_v2: string[] = [],
        db_v0: TS.db,
        db_v1: TS.db = [];

    // // .. convert all sourceText => set v1
    // for ( let i=1; i<=29; i ++ ) {
    //     textBook = readSrcBook(i);
    //     book_v0 = getBook_v0( textBook );
    //     book_v1 = getBook_v1( book_v0 );
    //     set_v1 = [ ...set_v1, ...book_v1 ];
    // }

    // // .. convert set v1 to v2 [ string[][]=>string[] ]
    // for ( let i in set_v1 ) set_v2 = [ ...set_v2, ...set_v1[i] ];
    // // .. get hadith prepared for extraction id from sourceText
    // for ( let i in set_v2 ) set_v2[i] = pre_d_executer ( set_v2[i] );
    // // .. trim set v2
    // set_v2 = set_v2.filter( x => x );
    // // .. get hadith-id from sourceText [ assign d & j ]
    // db_v0 = d_executer( set_v2 );
    // // .. text unifier
    // for ( let i in db_v0 ) db_v0[i].a = basic_tools.charSpacer( db_v0[i].a );
    // fs.writeFileSync( "src/db/tmp/00.json", JSON.stringify(db_v0,null,"\t") );
    db_v0 = JSON.parse( fs.readFileSync( "src/db/tmp/00.json", 'utf8' ) );
    // .. main divider
    for ( let i in db_v0 ) db_v1[i] = divide_executer( db_v0[i] );

    db_v1 = lastTrim ( db_v1 );
    db_v1 = i_rss_cuter ( db_v1 );
    // let rss = getQuoter( db_v1 );
    // db_v1 = removeCuter( db_v1, rss );
    // fs.writeFileSync( "src/db/tmp/02.json", JSON.stringify(rss,null,"\t") );

    fs.writeFileSync( "src/db/tmp/01.json", JSON.stringify(db_v1,null,"\t") );

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
        // .. just append line
        if ( cdn.length === 0 ) hadith.a += " ^" + p;
        // .. beginning of a new Hadith
        else if ( cdn.length === 1 ) {
            if ( hadith.a ) newBook.push( hadith );
            hadith = {} as any;
            hadith.a = " ^" + p.slice( cdn[0].length );
            let dp = cdn[0].split( "-" )[0].split( "]" );
            hadith.d = Number( dp[0].replace( "[", "" ).replace( / /g, "" ) );
            hadith.idInSection = Number( dp[1].trim() ) || null;
        }
        // .. error report
        else console.log( "Unexpected Line:", p );
    }
    // .. add ĺast item
    if ( hadith.a ) newBook.push( hadith );

    return newBook;

}

// .. ======================================================================

function divide_executer ( item: TS.db_item ) {

    // .. cut EndOfHadith "STRICK"
    item = endOfHadith_Cuter( item );
    // .. cut BeginningOfHadith "STRICK" & Assign C
    item = cPlus( item );

    return item;

}

// .. ======================================================================

function cPlus ( item: TS.db_item ) {
    let cut_ID: number = -1,
        cdnBOX: { text: string, c: number, excludesText: boolean }[];

    cdnBOX = [
        // .. excludesText
        { text: " عن أبي جعفر عليه‌السلام قال :", c: 6, excludesText: true },
        { text: " قال أبو عبدالله عليه‌السلام :", c: 6, excludesText: true },
        { text: " كتب إلى أبي الحسن عليه‌السلام :", c: 8, excludesText: false },
        { text: " عن الصادق عليه‌السلام قال :", c: 6, excludesText: true },
        { text: " عن أبي عبدالله عليه‌السلام قال :", c: 6, excludesText: true },
        { text: " قال أبو الحسن عليه‌السلام :", c: 7, excludesText: true },
        { text: " أخيه أبي الحسن عليه‌السلام قال :", c: 7, excludesText: true },
        { text: " قال لي أبو عبدالله عليه‌السلام", c: 6, excludesText: true },
        { text: " قال لي أبوعبدالله عليه‌السلام", c: 6, excludesText: true },
        { text: " موسى بن جعفر عليه‌السلام قال :", c: 7, excludesText: true },
        { text: " قال لي أبو عبد الله عليه‌السلام", c: 6, excludesText: true },
        { text: " عن أبي جعفر الباقر عليه‌السلام قال :", c: 6, excludesText: true },
        { text: " قال الصادق عليه‌السلام :", c: 6, excludesText: true },
        { text: " قال أبوعبدالله عليه‌السلام :", c: 6, excludesText: true },
        { text: " عن أبي جعفر عليه‌السلام أنه قال :", c: 5, excludesText: true },
        { text: " عن أبي جعفر عليه‌السلام قال - في حديث -", c: 5, excludesText: true },
        { text: " عن أبي جعفر عليه‌السلام - في حديث - قال :", c: 5, excludesText: true },
        { text: " قال أبوجعفر عليه‌السلام :", c: 5, excludesText: true },
        { text: " عن زينب بنت علي عليه‌السلام قالت :", c: 77, excludesText: true },
        { text: " سمعت أبا جعفر عليه‌السلام يقول :", c: 5, excludesText: true },
        { text: " سمعت أبا الحسن عليه‌السلام يقول", c: 8, excludesText: true },
        { text: " عن الرضا عليه‌السلام قال :", c: 8, excludesText: true },
        { text: " محمد بن علي بن الحسين قال", c: 5, excludesText: true },
        { text: " عن أبي جعفر وأبي عبدالله عليهما‌السلام أنهما قالا :", c: 5, excludesText: true },
        { text: " عن أبي جعفر وأبي عبدالله عليهما‌السلام قالا :", c: 5, excludesText: true },
        { text: " عن أبي جعفر وأبي عبدالله عليهما‌السلام ، قال :", c: 5, excludesText: true },
        { text: " عن أبي جعفر وأبي عبدالله عليهما‌السلام ، قالا :", c: 5, excludesText: true },
        { text: " عن أبي جعفر وأبي عبدالله عليهما‌السلام ، أنهما قالا :", c: 5, excludesText: true },
        { text: " عن أبي جعفر وأبي عبدالله عليه‌السلام قالا :", c: 5, excludesText: true },
        { text: " عن أبي جعفر وأبي عبدالله عليهما‌السلام قال :", c: 5, excludesText: true },
        { text: " عن أبي الحسن الرضا عليه‌السلام قال :", c: 8, excludesText: true },
        { text: " عن أحدهما عليه‌السلام قال :", c: 5, excludesText: true },
        { text: " قال أبو عبد الله عليه‌السلام :", c: 6, excludesText: true },
        { text: " عن أحدهما عليهما‌السلام قال :", c: 5, excludesText: true },
        { text: " قال الصادق جعفربن محمد عليه‌السلام :", c: 6, excludesText: true },
        { text: " عن أبيه عليهما‌السلام قال :", c: 5, excludesText: true },
        { text: " عن أبي الحسن موسى عليه‌السلام قال :", c: 7, excludesText: true },
        { text: " قال علي بن الحسين عليه‌السلام :", c: 4, excludesText: true },
        { text: " عن أخيه موسى عليه‌السلام قال :", c: 7, excludesText: true },
        { text: " موسى بن جعفر عليهما‌السلام قال :", c: 7, excludesText: true },
        { text: " عن أبي الحسن الماضي عليه‌السلام قال :", c: 77, excludesText: true },
        { text: " عن الرضا عليه‌السلام - في حديث - قال :", c: 8, excludesText: true },
        { text: " عن أبي الحسن عليه‌السلام قال :", c: 7, excludesText: true },
        { text: " عن أبي عبد الله عليه‌السلام قال :", c: 6, excludesText: true },
        { text: " عن الصادق جعفر بن محمد عليهما‌السلام قال :", c: 6, excludesText: true },
        { text: " قال أبوذر رحمه‌الله :", c: 77, excludesText: true },
        { text: " عن علي بن الحسين عليه‌السلام قال :", c: 4, excludesText: true },
        { text: " سمعت علي بن الحسين عليه‌السلام يقول :", c: 4, excludesText: true },
        { text: " سمعت أبا عبدالله عليه‌السلام يقول", c: 6, excludesText: true },
        { text: " قال الرضا عليه‌السلام :", c: 8, excludesText: true },
        { text: " عن أبي عبد الله عليه‌السلام :", c: 6, excludesText: true },
        { text: " وقال أبو عبدالله عليه‌السلام :", c: 6, excludesText: true },
        
        // .. includesText
        { text: " لأبي عبدالله عليه‌السلام :", c: 6, excludesText: false },
        { text: " سأل أبا عبدالله عليه‌السلام", c: 6, excludesText: false },
        { text: " قلت لأبي عبدالله عليه‌السلام", c: 6, excludesText: false },
        { text: " قلت لابي عبدالله عليه‌السلام", c: 6, excludesText: false },
        { text: " سألت أبا الحسن عليه‌السلام", c: 7, excludesText: false },
        { text: " سألت أبا عبد الله عليه‌السلام", c: 6, excludesText: false },
        { text: " سئل أبو عبد الله عليه‌السلام", c: 6, excludesText: false },
        { text: " دخلت على أبي جعفر عليه‌السلام", c: 5, excludesText: false },
        { text: " قلت للرضا عليه‌السلام", c: 8, excludesText: false },
        { text: " قلت لأبي الحسن", c: 7, excludesText: false },
        { text: " كنت عند أبي عبدالله عليه‌السلام", c: 6, excludesText: false },
        { text: " يسأل أبا عبدالله عليه‌السلام", c: 6, excludesText: false },
        { text: " كتبت إلى الرضا عليه‌السلام", c: 8, excludesText: false },
        { text: " سألت أبا عبدالله عليه‌السلام", c: 6, excludesText: false },
        { text: " قلت لأبي جعفر عليه‌السلام", c: 5, excludesText: false },
        { text: " كنا جلوسا عند أبي عبدالله عليه‌السلام", c: 6, excludesText: false },
        { text: " سمعت أبا عبد الله عليه‌السلام", c: 6, excludesText: false },
        { text: " قلت لأبي عبد الله عليه‌السلام", c: 6, excludesText: false },
        { text: " سألنا أبا عبدالله عليه‌السلام", c: 6, excludesText: false },
        { text: " سألت أبا جعفر عليه‌السلام", c: 5, excludesText: false },
        { text: " دخلت على سيدي علي بن محمد عليهما‌السلام", c: 10, excludesText: false },

    ];

    // .. cut BeginningOfHadith "STRICK"
    for ( let p of cdnBOX ) {
        cut_ID = item.a.indexOf( p.text );
        if ( ~cut_ID ) {
            item[0] = item[0] ? item[0] + " " : "";
            if ( p.excludesText ) cut_ID += p.text.length;
            item[0] = item.a.slice( 0, cut_ID ) + item[0];
            item.a = item.a.slice( cut_ID );
            item.c = p.c;
        }
    }

    return item;

}

// .. ======================================================================

function endOfHadith_Cuter ( item: TS.db_item ) {
    let cut_ID: number = -1,
        cut_ID_p: number = -1,
        cdnBOX: { text: string, clear?: boolean }[];

    cdnBOX = [
        { text: " الحديث .", clear: true },
        { text: "^أقول :" },
        { text: "^ أقول :" },
        { text: "^ورواء" },
        { text: "^وراوه" },
        { text: "^ورواه" },
        { text: "^ ورواه" },
        { text: "^رواه" },
        { text: "^وروى" },
        { text: "رواية اُخرى " },
        { text: "قال الكليني : " },
        // حديث آخر
    ];

    // .. cut EndOfHadith "STRICK"
    for ( let p of cdnBOX ) {
        cut_ID = item.a.lastIndexOf( p.text );
        if ( ~cut_ID ) {
            item[9] = item[9] ? " " +item[9] : "";
            cut_ID_p = cut_ID + ( p.clear ? p.text.length : 0 );
            item[9] = item.a.slice( cut_ID_p ) + item[9];
            item.a = item.a.slice( 0, cut_ID );
        }
    }

    return item;

}

// .. ======================================================================

function leakage ( db: TS.db ) {
    let cc = [];
    for( let i in db ) 
        if ( Number(i) +1 +cc.length !== db[i].d )
            cc.push( Number(i) +1 +cc.length );
    console.log(cc);
}

// .. ======================================================================

function lastTrim ( db: TS.db ) {

    for ( let p of db ) {
        p.a = p.a.trim();
        if ( p.a.startsWith( ":" ) ) p.a = p.a.slice(1);
        p.a = p.a.trim();
        if ( p.a.endsWith( "،" ) ) p.a = p.a.slice( 0, p.a.length -1 );
        p.a = p.a.trim();
        if ( p.a.startsWith( "؛" ) ) p.a = p.a.slice(1);
        p.a = p.a.trim();
        if ( p.a.endsWith( "؛" ) ) p.a = p.a.slice( 0, p.a.length -1 ) + ".";
        p.a = p.a.trim();
        if ( p.a.endsWith( " ." ) ) p.a = p.a.slice( 0, p.a.length -2 ) + ".";
        p.a = p.a.trim();

        // ! remove it
        delete p[0]
        delete p[9]
        delete p.idInSection
        delete p.d
    }

    // ! remove it
    db = db.filter( x => !x.c );
    
    return db;

}

// .. ======================================================================

function getQuoter ( db: TS.db ) {

    let rss: string[] = [],
        tmp: string[];

    for ( let p of db ) {
        if ( p[0] ) {
            tmp = p[0].split("،");
            tmp = tmp.filter( x => x.includes( "بن" ) && x.includes( "عن " ) );
            tmp = tmp.filter( x => !x.includes( ":" ) && !x.includes( "." ) );
            tmp = tmp.filter( x => !x.includes("عليه‌السلام") && !x.includes("أبيه") );
            tmp = tmp.filter( x => !x.includes(" قلت ") && !x.includes(" قال") );
            rss = [ ...rss, ...tmp ];
        }
    }

    rss = [ ...new Set(rss) ];

    return rss;

}

// .. ======================================================================

function removeCuter( db: TS.db, rss: string[] ) {

    let i = 0;
    let max: number;
    let time = new Date().getTime();

    for ( let p of db ) {
        tools.timer( db.length, i++, time, "RSS Remover" );
        rss.reduce( (head,nextOne) =>
            p.a.indexOf( nextOne ) > head ?
                p.a.indexOf( nextOne ) + nextOne.length : head
        , -1 );
        if ( ~max ) {
            p[0] = p.a.slice( 0, max ) + p[0];
            p.a = p.a.slice( max );
        }
    }

    return db;

}


// .. ======================================================================

function findAll ( str: string ): TS.rss_item[] {
    let output = [],
        match: RegExpExecArray,
        regx = /عن (.+?)،/g;

    regx = RegExp( regx, [...new Set( "g" + regx.flags ) ].join("") );
    while ( match = regx.exec(str) ) {
        delete match.input;
        output.push(match);
    }
    output = output.map( x => { 
        return {
            text: x[0],
            id: x.index,
            nextExp: x[0].length +x.index
        }
    } );
    return output;
}

// .. ======================================================================

function i_rss_cuter ( db: TS.db ) {

    let rss: TS.rss_item[] = [],
        test: TS.rss_item[][] = [],
        cut_ID: number;

    for ( let p of db ) {
        cut_ID = getRSSCutPoint( rss );
        if ( ~cut_ID ) {
            p[0] = p[0] ? p[0] + " " : "";
            p[0] = p[0] + p.a.slice( 0, cut_ID );
            p.a = p.a.slice( cut_ID );
        }
    }

    return db;

}

// .. ======================================================================

function rss_validator ( rss: TS.rss_item[] ) {

    let distance: number;
    let cdnBox = [
        ":",
        "صلى‌الله‌عليه‌وآله‌وسلم", "صلى‌الله‌عليه‌وآله", 
        "عليه‌السلام", "عليهما‌السلام", "عليهم‌السلام"
    ];

    MajorLoop:
    for ( let i in rss ) {
        for ( let q of cdnBox ) {
            if ( rss[i].text.includes(q) ) {
                rss = rss.slice( 0, Number(i) );
                break MajorLoop;
            }
        }
    }

    for ( let i in rss ) {
        try {
            distance = rss[ Number(i) +1 ].id - rss[i].nextExp;
            rss[i].myDistanceToNextOne = distance;
        } catch {}
    }

    MajorLoop:
    for ( let i in rss ) {
        if ( rss[i].myDistanceToNextOne > 7 ) {
            rss = rss.slice( 0, Number(i) +1 );
            break MajorLoop;
        }
    }

    return rss;

}

// .. ======================================================================

function getRSSCutPoint ( rss: TS.rss_item[] ) {
    let id: number = -1;
    try { id = rss[ rss.length -1 ].nextExp } catch {}
    return id;
}

// .. ======================================================================
