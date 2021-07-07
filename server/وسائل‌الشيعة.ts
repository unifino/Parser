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

export let name         = "وسائل‌الشيعة";
export let db           : TS.db;
export let R            : TS.R[];

let tmpFolder           = "tmp/" + name + "/";

resource_update ();

// .. ====================================================================

export async function ignite ( mode: "Scratch"|"Cached", n_pad: number ) {

    // .. init server
    report.notify( name );
    // .. init DB
    db = [];
    // .. get v0
    db = load_db();
    storage.saveData( db, "tmp/" + name, "db" );
    // .. get Actual DB
    // db = build_db ( db );
    // // .. N allocation
    // n_pad = tools.n_allocation( db, n_pad );
    // // .. R allocation
    // R = await dedicated_R();
    // // .. Get R_67
    // R = tools.R_optimizer( R, 67 );
    // // .. search for optimizing
    // __.cook( R, db, tmpFolder );
    // // .. check optimized info
    // await tools._db_check_( tmpFolder, db );
    // // .. create and save DBs
    // db_exporter();
    // // .. clean the tmpFolder
    // __.janitor( tmpFolder );
    // .. N-PAD report
    return n_pad;

}

// .. ====================================================================

function load_db () {

    let db: TS.db = [];

    let textBook: string = "";

    textBook = readSrcBook();
    // ..  do some edits
    textBook = removeAlaemTags( textBook );
    textBook = addAyahNativeTag( textBook );
    textBook = __.some_edits( textBook );

    db = main( textBook );
    db = patch( db );

    return db;

}

// .. ====================================================================

function readSrcBook (): string {

    let filePath = "source/" + name +  "/base_2.html";
    // .. check
    fs.accessSync( filePath, fs.constants.R_OK );
    // .. get source
    let txt = fs.readFileSync( filePath , 'utf8' );

    return txt;

}

// .. ====================================================================

function removeAlaemTags ( text: string ) {

    text = text.replace( /ع‏/g, "ع" );
    text = text.replace( / ع-/g, " ع " );
    text = text.replace( / ع /g, " عليه‌السلام " );
    text = text.replace( / ص /g, " صلى‌الله‌عليه‌وآله‌وسلم " );

    // .. remove unknown data « x »
    text = text.replace( /« ?[0-9]+ ?»/g, " " );

    text = text.replace( /\n+/g, "\n" );
    text = text.replace( / +/g, " " );
    text = text.trim();

    return text;

}

// .. ====================================================================

function addAyahNativeTag ( text: string ) {

    let tmp = text.split( "\n" );
    let newTag: string;

    // .. build DB: based on <P>
    for ( let i in tmp ) {
        // .. remove number span tags
        let match = tmp[i].match( /<span class="aya">(.*?)<\/span>/ ) || [];
        let rgx = new RegExp( match[0], "g" );
        if ( match.length ) {
            newTag = "<span class=\"aya\">|Q| " + match[1] + " |/Q|</span>";
            tmp[i] = tmp[i].replace( rgx, newTag );
        }
    }

    text = tmp.join( "\n" );

    return text;

}

// .. ====================================================================

