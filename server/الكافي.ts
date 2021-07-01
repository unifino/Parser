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

export let name         = "الكافي";
export let db           : TS.db;
export let R            : TS.R[];

let tmpFolder           = "tmp/" + name + "/";
let db_Path             = "db/" + name + ".json";
let v1_Path             = tmpFolder + "/" + name + "-01.json";
let R_Path              = tmpFolder + "/" + name + "-R.json";
let v1                  : TS.db;

resource_update ();

// .. ====================================================================

export async function ignite ( mode: "Scratch"|"Cached", n_pad: number ) {

    // .. init server
    report.notify( name );
    // .. init DB
    db = [];
    // .. get v0 [ Scratch | Cached ]
    db = load_db_v0( mode );
    // .. divider
    db = mine ( db );
    // // .. main dividers
    // db = a_0_9( db );
    // // .. write-down DB
    // storage.saveData( db, tmpFolder, name + "-01" );
    // // .. update resources
    // resource_update ();
    // // .. N allocation
    // n_pad = tools.n_allocation( v1, n_pad );
    // // .. R allocation
    // R = await dedicated_R();
    // // .. search for optimizing
    // __.cook( R, v1, tmpFolder );
    // // .. check optimized info
    // await tools._db_check_( tmpFolder, v1 );
    // // .. create and save DBs
    // db_exporter();
    // // .. clean the tmpFolder
    // __.janitor( tmpFolder );
    // // .. N-PAD report
    // return n_pad -1;

}

// .. ====================================================================

function mine ( db: TS.db ) {

    return db;
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
        let tmp_db = [];

        // .. merge Books as Source
        for ( let i=1; i<=1; i ++ ) {
            textBook = readSrcBook(i);
            // ..  do some edits
            textBook = __.some_edits( textBook );
            // .. remove unwanted parted => neat
            let neatBook = getNeatBook( textBook );
            // .. build first db => rawDB
            let raw_db = getRawDB( neatBook );
            // .. provide a preview for checking
            preview( raw_db );
            // .. build main db
            tmp_db = hadith_db_generator( raw_db );
            // .. scatter 0-a-9
            tmp_db = a_0_9( tmp_db );
            // .. assign c code
            tmp_db = c_allocator( tmp_db );
            // .. sum up Books
            db_v0 = [ ...db_v0, ...tmp_db ];
        }
        // .. notify up to this step
        report.notify( "Books Loaded!" );
        console.log( db_v0.length );

        // .. save it
        storage.saveData( db_v0, tmpFolder, name + "-00" );

    }

    return db_v0;

}

// .. ====================================================================

function readSrcBook ( num: number ): string {

    report.notify( "book " + num + "/" + 15 );

    let filePath = "source/" + name + "/" + num + ".htm";
    // .. check
    fs.accessSync( filePath, fs.constants.R_OK );
    // .. get source
    let txt = fs.readFileSync( filePath , 'utf8' );

    // .. cut beginning and end of the book
    let a = txt.indexOf( "<a name='aaa'></a>" );
    let b = txt.indexOf( "<a name='xxx'></a>" );

    if ( a>0 && b>0 ) return txt.slice( a, b +19 );
    else console.log( "err-01",a , b )

}

// .. ====================================================================

