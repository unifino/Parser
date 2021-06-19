import * as tools                       from "./tools";
import * as SCT                         from "./server_common_tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";

// .. ======================================================================

export let name      = "الكافي";
export let tmpFolder = "src/db/tmp/" + name + "/";
let db_v1_Path       = tmpFolder + "01.json";
export let db_Path   = "src/db/ready/" + name + ".json";
let R_Path           = tmpFolder + "RR.json";
export let db_v1     : TS.db;
export let db        : TS.db;
let R                : TS.R[];
let R__              : TS.R[];

resource_update ();

// .. ======================================================================

export async function ignite ( mode: "Scratch"|"Cached", n_pad: number ) {
    // .. init server
    await init( mode );
    // .. update resources
    resource_update ();
    // .. N allocation
    n_pad = tools.n_allocation( db_v1, n_pad );
    // .. search for optimizing
    SCT._db_( R__, db_v1, tmpFolder );
    // .. check optimized info
    await tools._db_chcek_( tmpFolder, db_v1 );
    // .. create and save DBs
    db_exporter();
    // .. clean the tmpFolder
    SCT.janitor( tmpFolder );
    // .. N-PAD report
    return n_pad -1;
}

// .. ======================================================================

export async function init ( mode: "Scratch"|"Cached" ) {

    tools.notify( "     " + name + "   " );

    let db: TS.db = [];

    // .. get v0 [ Scratch | Cached ]
    db = load_db_v0( mode );
    // .. main dividers
    db = a_0_9( db );

    // .. write-down DB
    storage.saveData( db, tmpFolder, "01" );

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

        let textBook: string,
            book_v0: string[][],
            book_v1: string[][],
            set_v1: string[][] = [],
            set_v2: string[] = [];

        // .. convert all sourceText => set v1
        for ( let i=1; i<=15; i ++ ) {
            textBook = readSrcBook(i);
            textBook = SCT.some_edits( textBook );
            book_v0 = getBook_v0( textBook );
            book_v1 = getBook_v1( book_v0 );
            set_v1 = [ ...set_v1, ...book_v1 ];
        }

        // .. notify up to this step
        tools.notify( " Books Loaded!" );

        // .. convert set v1 to v2 [ string[][]=>string[] ]
        for ( let i in set_v1 ) set_v2 = [ ...set_v2, ...set_v1[i] ];
        // .. get hadith prepared for extraction id from sourceText
        for ( let i in set_v2 ) set_v2[i] = SCT.set_trimmer ( set_v2[i] );
        // .. trim set v2
        set_v2 = set_v2.filter( x => x );
        // .. get hadith from sourceText and [ assign d & j ]
        db_v0 = hadith_db_generator( set_v2 );

        // .. save it in storage
        storage.saveData( db_v0, tmpFolder, "00" );

    }

    return db_v0;

}

// .. ======================================================================