function main ( textBook: string ) {

    let box = textBook.split( "\n" );
    let mini_box: string[] = [];
    let big_box: string[][] = [];
    let $: cheerio.CheerioAPI;

    // .. mini patch
    for ( let i in box ) {
        if( !box[i].includes( "class" ) )
            if ( box[i].includes( "أَقُولُ" ) )
                box[i] = box[i].replace( "span", "span class=\"snd\"" );
    }

    // .. remove 2 first lines
    box.shift(); box.shift();

    for ( let p of box ) {
        // .. control structure
        if ( !p.startsWith( "<span") || !p.endsWith("</span>") ) console.log(p);
        else if ( ( p.match( /span/g ) || [] ).length !== 2 ) console.log(p);
        // .. structure is ok
        else {
            // .. find number line
            if ( ( p.match( /> ?[0-9]+/ ) || [] ).length ) {
                // .. register in BOX
                big_box.push( mini_box );
                // .. reset mini_box
                mini_box = [p];
            }
            // .. register in BOX
            else mini_box.push(p);
        }
    }
    // .. register last item in BOX
    big_box.push( mini_box );
    // .. remove empty first row
    big_box.shift();

    // .. merge 2 first number rows
    for ( let p of big_box ) {
        if ( !( p[0].match( /> ?[0-9]+- [0-9]+?- ?/ ) || [] ).length ) {
            if ( ( p[0].match( />[0-9]+</ ) || [] ).length ) {
                if ( ( p[1].match( />- [0-9]+-</ ) || [] ).length  ) {
                    $ = cheerio.load( p[1] );
                    let tmp_1 = $("*").eq(0).text();
                    $ = cheerio.load( p[0] );
                    let tmp_0 = $("*").eq(0).text();
                    p[0] = "<span class=\"hdeth\">" + tmp_0 + tmp_1 + "</span>";
                    p.splice( 1, 1 );
                }
            }
        }
    }

    let db: TS.db = [];
    let d: number;
    let d_s: number;
    let tmp: TS.db_item;
    let p: string[];

    storage.saveData( big_box, "tmp/" + name, "full" );

    for ( let i in big_box ) {

        p = big_box[i];
        let parts0 = cheerio.load( p[0] ).text().split( "-" );
        if ( parts0.length >= 3 ) {
            // .. check structure
            d = Number(parts0[0]);
            d_s = Number(parts0[1]);
            if ( isNaN(d) ) console.log( parts0[0] );
            else if ( isNaN(d_s) ) console.log( parts0[1] );
            else {
                tmp = hadith_builder(p);
                if ( tmp ) {
                    db[ tmp.d ] = tmp;
                    delete big_box[i];
                }
                else {
                    tmp = build_patch(p);
                    if ( tmp ) {
                        db[ tmp.d ] = tmp;
                        delete big_box[i];
                    }
                }
            }
        };

    }
    big_box = big_box.filter( x => x );
    db = db.filter( x => x );

    db = fine( db );
    // .. report
    let prog = db.length / 35686 * 100 | 0;
    console.log( "Done:     ", db.length );
    console.log( "Remains:  ", big_box.length );
    console.log( "Progress: ", prog + "%" );

    storage.saveData( big_box, "tmp/" + name, "control" );

    return db;

}

// .. ====================================================================

function patch ( db: TS.db ) {

    let cdnBox = [
        "وَ ذَكَرَ مِثْل" ,
        "وَ ذَكَرَ نَحْوَهُ" ,
        "وَ ذَكَرَ قَضِيَّةً" ,
    ];

    for( let p of db ) {
        innerLoop:
        for ( let q of cdnBox ) {
            if ( p.a.startsWith( q ) ) {
                p[9] = p.a + " " + p[9];
                p.a = "";
                break innerLoop;
            }
        }
    }

    // .. last trim
    for ( let p of db ) {
        p[0] = p[0].replace( / +/g, " " ).trim();
        p[9] = p[9].replace( / +/g, " " ).trim();
        p.a = p.a.replace( / +/g, " " ).trim();
    }

    return db;

}

// .. ====================================================================