function removeAlaemTags ( text: string ) {

    text = text.replace( /libNormal0/g, "libNormal" );
    // text = text.replace( / ?class="libNormal" ?/g, "" );
    text = text.replace( /<p class="libNormal"><\/p>/g, "" );
    text = text.replace( /<p><\/p>/g, "" );
    text = text.replace( /<br clear="all">/g, "" );

    text = text.replace( /<span class="libAlaem"> ?عزوجل ?<\/span>/g, " عزوجل " );
    text = text.replace( /<span class="libAlaem"> ?رحمه‌الله ?<\/span>/g, " رحمه‌الله " );
    text = text.replace( /<span class="libAlaem"> ?رحمهم‌الله ?<\/span>/g, " رحمهم‌الله " );
    text = text.replace( /<span class="libAlaem"> ?عليه‌السلام ?<\/span>/g, " عليه‌السلام " );
    text = text.replace( /<span class="libAlaem"> ?عليها‌السلام ?<\/span>/g, " عليها‌السلام " );
    text = text.replace( /<span class="libAlaem"> ?عليهم‌السلام ?<\/span>/g, " عليهم‌السلام " );
    text = text.replace( /<span class="libAlaem"> ?عليه‌السلام\( ?<\/span>/g, " عليه‌السلام " );
    text = text.replace( /<span class="libAlaem"> ?عليهما‌السلام ?<\/span>/g, " عليهما‌السلام " );
    text = text.replace( /<span class="libAlaem"> ?رضي‌الله‌عنه ?<\/span>/g, " رضي‌الله‌عنه " );
    text = text.replace( /<span class="libAlaem"> ?عليها‌السلام\( ?<\/span>/g, " عليها‌السلام " );
    text = text.replace( /<span class="libAlaem"> ?صلى‌الله‌عليه‌وآله ?<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class="libAlaem"> ?صلى‌الله‌عليه‌وآله‌ ?<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class="libAlaem"> ?صلى‌الله‌عليه‌وآله\( ?<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class="libAlaem"> ?صلى‌الله‌عليه‌وآله‌وسلم ?<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );

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

    text = text.replace( /<span class="libAlaem">\( ?<\/span>/g, "" );
    text = text.replace( /<span class="libAlaem">\) ?<\/span>/g, "" );

    // .. replace libAie with native Q tag
    let q = ( text.match( /<span class="libAie">(.*?)<\/span>/g ) || [] );
    for ( let c of q ) {
        let r = c;
        r = r.replace( "<span class=\"libAie\">", " |Q| " );
        r = r.replace( "<\/span>", " |/Q| " );
        text = text.replace( c, r );
    }

    text = text.replace( /\n+/g, " " );
    text = text.replace( / +/g, " " );
    text = text.trim();

    return text;

}

// .. ====================================================================

function getNeatBook ( text: string ) {

    let $: cheerio.CheerioAPI = cheerio.load( text );

    $( ".libFootnote0" ).remove();
    $( ".libFootnotenum" ).remove();
    $( ".libFootnoteAlaem" ).remove();
    $( ".libLine" ).remove();
    $( ".Heading1Center" ).remove();
    $( ".Heading2Center" ).remove();
    $( ".libCenter" ).remove();
    $( ".libBold1" ).remove();
    $( "table" ).remove();
    $( "a" ).remove();

    // .. reset var
    text = "";
    for( let p of $("p") ) text += $(p);

    text = removeAlaemTags( text );
    text = basic_tools.latinDigits( text );

    return text;

}

// .. ====================================================================

function getRawDB ( text: string ) {

    let db: string[] = [];

    // .. build DB: based on <P>
    for ( let p of text.split( "</p>" ) ) {
        // .. remove number span tags
        let match = p.match( /<span class="libBold2">(.*?)<\/span>/ ) || [];
        let rgx = new RegExp( match[0], "g" );
        if ( match.length ) p = p.replace( rgx, match[1] );
        // .. register in DB
        db.push(p);
    }

    return db;

}

// .. ====================================================================

function preview ( db: string[] ) {

    let header = "<!DOCTYPE html><html><head>"+
        '<link rel="stylesheet" type="text/css" href="main.css" />'+
        "</head><body>";

    fs.writeFileSync( 
        "tmp/preview.html", 
        header + 
        db.join( "</p>" )
            .replace( /<p/g, "\n<p" ) 
            .replace( /\|Q\|/g, "<Q>" ) 
            .replace( /\|\/Q\|/g, "</Q>" ) 
    );

}

// .. ====================================================================

function hadith_db_generator ( raw_db: string[] ) {

    let db: TS.db = [],
        hadith: TS.db_item = { w: [] } as any;

    for ( let p of raw_db ) {

        let cdn = p.match( /[0-9]+ ?\/ ?[0-9]+ ?\.? / ) || [];
        // .. append this line
        if ( cdn.length === 0 ) hadith.w.push( cheerio.load(p).text() );
        // .. beginning of a new Hadith
        else if ( cdn.length === 1 ) {
            // .. add to newBook
            db.push( hadith );
            // .. reset the HadithBox
            hadith = { w: [] } as any;
            p = p.slice( cdn.index + cdn[0].length );
            hadith.w.push( cheerio.load(p).text() );
            let dp = cdn[0].split( "/" );
            hadith.d = Number( dp[0] ).toString();
            hadith.idInSection = Number( dp[1].replace(".","").trim() );
        }
        // .. error report
        else console.log( "Unexpected Line:", p );
    }
    // .. add ĺast item
    if ( hadith.w.length ) {
        hadith.a = hadith.w.join( " " );
        db.push( hadith )
    };

    // .. remove first cell
    db.shift();

    // .. return
    return db;

}

// .. ====================================================================

function a_0_9 ( db: TS.db ) {

    let first_ID: number;

    for( let p of db ) {

        first_ID = p.w.findIndex( x => x.endsWith( " : " ) );
        if ( ~first_ID ) p[0] = p.w.splice( 0, first_ID +1 ).join( " " );

    }

    return db;

}

// .. ====================================================================

function c_allocator ( db: TS.db ) {

    for( let p of db ) p = a_0(p);
    return db.filter( x => !x.c );

}

// .. ====================================================================

function a_0 ( item: TS.db_item ) {

    let cut_ID: number = -1,
        cdnBOX: { text: string, c: number, excludesText: boolean }[];

    cdnBOX = [

        // .. includesText
        { text: "أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ : «", c:6, excludesText: false },
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
        { text: "قُلْتُ لِأَمِيرِ الْمُؤْمِنِينَ عليه‌السلام :", c:1, excludesText: false },
        { text: "سَأَلْتُ أَبَا الْحَسَنِ عليه‌السلام :", c:7, excludesText: false },
        { text: "سَأَلْتُ أَبَا الْحَسَنِ الرِّضَا عليه‌السلام", c:7, excludesText: false },
        { text: "كَتَبْتُ إِلى أَبِي الْحَسَنِ عليه‌السلام", c:7, excludesText: false },
        { text: "سَأَلْتُ أَبَا الْحَسَنِ الرِّضَا عليه‌السلام :", c:8, excludesText: false },
        { text: "قُلْتُ لِأَبِي عَبْدِ اللهِ أَوْ لِأَبِي جَعْفَرٍ عليهما‌السلام :", c:5, excludesText: false },
        { text: "سأل رجل أبا جعفر عليه‌السلام", c:5, excludesText: false },
        { text: "كنت عند أبي عبد الله عليه‌السلام", c:6, excludesText: false },
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
        { text: "دَخَلْتُ عَلى أَبِي مُحَمَّدٍ عليه‌السلام", c:11, excludesText: false },
        { text: "سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ فِي الْإِيلَاءِ :", c:6, excludesText: false },
        { text: "رَأَيْتُ أَبَا عَبْدِ اللهِ عليه‌السلام", c:6, excludesText: false },
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
        { text: "قُلْتُ لِأَبِي إِبْرَاهِيمَ عليه‌السلام :", c:7, excludesText: false },
        { text: "", c:null, excludesText: false },
        { text: "", c:null, excludesText: false },
        { text: "", c:null, excludesText: false },
        { text: "", c:null, excludesText: false },
        { text: "", c:null, excludesText: false },

        // ! important
        // { text: "قَالَ :", c:null, excludesText: false },

        // .. excludesText
        { text: "", c:null, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ : «", c:6, excludesText: true },
        { text: "أَبِي جَعْفَرٍ عليه‌السلام ، قَالَ : «", c:5, excludesText: true },
        { text: "قَالَ أَبُو جَعْفَرٍ عليه‌السلام : «", c:5, excludesText: true },
        { text: "عَنْ أَمِيرِ الْمُؤْمِنِينَ عليه‌السلام ، قَالَ : «", c:1, excludesText: true },
        { text: "أَنَّ أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام قَالَ : «", c:1, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، أَنَّهُ قَالَ : «", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ مُوسَى بْنِ جَعْفَرٍ عليهما‌السلام ، قَالَ : «", c:7, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، أَنَّهُ قَالَ : «", c:6, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام : «", c:6, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام : قَالَ : «", c:6, excludesText: true },
        { text: "مِنْ قَوْلِ أَبِي عَبْدِ اللهِ عليه‌السلام : «", c:6, excludesText: true },
        { text: "قَالَ أَبُو جَعْفَرٍ عليه‌السلام : «", c:5, excludesText: true },
        { text: "دَخَلَ أَبُو حَنِيفَةَ عَلى أَبِي عَبْدِ اللهِ عليه‌السلام ، فَقَالَ لَهُ : «", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ مُوسى عليه‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام فِي قَوْلِ اللهِ عزوجل :", c:6, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، عَنْ آبَائِهِ عليهم‌السلام ، قَالَ : «", c:6, excludesText: true },
        { text: "كَانَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام يَقُولُ : «", c:1, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام فِي هذِهِ الْآيَةِ :", c:6, excludesText: true },
        { text: "قَالَ لُقْمَانُ لِابْنِهِ : «", c:123, excludesText: true },
        { text: "قَالَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام : «", c:1, excludesText: true },
        { text: "عَنْ عَلِيِّ بْنِ الْحُسَيْنِ عليهما‌السلام ، قَالَ : «", c:4, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، عَنْ آبَائِهِ عليهم‌السلام ، قَالَ : «", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ مُوسى عليه‌السلام ، قَالَ : «", c:7, excludesText: true },
        { text: "قَالَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام : «", c:1, excludesText: true },
        { text: "قَالَ رَسُولُ اللهِ صلى‌الله‌عليه‌وآله‌وسلم : «", c:13, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام : «", c:6, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام لِحُمْرَانَ بْنِ أَعْيَنَ فِي شَيْ‌ءٍ سَأَلَهُ : «", c:6, excludesText: true },
        { text: "قَالَ أَمِيرُ المُؤْمِنِينَ عليه‌السلام : «", c:1, excludesText: true },
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
        { text: "عَنْ أَبِي الْحَسَنِ صَاحِبِ الْعَسْكَرِ عليه‌السلام ، قَالَ", c:11, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ صَاحِبِ الْعَسْكَرِ عليه‌السلام ، قَالَ : سَمِعْتُهُ يَقُولُ :", c:11, excludesText: true },
        { text: "كُنْتُ عِنْدَ أَبِي عَبْدِ اللهِ عليه‌السلام وَعِنْدَهُ أَبُو بَصِيرٍ ، فَقَالَ أَبُو عَبْدِ اللهِ عليه‌السلام :", c:6, excludesText: true },
        { text: "عَنْ جَعْفَرِ بْنِ مُحَمَّدٍ ، عَنْ أَبِيهِ عليهما‌السلام ، قَالَ :", c:5, excludesText: true },
        { text: "كُنْتُ عِنْدَ أَبِي عَبْدِ اللهِ عليه‌السلام ، فَسَأَلَهُ رَجُلٌ عَنْ قَوْلِ اللهِ عزوجل :", c:6, excludesText: true },
        { text: "تَلَا أَبُو عَبْدِ اللهِ عليه‌السلام هذِهِ الْآيَةَ :", c:6, excludesText: true },
        { text: "قَالَ أَبُو جَعْفَرٍ عليه‌السلام فِي هذِهِ الْآيَةِ :", c:5, excludesText: true },
        { text: "عَنْ أَحَدِهِمَا عليهما‌السلام فِي قَوْلِ اللهِ عزوجل :", c:5, excludesText: true },
        { text: "سَأَلَ الْهَيْثَمُ أَبَا عَبْدِ اللهِ عليه‌السلام - وَأَنَا عِنْدَهُ - عَنْ قَوْلِ اللهِ عزوجل :", c:6, excludesText: true },
        { text: "عَنْ أَبِي الْحَسَنِ عليه‌السلام فِي قَوْلِ اللهِ عزوجل :", c:8, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام فِي قَوْلِ اللهِ تَعَالى :", c:6, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام فِي قَوْلِ اللهِ عزوجل :", c:6, excludesText: true },
        { text: "أَشْهَدُ أَنِّي سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ : « :", c:6, excludesText: true },
        { text: "قَالَ لِي أَبُو جَعْفَرٍ عليه‌السلام : «", c:5, excludesText: true },
        { text: "عَنِ الْعَبْدِ الصَّالِحِ عليه‌السلام ، قَالَ :", c:7, excludesText: true },
        { text: "قَالَ لِي أَبُو الْحَسَنِ الرِّضَا عليه‌السلام :", c:8, excludesText: true },
        { text: "قَالَ أَبُو الْحَسَنِ الرِّضَا عليه‌السلام :", c:8, excludesText: true },
        { text: "سَمِعْتُ أَبَا الْحَسَنِ مُوسَى بْنَ جَعْفَرٍ عليهما‌السلام يَقُولُ :", c:7, excludesText: true },
        { text: "عَنْ أَبِي إِبْرَاهِيمَ عليه‌السلام أَنَّهُ قَالَ :", c:7, excludesText: true },
        { text: "ذَكَرْتُ لِأَبِي عَبْدِ اللهِ عليه‌السلام قَوْلَنَا فِي الْأَوْصِيَاءِ :", c:6, excludesText: true },
        { text: "حَمَّادُ بْنُ عُثْمَانَ ، عَنْ بَشِيرٍ الْعَطَّارِ ، قَالَ :  سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ :", c:6, excludesText: true },
        { text: "كَتَبَ أَبُو الْحَسَنِ مُوسَى بْنُ جَعْفَرٍ عليهما‌السلام إِلى أَبِي :", c:5, excludesText: true },
        { text: "قَالَ لِي عَلِيُّ بْنُ الْحُسَيْنِ عليهما‌السلام :", c:4, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ ، عَنْ آبَائِهِ عليهم‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "عَنْ جَعْفَرٍ ، عَنْ آبَائِهِ ، عَنْ أَمِيرِ الْمُؤْمِنِينَ عليهم‌السلام ، قَالَ :", c:1, excludesText: true },
        { text: "قَالَ لِي أَبُو الْحَسَنِ عليه‌السلام :", c:7, excludesText: true },
        { text: "أَنَّ أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام قَالَ فِي بَعْضِ خُطَبِهِ :", c:1, excludesText: true },
        { text: "رَفَعَهُ إِلى أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "سَمِعْتُ أَبَا الْحَسَنِ مُوسَى بْنَ جَعْفَرٍ عليه‌السلام يَقُولُ :", c:7, excludesText: true },
        { text: "رَفَعَهُ إِلَى أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :", c:6, excludesText: true },
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
        { text: "عن أبي جعفر عليه‌السلام ، قال :", c:5, excludesText: true },
        { text: "قال أبو عبد الله عليه‌السلام  لرجل :", c:6, excludesText: true },
        { text: "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام لِي وَلِسُلَيْمَانَ بْنِ خَالِدٍ :", c:6, excludesText: true },
        { text: "حَدَّثَنِي جَعْفَرٌ ، عَنْ أَبِيهِ عليهما‌السلام :", c:6, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ وَأَبِي عَبْدِ اللهِ عليهما‌السلام ، قَالَا :", c:5, excludesText: true },
        { text: "عَنْ أَبِي جَعْفَرٍ عليه‌السلام ، قَالَ :", c: 5, excludesText: true },
        { text: "سَمِعْتُ الرِّضَا عليه‌السلام يَقُولُ :", c:8, excludesText: true },
        { text: "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :", c:6, excludesText: true },
        { text: "قَالَ لِي أَبُو الْحَسَنِ مُوسَى بْنُ جَعْفَرٍ عليه‌السلام :", c:7, excludesText: true },
        { text: "عَنِ الرِّضَا عليه‌السلام ، قَالَ :", c:8, excludesText: true },
        { text: "سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ :", c:6, excludesText: true },
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
            cut_ID = item.w[0].indexOf( p.text );
            if ( ~cut_ID ) {
                if ( cut_ID < 3 ) {
                    if ( p.excludesText ) cut_ID += p.text.length;
                    item = __.append_0 ( item, cut_ID );
                    item.c = p.c;
                    break;
                }
            }
        }
    }

    // for ( let p of cdnBOX ) {
    //     if ( p.c !== null && !item.c ) {
    //         cut_ID = item.w[0].indexOf( p.text );
    //         if ( ~cut_ID ) {
    //             console.log( item.w[0] );
    //             break;
    //         }
    //     }
    // }

    return item;

}

// .. ====================================================================

async function dedicated_R () {

    // .. return cached
    if ( fs.existsSync( R_Path ) ) {
        R = JSON.parse( fs.readFileSync( R_Path, 'utf8' ) );
        return R;
    }

    function runService(workerData): Promise<TS.R[  ]> {

        return new Promise( (rs, rx) => {
            const worker = new WS.Worker( './tools/R.js', { workerData } );
            worker.on( 'message', rs );
            worker.on( 'error', rx );
            worker.on( 'exit', code => {
            if ( code !== 0 )
                rx( new Error(`Worker stopped with exit code ${code}`) );
            } )
        } );

    }

    // ..  do processes synchronously
    let processes: Promise<TS.R[]>[] = [];
    for ( let i=0; i<tools.frag; i++ ) {
        processes.push( runService( v1 ) );
    }

    // .. init R
    R = [];
    // .. wait for all processes get Done.
    await Promise.all( processes ).then( RS => { 
        for ( let r of RS ) R = [ ...R, ...r ]
    } );

    // R = await __._R_( v1 );

    // .. wait a bit
    await new Promise( _ => setTimeout( _, 700 ) );
    report.cursor( 22, 0 );

    storage.saveData( R, tmpFolder, name + "-R", true );

    return R;

}

// .. ====================================================================

function db_exporter () {

    v1 = tools.relation_definer( tmpFolder, v1 );

    // .. last trims
    for ( let p of v1 ) {
        try { p[0] = p[0].replace( / +/g, " " ).trim() } catch {}
        try { p[9] = p[9].replace( / +/g, " " ).trim() } catch {}
        try { p.a = p.a.replace( / +/g, " " ).trim() } catch {}
    }

    // .. D Publisher
    for ( let p of v1 ) 
        p.d = basic_tools.arabicDigits( name + "، الحديث: " + p.d );

    storage.saveData( v1, "db", name );

}

// .. ====================================================================

function resource_update () {
    try { fs.mkdirSync( tmpFolder ) } catch {}
    try { v1 = JSON.parse( fs.readFileSync( v1_Path, 'utf8' ) ) } catch {}
    try { db = JSON.parse( fs.readFileSync( db_Path, 'utf8' ) ) } catch {}
}

// .. ====================================================================