function readSrcBook ( num: number ): string {

    tools.notify( "  book num: " + num + ( num > 9 ? "" : " ") );

    let filePath = "src/db/source/" + name + "/" + num + ".htm";
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

        [ hr, page ] = SCT.hrCtr( page, HR );

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

function a_0_9 ( db: TS.db ) {

    let lines: string[],
        firstLineIndex: number,
        a_ID: number,
        z_ID: number,
        cdnBOX = [
            121,350,492,649,652,653,777,859,907,999,1307,1316,1367,1876,2314,
            2867,2965,4749,5258,6729,8154,11802,11836,13481,14620,14927,15195,
        ];

    for( let p of db ) {

        lines = p.a.split("^").filter( x => x && x !== " " );
        firstLineIndex = lines.findIndex( x => x.includes( ":" ) );

        // .. Skip Mode!
        if ( cdnBOX.includes( p.d as number ) ) {
            let patchFilePath = "src/db/source/" + name + "/patches.json";
            let patches = JSON.parse( fs.readFileSync( patchFilePath, 'utf8' ) );
            p = patches.find( x => x.d === p.d );
            if ( !p ) console.log( "Unexpected ID from Patches: ", p.d );
        }

        // .. Purge Mode!
        else if ( !~firstLineIndex ) { p[0] = p.a; p.a = null; }

        // .. Actual Mode
        else  {

            // .. prepare
            p[0] = lines.slice( 0, firstLineIndex +1 ).join( " " );
            p.a = lines.slice( firstLineIndex +1 ).join( " " );
            // .. patch
            if ( p.a === "" ) { p.a = p[0]; delete p[0] }

            // .. actual step
            p = a_0(p);
            // .. trim
            a_ID = p.a.indexOf( "«" );
            if ( ~a_ID && a_ID < 2 ) p = SCT.append_0( p, a_ID +1 );
            a_ID = p.a.indexOf( "«" );
            z_ID = p.a.indexOf( "»" );
            // .. in case of : «---»
            if ( !~a_ID && ~z_ID )
                if ( z_ID > p.a.length - 4 )
                    p = SCT.append_9( p, z_ID );

            p.a = p.a.replace( / ‌/g, " " ).replace( / +/g, " " ).trim();

        }


    }

    return db;

}

// .. ======================================================================

function a_0 ( item: TS.db_item ) {

    let cut_ID: number = -1,
        cdnBOX: { text: string, c: number, excludesText: boolean }[];

    cdnBOX = [

        // .. includesText
        { text: "قُلْتُ لِأَبِي الْحَسَنِ عليه‌السلام :", c:7, excludesText: false },
        { text: "قُلْتُ لِأَبِي عَبْدِ اللهِ عليه‌السلام :", c:6, excludesText: false },
        { text: "قُلْتُ لِأَبِي جَعْفَرٍ عليه‌السلام :", c:5, excludesText: false },
        { text: "سَأَلْتُ أَبَا جَعْفَرٍ عليه‌السلام", c:5, excludesText: false },
        { text: "سُئِلَ أَبُو عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: false },
        { text: "كُنَّا عِنْدَ الرِّضَا عليه‌السلام ،", c:8, excludesText: false },
        { text: "قَالَ ابْنُ السِّكِّيتِ لِأَبِي الْحَسَنِ عليه‌السلام :", c:7, excludesText: false },
        { text: "سُئِلَ أَبُو الْحَسَنِ عليه‌السلام :", c:7, excludesText: false },
        { text: "سَمِعْتُ أَبَا جَعْفَرٍ عليه‌السلام يَقُولُ :", c:5, excludesText: false },
        { text: "سَمِعْتُ أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام", c:1, excludesText: false },
        { text: "قُلْتُ لِأَبِي الْحَسَنِ مُوسى عليه‌السلام :", c:7, excludesText: false },
        { text: "قُلْتُ لِأَبِي الْحَسَنِ الْأَوَّلِ عليه‌السلام :", c:1, excludesText: false },
        { text: "سَأَلْتُ أَبَا الْحَسَنِ مُوسى عليه‌السلام", c:7, excludesText: false },
        { text: "سَأَلْتُ أَبَا عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: false },
        { text: "سَأَلَ رَجُلٌ أَبَا عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: false },
        { text: "عَنْ أَبِي الْحَسَنِ مُوسى عليه‌السلام ، قَالَ", c:7, excludesText: false },
        { text: "قُلْتُ لِأَمِيرِ الْمُؤْمِنِينَ عليه‌السلام :", c:1, excludesText: false },
        { text: "سَأَلْتُ أَبَا الْحَسَنِ عليه‌السلام :", c:7, excludesText: false },
        { text: "سَأَلْتُ أَبَا الْحَسَنِ الرِّضَا عليه‌السلام", c:7, excludesText: false },
        { text: "كَتَبْتُ إِلى أَبِي الْحَسَنِ عليه‌السلام", c:7, excludesText: false },
        { text: "سَأَلْتُ أَبَا الْحَسَنِ الرِّضَا عليه‌السلام :", c:8, excludesText: false },
        { text: "قُلْتُ لِأَبِي عَبْدِ اللهِ أَوْ لِأَبِي جَعْفَرٍ عليهما‌السلام :", c:5, excludesText: false },
        { text: "سأل رجل أبا جعفر عليه‌السلام", c:5, excludesText: false },
        { text: "كنت عند أبي عبد الله عليه‌السلام", c:6, excludesText: false },
        { text: "كان علي بن الحسين عليهما‌السلام", c:4, excludesText: false },
        { text: "قلت لأبي عبد الله عليه‌السلام :", c:6, excludesText: false },
        { text: "دخلت على أبي الحسن الرضا عليه‌السلام", c:8, excludesText: false },
        { text: "سألت علي بن الحسين عليهما‌السلام :", c:4, excludesText: false },
        { text: "عن أبي عبد الله عليه‌السلام أنه سئل :", c:6, excludesText: false },
        { text: "سَأَلْتُ الرِّضَا عليه‌السلام", c:8, excludesText: false },
        { text: "مَرَرْتُ مَعَ أَبِي جَعْفَرٍ عليه‌السلام", c:5, excludesText: false },
        { text: "كَتَبْتُ إِلى أَبِي جَعْفَرٍ عليه‌السلام :", c:5, excludesText: false },
        { text: "سَأَلْتُهُ عَنْ قَوْلِ اللهِ عزوجل :", c:-1, excludesText: false },
        { text: "كُنْتُ عِنْدَ أَبِي جَعْفَرٍ عليه‌السلام", c:5, excludesText: false },
        { text: "رَأَيْتُ أَبَا الْحَسَنِ عليه‌السلام", c:7, excludesText: false },
        { text: "سَمِعْتُ أَبَا الْحَسَنِ مُوسى عليه‌السلام", c:7, excludesText: false },
        { text: "سَأَلْتُ أَبَا الْحَسَنِ عليه‌السلام", c:7, excludesText: false },
        { text: "قُلْنَا لِأَبِي عَبْدِ اللهِ عليه‌السلام :", c:6, excludesText: false },
        { text: "رَأَيْتُ أَبَا جَعْفَرٍ عليه‌السلام", c:5, excludesText: false },
        { text: "سَأَلْتُ أَبَا عَبْدِ اللهِ وَأَبَا الْحَسَنِ عليهما‌السلام", c:6, excludesText: false },
        { text: "سَأَلَ زُرَارَةُ أَبَا عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: false },
        { text: "سَأَلْتُ أَبَا إِبْرَاهِيمَ عليه‌السلام", c:7, excludesText: false },
        { text: "دَخَلْتُ عَلى أَبِي الْحَسَنِ عليه‌السلام ،", c:7, excludesText: false },
        { text: "كَتَبْتُ إِلى أَبِي مُحَمَّدٍ عليه‌السلام", c:11, excludesText: false },
        { text: "كَانَ لِأَبِي مُحَمَّدٍ عليه‌السلام", c:11, excludesText: false },
        { text: "دَخَلْتُ عَلى أَبِي مُحَمَّدٍ عليه‌السلام", c:11, excludesText: false },
        { text: "أَنَّ أَبَا مُحَمَّدٍ عليه‌السلام", c:11, excludesText: false },
        { text: "خَرَجَ عَنْ أَبِي مُحَمَّدٍ عليه‌السلام", c:11, excludesText: false },
        { text: "سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ فِي الْإِيلَاءِ :", c:6, excludesText: false },
        { text: "عَنْ أَبِي جَعْفَرٍ عليه‌السلام فِي الْأَمَةِ :", c:5, excludesText: false },
        { text: "رَأَيْتُ أَبَا عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: false },
        { text: "كَانَ أَبُو الْحَسَنِ عليه‌السلام", c:7, excludesText: false },
        { text: "قُلْتُ لِأَبِي الْحَسَنِ الرِّضَا عليه‌السلام :", c:8, excludesText: false },
        { text: "قُلْتُ لِأَبِي جَعْفَرٍ الثَّانِي عليه‌السلام :", c:9, excludesText: false },
        { text: "سُئِلَ أَبُو جَعْفَرٍ عليه‌السلام :", c:6, excludesText: false },
        { text: "سُئِلَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام :", c:1, excludesText: false },
        { text: "أَنَّهُ سَأَلَ أَبَا عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: true },
        { text: "كَتَبْتُ إِلى أَبِي الْحَسَنِ الرِّضَا عليه‌السلام", c:8, excludesText: false },
        { text: "كَتَبْتُ إِلى أَبِي الْحَسَنِ الثَّالِثِ عليه‌السلام", c:10, excludesText: false },
        { text: "دَخَلْنَا عَلى أَبِي الْحَسَنِ عَلِىِّ بْنِ مُوسىَ الرِّضَا عليه‌السلام", c:8, excludesText: false },
        { text: "قُلْتُ لِأَبِي الْحَسَنِ مُوسَى بْنِ جَعْفَرٍ عليهما‌السلام :", c:5, excludesText: false },
        { text: "وَصَفْتُ لِأَبِي الْحَسَنِ عليه‌السلام", c:7, excludesText: false },
        { text: "أَنَّهُ كَتَبَ إِلى أَبِي الْحَسَنِ عليه‌السلام", c:7, excludesText: false },
        { text: "سَأَلَ رَجُلٌ فَارِسِيٌّ أَبَا الْحَسَنِ عليه‌السلام ، فَقَالَ :", c:7, excludesText: false },
        { text: "سُئِلَ أَبُو جَعْفَرٍ الثَّانِي عليه‌السلام :", c:10, excludesText: false },
        { text: "كَتَبْتُ إِلى أَبِي جَعْفَرٍ عليه‌السلام ، أَوْ قُلْتُ لَهُ :", c:5, excludesText: false },
        { text: "سَأَلْتُ أَبَا جَعْفَرٍ الثَّانِيَ عليه‌السلام :", c:10, excludesText: false },
        { text: "قُلْتُ لِلرِّضَا عليه‌السلام :", c:8, excludesText: false },
        { text: "أَنَّهُ كَتَبَ إِلَيْهِ الرِّضَا عليه‌السلام :", c:8, excludesText: false },
        { text: "", c:null, excludesText: false },
        { text: "", c:null, excludesText: false },
        { text: "", c:null, excludesText: false },
        { text: "", c:null, excludesText: false },
        { text: "", c:null, excludesText: false },

        // ! important
        { text: "قَالَ :", c:null, excludesText: false },

        // .. excludesText
        { text: "", c:null, excludesText: true },
        { text: "", c:null, excludesText: true },
        { text: "", c:null, excludesText: true },
        { text: "قُلْتُ لِأَبِي إِبْرَاهِيمَ عليه‌السلام :", c:7, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ عليه‌السلام أَنَّهُ قَالَ :", c:8, excludesText: true },
        { text: "فَقَالَ أَبُو جَعْفَرٍ :", c:5, excludesText: true },
        { text: "حَدَّثَنِي مُوسَى بْنُ جَعْفَرٍ عليهما‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ الرِّضَا عليه‌السلام فِي قَوْلِ اللهِ عزوجل :", c:8, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ وَأَبِي عَبْدِ اللهِ عليهما‌السلام ، قَالَ :", c:5, excludesText: true },
        { text: "أَنَّهُ سَمِعَ أَبَا جَعْفَرٍ وَأَبَا عَبْدِ اللهِ عليهما‌السلام يَقُولَانِ :", c:5, excludesText: true },
        { text: "سَمِعْتُ أَبَا جَعْفَرٍ وَأَبَا عَبْدِ اللهِ عليهما‌السلام يَقُولَانِ :", c:5, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ الْأَوَّلِ مُوسى عليه‌السلام ، قَالَ : قَالَ :", c:7, excludesText: true },
        { text: "أَنَّ أَبَا الْحَسَنِ الرِّضَا عليه‌السلام قَالَ لَهُ :", c:8, excludesText: true },
        { text: "حَدَّثَنِي أَخِي ، عَنْ جَعْفَرٍ ، عَنْ أَبِيهِ :", c:6, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ الثَّانِي عليه‌السلام ، قَالَ عليه‌السلام :", c:10, excludesText: true },
        { text: "دَخَلْتُ عَلى أَبِي عَبْدِ اللهِ عليه‌السلام ، فَقَالَ :", c:6, excludesText: true },
        { text: "سَأَلَ أَبَا عَبْدِ اللهِ عليه‌السلام بَعْضُ أَصْحَابِنَا عَنِ الْجَفْرِ ، فَقَالَ :", c:6, excludesText: true },
        { text: "دَخَلْتُ عَلى أَبِي عَبْدِ اللهِ عليه‌السلام ،", c:6, excludesText: true },
        { text: "كُنْتُ عِنْدَ أَبِي عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ صَاحِبِ الْعَسْكَرِ عليه‌السلام ، قَالَ", c:11, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ صَاحِبِ الْعَسْكَرِ عليه‌السلام ، قَالَ : سَمِعْتُهُ يَقُولُ :", c:11, excludesText: true },
        { text: "كُنْتُ عِنْدَ أَبِي عَبْدِ اللهِ عليه‌السلام وَعِنْدَهُ أَبُو بَصِيرٍ ، فَقَالَ أَبُو عَبْدِ اللهِ عليه‌السلام :", c:6, excludesText: true },
        { text: "عَنْ جَعْفَرِ بْنِ مُحَمَّدٍ ، عَنْ أَبِيهِ عليهما‌السلام ، قَالَ :", c:5, excludesText: true },
        { text: "كُنْتُ عِنْدَ أَبِي عَبْدِ اللهِ عليه‌السلام ، فَسَأَلَهُ رَجُلٌ عَنْ قَوْلِ اللهِ عزوجل :", c:6, excludesText: true },
        { text: "كُنْتُ عِنْدَ أَبِي عَبْدِ اللهِ عليه‌السلام ،", c:6, excludesText: true },
        { text: "تَلَا أَبُو عَبْدِ اللهِ عليه‌السلام هذِهِ الْآيَةَ :", c:6, excludesText: true },
        { text: "قَالَ أَبُو جَعْفَرٍ عليه‌السلام فِي هذِهِ الْآيَةِ :", c:5, excludesText: true },
        { text: "عَنْ أَحَدِهِمَا عليهما‌السلام فِي قَوْلِ اللهِ عزوجل :", c:5, excludesText: true },
        { text: "سَأَلَ الْهَيْثَمُ أَبَا عَبْدِ اللهِ عليه‌السلام - وَأَنَا عِنْدَهُ - عَنْ قَوْلِ اللهِ عزوجل :", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ عليه‌السلام فِي قَوْلِ اللهِ عزوجل :", c:8, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام فِي قَوْلِ اللهِ تَعَالى :", c:6, excludesText: true },
        { text: "عَنْ أَمِيرِ الْمُؤْمِنِينَ عليه‌السلام ، قَالَ :", c:1, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام فِي قَوْلِ اللهِ عزوجل :", c:6, excludesText: true },
        { text: "أَشْهَدُ أَنِّي سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ :", c:6, excludesText: true },
        { text: "قَالَ لِي أَبُو جَعْفَرٍ عليه‌السلام : «", c:5, excludesText: true },
        { text: "أَنَّ أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام قَالَ :", c:1, excludesText: true },
        { text: "عَنِ الْعَبْدِ الصَّالِحِ عليه‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "قَالَ لِي أَبُو الْحَسَنِ الرِّضَا عليه‌السلام :", c:8, excludesText: true },
        { text: "قَالَ أَبُو الْحَسَنِ الرِّضَا عليه‌السلام :", c:8, excludesText: true },
        { text: "سَمِعْتُ أَبَا الْحَسَنِ مُوسَى بْنَ جَعْفَرٍ عليهما‌السلام يَقُولُ :", c:7, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ مُوسَى بْنِ جَعْفَرٍ عليهما‌السلام", c:7, excludesText: true },
        { text: "عَنْ أَبِي إِبْرَاهِيمَ عليه‌السلام أَنَّهُ قَالَ :", c:7, excludesText: true },
        { text: "ذَكَرْتُ لِأَبِي عَبْدِ اللهِ عليه‌السلام قَوْلَنَا فِي الْأَوْصِيَاءِ :", c:6, excludesText: true },
        { text: "حَمَّادُ بْنُ عُثْمَانَ ، عَنْ بَشِيرٍ الْعَطَّارِ ، قَالَ :  سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ :", c:6, excludesText: true },
        { text: "سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ عليه‌السلام", c:5, excludesText: true },
        { text: "كَتَبَ أَبُو الْحَسَنِ مُوسَى بْنُ جَعْفَرٍ عليهما‌السلام إِلى أَبِي :", c:5, excludesText: true },
        { text: "قَالَ لِي عَلِيُّ بْنُ الْحُسَيْنِ عليهما‌السلام :", c:4, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ ، عَنْ آبَائِهِ عليهم‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "عَنْ جَعْفَرٍ ، عَنْ آبَائِهِ ، عَنْ أَمِيرِ الْمُؤْمِنِينَ عليهم‌السلام ، قَالَ :", c:1, excludesText: true },
        { text: "قَالَ لِي أَبُو الْحَسَنِ عليه‌السلام :", c:7, excludesText: true },
        { text: "أَنَّ أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام قَالَ فِي بَعْضِ خُطَبِهِ :", c:1, excludesText: true },
        { text: "رَفَعَهُ إِلى أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "كَانَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام يَقُولُ :", c:1, excludesText: true },
        { text: "قَالَ لُقْمَانُ لِابْنِهِ :", c:321, excludesText: true },
        { text: "سَمِعْتُ أَبَا الْحَسَنِ مُوسَى بْنَ جَعْفَرٍ عليه‌السلام يَقُولُ :", c:7, excludesText: true },
        { text: "قَالَ عِيسَى بْنُ مَرْيَمَ عليه‌السلام :", c:963, excludesText: true },
        { text: "عَنْ عَلِيِّ بْنِ الْحُسَيْنِ عليهما‌السلام ، قَالَ :", c:4, excludesText: true },
        { text: "قَالَ أَمِيرُ المـُؤْمِنِينَ عليه‌السلام :", c:1, excludesText: true },
        { text: "رَفَعَهُ إِلَى أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "قَالَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام :", c:1, excludesText: true },
        { text: "قَالَ أَبُو الْحَسَنِ الْمَاضِي عليه‌السلام :", c:7, excludesText: true },
        { text: "قَالَ لَنَا أَبُو الْحَسَنِ عليه‌السلام :", c:7, excludesText: true },
        { text: "عَنْ أَخِيهِ مُوسى عليه‌السلام :", c:7, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام لِزُرَارَةَ وَمُحَمَّدِ بْنِ مُسْلِمٍ :", c:6, excludesText: true },
        { text: "سَمِعْتُ أَبَا الْحَسَنِ الرِّضَا عليه‌السلام يَقُولُ :", c:8, excludesText: true },
        { text: "سَمِعْتُ سَلْمَانَ يَقُولُ :", c:789, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ وَأَبِي عَبْدِ اللهِ عليهما‌السلام :", c:5, excludesText: true },
        { text: "عَنْ عَلِيِّ بْنِ الْحُسَيْنِ عليهما‌السلام :", c:4, excludesText: true },
        { text: "سَمِعْتُ أَبَا إِبْرَاهِيمَ عليه‌السلام يَقُولُ :", c:7, excludesText: true },
        { text: "سَمِعْتُ أَبَا الْحَسَنِ عليه‌السلام يَقُولُ :", c:7, excludesText: true },
        { text: "إِنَّ أَبَا الْحَسَنِ عليه‌السلام كَتَبَ إِلَيْهِ :", c:7, excludesText: true },
        { text: "عَنْ أَخِيهِ أَبِي الْحَسَنِ مُوسى ، عَنْ أَبِيهِ ، عَنْ جَدِّهِ عليهما‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليهما‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "عَنْ أَبِي إِبْرَاهِيمَ عليه‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "قَالَ أَبُو الْحَسَنِ عليه‌السلام :", c:7, excludesText: true },
        { text: "عَنْ أَخِيهِ أَبِي الْحَسَنِ عليه‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ عليه‌السلام : أَنَّهُ قَالَ :", c:5, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ وَأَبِي عَبْدِ اللهِ عليهما‌السلام : أَنَّهُمَا كَانَا يَقُولَانِ :", c:5, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ وَأَبِي عَبْدِ اللهِ عليهما‌السلام أَنَّهُمَا قَالَا :", c:5, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ الله عليه‌السلام :", c:6, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ عليه‌السلام فِي قَوْلِ اللهِ عزوجل :", c:5, excludesText: true },
        { text: "عَنْ‌أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ عليه‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "عَنْ أَحَدِهِمَا عليهما‌السلام ، قَالَ :", c:5, excludesText: true },
        { text: "سمعت أبا الحسن عليه‌السلام يقول في قول الله تبارك وتعالى :", c:7, excludesText: true },
        { text: "سمعت أبا الحسن عليه‌السلام يقول :", c:7, excludesText: true },
        { text: "عن أبي عبد الله عليه‌السلام في قول الله عزوجل :", c:6, excludesText: true },
        { text: "عن أبي جعفر عليه‌السلام في قول الله تبارك وتعالى :", c:5, excludesText: true },
        { text: "سألت أبا جعفر عليه‌السلام عن قول الله عزوجل :", c:5, excludesText: true },
        { text: "سمعت سلمان الفارسي ـ رضي‌الله‌عنه ـ يقول :", c:789, excludesText: true },
        { text: "عن أحدهما عليهما‌السلام ، قال :", c:5, excludesText: true },
        { text: "قال لي أبو عبد الله عليه‌السلام :", c:6, excludesText: true },
        { text: "عن أبي عبد الله عليه‌السلام في قول الله تبارك وتعالى :", c:6, excludesText: true },
        { text: "سمعت أبا عبد الله عليه‌السلام ، يقول :", c:6, excludesText: true },
        { text: "سمعت أبا عبد الله عليه‌السلام يقول :", c:6, excludesText: true },
        { text: "قال أبو عبد الله عليه‌السلام :", c:6, excludesText: true },
        { text: "عن الرضا عليه‌السلام :", c:8, excludesText: true },
        { text: "سمعت أبا عبد الله عليه‌السلام يقول في هذه الآية :", c:6, excludesText: true },
        { text: "سئل أبو عبد الله عليه‌السلام عن قول الله عزوجل :", c:6, excludesText: true },
        { text: "عن أبي جعفر عليه‌السلام في قول الله عزوجل :", c:5, excludesText: true },
        { text: "قال لي أبو جعفر محمد بن علي عليهما‌السلام :", c:5, excludesText: true },
        { text: "يرفعونه إلى أبي عبد الله عليه‌السلام ، قال :", c:6, excludesText: true },
        { text: "بإسناده رفعه إلى أبي عبد الله عليه‌السلام ، قال :", c:6, excludesText: true },
        { text: "عن أبي عبد الله عليه‌السلام ، قال :", c:6, excludesText: true },
        { text: "خطب أمير المؤمنين عليه‌السلام ـ ورواها غيره بغير هذا الإسناد ، وذكر أنه خطب بذي قار ـ فحمد الله وأثنى عليه ، ثم قال :", c:1, excludesText: true },
        { text: "عن علي بن الحسين عليهما‌السلام أنه كان يقول :", c:4, excludesText: true },
        { text: "عن أبي عبد الله عليه‌السلام مثله إلا أنه قال في حديثه :", c:6, excludesText: true },
        { text: "عن أبي جعفر عليه‌السلام :", c:5, excludesText: true },
        { text: "عن أبي جعفر عليه‌السلام ، قال :", c:5, excludesText: true },
        { text: "قال أبو عبد الله عليه‌السلام  لرجل :", c:6, excludesText: true },
        { text: "قال أبو جعفر عليه‌السلام ،", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ الرِّضَا عليه‌السلام :", c:8, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام لِي وَلِسُلَيْمَانَ بْنِ خَالِدٍ :", c:6, excludesText: true },
        { text: "سَمِعْتُ أَبَا جَعْفَرٍ عليه‌السلام", c:5, excludesText: true },
        { text: "قَالَ عَلِيُّ بْنُ الْحُسَيْنِ عليهما‌السلام :", c:4, excludesText: true },
        { text: "قَالَ أَبُو جَعْفَرٍ عليه‌السلام :", c:5, excludesText: true },
        { text: "حَدَّثَنِي جَعْفَرٌ ، عَنْ أَبِيهِ عليهما‌السلام :", c:6, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ وَأَبِي عَبْدِ اللهِ عليهما‌السلام ، قَالَا :", c:5, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ عليه‌السلام ، قَالَ :", c: 5, excludesText: true },
        { text: "سَمِعْتُ الرِّضَا عليه‌السلام يَقُولُ :", c:8, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام :", c:6, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "قَالَ رَسُولُ اللهِ صلى‌الله‌عليه‌وآله‌وسلم :", c:13, excludesText: true },
        { text: "قَالَ لِي أَبُو الْحَسَنِ مُوسَى بْنُ جَعْفَرٍ عليه‌السلام :", c:7, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "عَنِ الرِّضَا عليه‌السلام ، قَالَ :", c:8, excludesText: true },
        { text: "سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ :", c:6, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: true },
        { text: "عَنْ عَلِيٍّ عليه‌السلام ، قَالَ :", c:1, excludesText: true },
        { text: "عَنْ جَعْفَرٍ ، عَنْ أَبِيهِ عليهما‌السلام ، قَالَ :", c:5, excludesText: true },
        { text: "قال أَبُو عَبدِ اللهِ عليه‌السلام :", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ الرِّضَا عليه‌السلام ، قَالَ :", c:8, excludesText: true },
        { text: "سَمِعْنَا أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ :", c:6, excludesText: true },
        { text: "سَمِعْتُ أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام يَقُولُ :", c:1, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ مُوسَى بْنِ جَعْفَرٍ عليه‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "قَالَ لِي أَبُو عَبْدِ اللهِ عليه‌السلام :", c:6, excludesText: true },
        { text: "قَالَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام فِي كَلَامٍ لَهُ خَطَبَ بِهِ عَلَى الْمِنْبَرِ :", c:1, excludesText: true },
        { text: "سَمِعْتُ أَبَا جَعْفَرٍ عليه‌السلام يَقُولُ :", c:5, excludesText: true },
        { text: "عَنْ أَمِيرِ الْمُؤْمِنِينَ عليه‌السلام أَنَّهُ قَالَ :", c:1, excludesText: true },

    ];

    // .. cut BeginningOfHadith "STRICK"
    for ( let p of cdnBOX ) {
        if ( p.c !== null ) {
            cut_ID = item.a.indexOf( p.text );
            if ( ~cut_ID ) {
                if ( cut_ID < 3 ) {
                    if ( p.excludesText ) cut_ID += p.text.length;
                    item = SCT.append_0 ( item, cut_ID );
                    item.c = p.c;
                    break;
                }
            }
        }
    }

    return item;

}

// .. ======================================================================

export function db_exporter () {

    db_v1 = tools.relation_definer( tmpFolder, db_v1 );

    // .. last trims
    for ( let p of db_v1 ) {
        try { p[0] = p[0].replace( / +/g, " " ).trim() } catch {}
        try { p[9] = p[9].replace( / +/g, " " ).trim() } catch {}
        try { p.a = p.a.replace( / +/g, " " ).trim() } catch {}
    }

    // .. D Publisher
    for ( let p of db_v1 ) 
        p.d = basic_tools.arabicDigits( name + "، الحديث: " + p.d );

    storage.saveData( db_v1, "src/db/ready", name );

}

// .. ======================================================================

export function resource_update () {
    try { fs.mkdirSync( tmpFolder ) } catch {}
    try { db_v1 = JSON.parse( fs.readFileSync( db_v1_Path, 'utf8' ) ) } catch {}
    try { db    = JSON.parse( fs.readFileSync( db_Path   , 'utf8' ) ) } catch {}
    try { R     = JSON.parse( fs.readFileSync( R_Path    , 'utf8' ) ) } catch {}
    try { R__   = tools.R_optimizer ( R, 67 )                         } catch {}
}

// .. ======================================================================