function hadith_builder( g: string[] ) {

    let hadith: TS.db_item = {} as any;
    let parts0 = cheerio.load( g[0] ).text().split( "-" );
    let hLineId: number;
    let sLineId: number;
    let bak = g[0];

    // .. add rest of parts0
    g[0] = parts0[2].trim();
    hadith.d = Number( parts0[0] ) + "";
    hadith.idInSection = Number( parts0[1] );

    // .. module 1 [ N S H ] 
    if ( g.length === 3 )
        if ( g[1].includes( 'class="snd"' ) )
            if ( g[2].includes( 'class="hdeth"' ) ) {
                hadith[0] = cheerio.load( g[1] ).text();
                hadith.a = cheerio.load( g[2] ).text();
            }

    // .. module 2 [single H line]
    if ( g.filter( x => x.includes( 'class="hdeth"' ) ).length === 1 ) {
        hadith[0] = "";
        hadith[9] = "";
        hadith.a = "";
        hLineId = g.findIndex( x => x.includes( 'class="hdeth"' ) );
        for( let i=0; i<g.length; i++ ) {
            if ( i < hLineId ) hadith[0] += " " + cheerio.load( g[i] ).text();
            if ( i === hLineId ) hadith.a = cheerio.load( g[i] ).text();
            if ( i > hLineId ) hadith[9] += " " + cheerio.load( g[i] ).text();
        }
    }

    // .. module 3 [ N S! H+ ]
    if ( g.filter( x => x.includes( 'class="snd"' ) ).length === 1 ) {
        sLineId = g.findIndex( x => x.includes( 'class="snd"' ) );
        if ( sLineId === 1 ) {
            for( let i=0; i<g.length; i++ ) {
                if ( i === sLineId ) hadith[0] = cheerio.load( g[i] ).text();
                else hadith.a += " " + cheerio.load( g[i] ).text();
            }
        }
    }

    // .. module 4 [ N, S+ H+ S+ ]
    let endH = false;
    let runH = false;
    hadith[0] = "";
    hadith[9] = "";
    hadith.a = "";
    for ( let i=0; i<g.length; i++ ) {
        if ( g[i].includes( 'class="snd"' ) ) {
            if ( runH ) endH = true;
            if ( !endH ) hadith[0] += " " + cheerio.load( g[i] ).text();
            else hadith[9] += " " + cheerio.load( g[i] ).text();
        }
        else if ( g[i].includes( 'class="hdeth"' ) ) {
            runH = true;
            if ( !endH ) hadith.a += " " + cheerio.load( g[i] ).text();
            else {
                hadith.a = null;
                break;
            }
        }
        else if ( g[i].includes( 'class="aya"' ) ) {
            runH = true;
            if ( !endH ) hadith.a += " " + cheerio.load( g[i] ).text();
            else {
                hadith.a = null;
                break;
            }
        }
        else {
            if ( !runH ) hadith[0] += " " + cheerio.load( g[i] ).text();
            else if ( runH && !endH ) hadith.a += " " + cheerio.load( g[i] ).text();
            else if ( runH && endH ) hadith[9] += " " + cheerio.load( g[i] ).text();
            else console.log("???");
        }
    }

    // .. Hand Control
    let cdnBox = [
        "165", "407", "1251", "1323", "1349", "1789", "1670", "1727",
        "2257", "2961", "3070", "3913", "7084", "7489", "7931", "8694",
        "8973", "9996", "10869", "11594", "11849", "12051", "12167",
        "12753", "12815", "12826", "12876", "13136", "14536", "14628",
        "14950", "15022", "16300", "16479", "16622", "16955", "17886",
        "18337", "19133", "19166", "19346", "19364", "20019", "20050",
        "20215", "21148", "22417", "23647", "24378", "24553", "26204",
        "26263", "28070", "28741", "28914", "28963", "29637", "29868",
        "30467", "30932", "31646", "31162", "31185", "31233", "31360",
        "31396", "31445", "31519", "31520", "32386", "32409", "32422",
        "32428", "32486", "32611", "33635", "33709", "33782", "33824",
        "34025", "34214", "34218", "34513", "34968", "35146", "35216",
        "35426", "35601"
    ];
    // ! ذَكَرَ نَحْوَهُ 11849
    // ! 14341
    if ( cdnBox.includes( hadith.d ) ) {
        hadith[0] = "";
        hadith[9] = "";
        hadith.a = "";
        for ( let i=0; i<g.length; i++ ) {
            if ( i === 0 ) {}
            else if ( i === 1 ) hadith[0] = cheerio.load( g[i] ).text();
            else if ( i === 2 ) hadith.a = cheerio.load( g[i] ).text();
            else hadith[9] += " " + cheerio.load( g[i] ).text();
        }
    }
    // .. Hand Control
    if ( g.length === 1 ) {
        hadith[0] = "";
        hadith[9] = "";
        let cdn = "قَالَ :";
        let idx = g[0].indexOf( cdn );
        if ( ~idx ) {
            hadith[0] = g[0].slice( 0, idx + cdn.length );
            g[0] = g[0].slice( idx + cdn.length );
        }
        hadith.a = g[0];
    }

    g[0] = bak;
    return hadith.a ? hadith : null;

}

// .. ====================================================================

function build_patch ( g: string[] ) {

    let hadith: TS.db_item = {} as any;
    let parts0 = cheerio.load( g[0] ).text().split( "-" );
    let bak = g[0];

    // ! add rest of parts0
    g[0] = parts0[2].trim();
    hadith.d = Number( parts0[0] ) + "";
    hadith.idInSection = Number( parts0[1] );

    // .. module 4 [ N, S+ H+ S+ ] +
    let endH = false;
    let runH = false;
    let tmp: string;
    let patched = false;

    hadith[0] = "";
    hadith[9] = "";
    hadith.a = "";
    for ( let i=0; i<g.length; i++ ) {
        if ( g[i].includes( 'class="snd"' ) ) {
            if ( runH ) endH = true;
            if ( !endH ) hadith[0] += " " + cheerio.load( g[i] ).text();
            else {
                tmp = cheerio.load( g[i] ).text();
                hadith[9] += " " + tmp;
                if ( tmp.includes( "رَوَاهُ") ) patched = true;
                if ( tmp.includes( "فِي رِوَايَةٍ أُخْرَى‏") ) patched = true;
            }
        }
        else if ( g[i].includes( 'class="hdeth"' ) ) {
            runH = true;
            if ( !endH ) hadith.a += " " + cheerio.load( g[i] ).text();
            else {
                tmp = cheerio.load( g[i] ).text();
                if ( tmp.includes( "مِثْلَهُ إِلَّا" ) ) patched = true;
                if ( tmp.includes( "مِثْلَهُ إِلَّا" ) ) patched = true;
                if ( tmp.includes( "مِثْلَهُ‏ إِلَّا" ) ) patched = true;
                if ( tmp.includes( "مِثْلَهُ‏ وَ " ) ) patched = true;
                if ( patched ) hadith[9] += " " + cheerio.load( g[i] ).text();
                else { hadith.a = null; break; }
            }
        }
        else if ( g[i].includes( 'class="aya"' ) ) {
            runH = true;
            if ( !endH ) hadith.a += " " + cheerio.load( g[i] ).text();
            else {
                if ( patched ) hadith[9] += " " + cheerio.load( g[i] ).text();
                else { hadith.a = null; break; }
            }
        }
        else {
            if ( !runH ) hadith[0] += " " + cheerio.load( g[i] ).text();
            else if ( runH && !endH ) hadith.a += " " + cheerio.load( g[i] ).text();
            else if ( runH && endH ) hadith[9] += " " + cheerio.load( g[i] ).text();
            else console.log("???");
        }
    }

    g[0] = bak;
    return hadith.a ? hadith : null;

}

// .. ====================================================================

function fine ( db: TS.db ) {

    let idx: number;
    for ( let p of db ) {

        p[0] = " " + p[0] + " ";
        p.a = " " + p.a + " ";
        p[9] = " " + p[9] + " ";
        p[0] = p[0].replace( /ع‏/g, "ع" );
        p[0] = p[0].replace( / ع-/g, " ع " );
        p[0] = p[0].replace( / ع /g, " عليه‌السلام " );
        p[0] = p[0].replace( / ص /g, " صلى‌الله‌عليه‌وآله‌وسلم " );
        p[0] = p[0].replace( /\|Q\|/g, "<Q>" );
        p[0] = p[0].replace( /\|\/Q\|/g, "</Q>" );
        p.a = p.a.replace( /ع‏/g, "ع" );
        p.a = p.a.replace( / ع-/g, " ع " );
        p.a = p.a.replace( / ع /g, " عليه‌السلام " );
        p.a = p.a.replace( / ص /g, " صلى‌الله‌عليه‌وآله‌وسلم " );
        p.a = p.a.replace( /\|Q\|/g, "<Q>" );
        p.a = p.a.replace( /\|\/Q\|/g, "</Q>" );
        p[9] = p[9].replace( /ع‏/g, "ع" );
        p[9] = p[9].replace( / ع-/g, " ع " );
        p[9] = p[9].replace( / ع /g, " عليه‌السلام " );
        p[9] = p[9].replace( / ص /g, " صلى‌الله‌عليه‌وآله‌وسلم " );
        p[9] = p[9].replace( /\|Q\|/g, "<Q>" );
        p[9] = p[9].replace( /\|\/Q\|/g, "</Q>" );

        idx = p.a.lastIndexOf( "الْحَدِيثَ" );
        if ( idx > p.a.length - 25 ) {
            p[9] = p.a.slice(idx) + " " + p[9];
            p.a = p.a.slice( 0, idx );
        }
        p[0] = p[0].replace( / +/g, " " ).trim();
        p.a = p.a.replace( / +/g, " " ).trim();
        p[9] = p[9].replace( / +/g, " " ).trim();
        if ( p.a.endsWith( " وَ" ) ) {
            idx = p.a.lastIndexOf( " وَ" );
            p[9] = p.a.slice(idx) + " " + p[9];
            p.a = p.a.slice( 0, idx );
        }
        p[0] = p[0].replace( / +/g, " " ).trim();
        p.a = p.a.replace( / +/g, " " ).trim();
        p[9] = p[9].replace( / +/g, " " ).trim();
    }
    return db;

}

// .. ====================================================================

function c_allocator ( db: TS.db ) {

    for( let p of db ) p = _0(p);

    return db;

}

// .. ====================================================================

function _0 ( item: TS.db_item ) {

    let cut_ID: number = -1,
        cdnBOX: { text: string, c: number, excludesText: boolean }[];

    cdnBOX = [

        // .. includesText
        { text: " قلت لأبي عبدالله عليه‌السلام :", c: 6, excludesText: false },
        { text: " سأل أبا عبدالله عليه‌السلام", c: 6, excludesText: false },
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
        { text: " قال لأبي عبدالله عليه‌السلام :", c: 6, excludesText: false },
        { text: " قال لابي عبدالله عليه‌السلام :", c: 6, excludesText: false },
        { text: ": رأيت أبا عبدالله عليه‌السلام ", c: 6, excludesText: false },
        { text: ": رأيت أبا جعفر عليه‌السلام ", c: 5, excludesText: false },
        { text: ": رأيت أبا الحسن عليه‌السلام ", c: 7, excludesText: false },
        { text: ": رأيت أمير المؤمنين ", c: 1, excludesText: false },
        { text: ": رأيت أبا جعفر الثاني ", c: 9, excludesText: false },
        { text: " قلت للصادق عليه‌السلام :", c: 6, excludesText: false },
        { text: ": قلت لابي جعفر الثاني عليه‌السلام :", c: 9, excludesText: false },
        { text: ": قلت لابي جعفر عليه‌السلام :", c:5, excludesText: false },
        { text: ": قلت لابي عبدالله عليه‌السلام :", c:6, excludesText: false },
        { text: ": كتبت إلى أبي الحسن عليه‌السلام :", c:7, excludesText: false },
        { text: "قلت لابي جعفر الثاني عليه‌السلام :", c:9, excludesText: false },
        // .. excludesText
        { text: "قال رسول الله صلى‌الله‌عليه‌وآله‌وسلم - في حديث -", c:13, excludesText: true },
        { text: " - في حديث المناهي - قال :", c:null, excludesText: true },
        { text: "عن أبي عبدالله عليه‌السلام إنه قال :", c:6, excludesText: true },
        { text: "عن الصادق عليه‌السلام أنّه قال :", c:6, excludesText: true },
        { text: " عن أبي عبدالله عليه‌السلام أنه قال :", c:6, excludesText: true },
        { text: "عن الصادق عليه‌السلام ، أنّه قال :", c:6, excludesText: true },
        { text: "موسى بن جعفر عليه‌السلام ، قال :", c:7, excludesText: true },
        { text: "قال أبو الحسن موسى بن جعفر عليه‌السلام :", c:7, excludesText: true },
        { text: "عن أبي عبدالله عليه‌السلام ، قال :", c:6, excludesText: true },
        { text: ": وروي في حديث آخر :", c:null, excludesText: true },
        { text: "عن ابيه عليه‌السلام قال :", c:null, excludesText: true },
        { text: "عن أبي عبدالله عليه‌السلام قال - في حديث - :", c:6, excludesText: true },
        { text: "عن أبي ^جعفر عليه‌السلام قال :", c:5, excludesText: true },
        { text: "عن أبي جعفر عليه‌السلام قال :", c:5, excludesText: true },
        { text: "عن أبي عبدالله عليه‌السلام أنّه قال :", c:6, excludesText: true },
        { text: "عن أبي الحسن عليه‌السلام ، قال :", c:1, excludesText: true },
        { text: " ، عن علي عليهم‌السلام قال :", c:1, excludesText: true },
        { text: "^قال : وقال أمير المؤمنين عليه‌السلام :", c:1, excludesText: true },
        { text: "قال : قال أمير المؤمنين عليه‌السلام :", c:1, excludesText: true },
        { text: "عن أبي الحسن عليه‌السلام - في حديث - قال :", c:7, excludesText: true },
        { text: "عبدالله عليه‌السلام - في حديث - قال :", c:6, excludesText: true },
        { text: "عن الصادق عليه‌السلام - في حديث - قال :", c:6, excludesText: true },
        { text: "عن أبي عبدالله عليه‌السلام - في حديث - قال :", c:6, excludesText: true },
        { text: "عن أبي عبد الله عليه‌السلام - في حديث - قال :", c:6, excludesText: true },
        { text: "عن أبي جعفر عليه‌السلام أنّه قال :", c:5, excludesText: true },
        { text: "عن أبي جعفر عليه‌السلام ، قال :", c:5, excludesText: true },
        { text: "عن الصادق عليه‌السلام انه قال :", c:6, excludesText: true },
        { text: ": وقال أبو جعفر عليه‌السلام :", c:6, excludesText: true },
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
        { text: " عن زينب بنت علي عليه‌السلام قالت :", c: 888, excludesText: true },
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
        { text: " عن أبي الحسن الماضي عليه‌السلام قال :", c: 7, excludesText: true },
        { text: " عن الرضا عليه‌السلام - في حديث - قال :", c: 8, excludesText: true },
        { text: " عن أبي الحسن عليه‌السلام قال :", c: 7, excludesText: true },
        { text: " عن أبي عبد الله عليه‌السلام قال :", c: 6, excludesText: true },
        { text: " عن الصادق جعفر بن محمد عليهما‌السلام قال :", c: 6, excludesText: true },
        { text: " قال أبوذر رحمه‌الله :", c: 111, excludesText: true },
        { text: " عن علي بن الحسين عليه‌السلام قال :", c: 4, excludesText: true },
        { text: " سمعت علي بن الحسين عليه‌السلام يقول :", c: 4, excludesText: true },
        { text: " سمعت أبا عبدالله عليه‌السلام يقول", c: 6, excludesText: true },
        { text: " قال الرضا عليه‌السلام :", c: 8, excludesText: true },
        { text: " عن أبي عبد الله عليه‌السلام :", c: 6, excludesText: true },
        { text: " وقال أبو عبدالله عليه‌السلام :", c: 6, excludesText: true },
        { text: " وقال أبو عبدالله عليه‌السلام :", c: 6, excludesText: true },
        { text: " قال أبو جعفر عليه‌السلام :", c: 5, excludesText: true },
        { text: "قال : وقال الصادق عليه‌السلام : ", c: 6, excludesText: true },
        { text: "قال : وقال أبو جعفر عليه‌السلام : ", c: 6, excludesText: true },
        { text: "وعن أبي عبدالله عليه‌السلام :", c:6, excludesText: true },
        { text: "وعن أبي جعفر عليه‌السلام :", c: 5, excludesText: true },
        { text: "وقد تقدم في حديث عن أبي عبدالله عليه‌السلام :", c: 6, excludesText: true },
        { text: "", c: null, excludesText: true },
        { text: "", c: null, excludesText: true },

        // ! IMPORTANT
        { text: "وعنه عليه‌السلام :", c: null, excludesText: true },
        { text: "، عن أبي جعفر عليه‌السلام قال :", c: 6, excludesText: true },
        { text: ": قال رسول الله صلى‌الله‌عليه‌وآله‌وسلم :", c: 13, excludesText: true },

    ];

    // .. cut BeginningOfHadith "STRICK"
    for ( let p of cdnBOX ) {

        try { cut_ID = item.tmp.w[0].indexOf( p.text ) }
        catch { cut_ID = -1 }

        if ( ~cut_ID ) {
            if ( p.excludesText ) cut_ID += p.text.length;
            item = __.w_0__0 ( item, cut_ID );
            item.c = p.c;
            break;
        }
    }

    return item;

}

// .. ====================================================================

async function dedicated_R () {

    let R_Path = tmpFolder + "/" + name + "-R.json";

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
        processes.push( runService( db ) );
    }

    // .. init R
    R = [];
    // .. wait for all processes get Done.
    await Promise.all( processes ).then( RS => { 
        for ( let r of RS ) R = [ ...R, ...r ]
    } );

    // .. wait a bit
    await new Promise( _ => setTimeout( _, 700 ) );
    report.cursor( 22, 0 );

    storage.saveData( R, tmpFolder, name + "-R", true );

    return R;

}

// .. ====================================================================

function db_exporter () {

    db = tools.relation_definer( tmpFolder, db );
    let p: TS.db_item;

    // .. D Publisher
    for ( let i in db ) {

        p = db[i];

        // .. last trims
        p.d = basic_tools.arabicDigits( name + "، الحديث: " + p.d );
        if ( p.a.endsWith( "» ." ) ) p.a = p.a.slice( 0, p.a.length -2 );
        p.a  = p.a.replace ( /\|Q\|/g, "<Q>" ).replace( /\|\/Q\|/g, "</Q>" );
        p[0] = p[0].replace( /\|Q\|/g, "<Q>" ).replace( /\|\/Q\|/g, "</Q>" );
        p[9] = p[9].replace( /\|Q\|/g, "<Q>" ).replace( /\|\/Q\|/g, "</Q>" );

        // .. re-sort
        db[i] = {
            0: p[0], a: p.a, 9: p[9], 
            b: p.b, c: p.c, d: p.d, n: p.n,
            idInSection: p.idInSection, cDB: p.cDB
        }

    }

    storage.saveData( db, "db", name );

}

// .. ====================================================================

function resource_update () {

    let db_Path = "db/" + name + ".json";

    try { fs.mkdirSync( tmpFolder ) } catch {}
    try { db = JSON.parse( fs.readFileSync( db_Path, 'utf8' ) ) } catch {}

}

// .. ====================================================================
