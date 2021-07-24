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
let R_Path              = tmpFolder + "/" + name + "-R.json";

resource_update ();

// .. ====================================================================

export async function ignite ( mode: "Scratch"|"Cached", n_pad: number ) {

    // .. init server
    report.notify( name );
    // .. init DB
    db = [];
    // .. get db
    db = load_db();
    // .. assign c ID
    db = c_allocator( db );
    // .. get Actual DB
    db = build_db( db );
    // .. N allocation
    n_pad = tools.n_allocation( db, n_pad );
    // .. Patch Cells
    db = cellPatcher_byHand( db );
    db = cellPatcher( db );
    // // .. R allocation
    // R = await __.R_wrapper( R_Path, db );
    // // .. Get R_67
    // R = tools.R_optimizer( R, 67 );
    // // .. search for optimizing
    // __.cook( R, db, tmpFolder );
    // // .. check optimized info
    // await tools._db_check_( tmpFolder, db );
    // // .. merge similar ones
    // db = tools.relation_definer( tmpFolder, db );
    // .. create and save DBs
    db_exporter();
    // .. clean the tmpFolder
    __.janitor( tmpFolder );
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
    g[0] = parts0.slice(2).join( " - " ).replace( / +/g, " " ).trim();
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

    // .. add rest of parts0
    g[0] = parts0.slice(2).join( " - " ).replace( / +/g, " " ).trim();
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
        p.a = p.a.replace( /ع‏/g, "ع" );
        p.a = p.a.replace( / ع-/g, " ع " );
        p.a = p.a.replace( / ع /g, " عليه‌السلام " );
        p.a = p.a.replace( / ص /g, " صلى‌الله‌عليه‌وآله‌وسلم " );
        p[9] = p[9].replace( /ع‏/g, "ع" );
        p[9] = p[9].replace( / ع-/g, " ع " );
        p[9] = p[9].replace( / ع /g, " عليه‌السلام " );
        p[9] = p[9].replace( / ص /g, " صلى‌الله‌عليه‌وآله‌وسلم " );

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

    for( let p of db ) {
        p = c_by_xx(p);
    }

    return db;

}

// .. ====================================================================

function c_by_xx ( item: TS.db_item ) {

    let cdnBOX: { c: number, text: string }[] = [
        { c: 5, text: "أَبِي جَعْفَرٍ عليه‌السلام قَالَ" },
        { c: 6, text: "عَنْ أَبِي عَبْدِ اللَّهِ عليه‌السلام قَالَ :" },
        { c: 6, text: "عَنِ الصَّادِقِ عليه‌السلام قَالَ :" },
        { c: 7, text: "أَبِي صَالِحٍ قَالَ :" },
        { c: 7, text: "عَنْ أَخِيهِ" },
        { c: 6, text: "عَنْ جَعْفَرٍ عَنْ" },
        { c: 1, text: "أَبِي الْحَسَنِ الْأَوَّلِ" },
        { c: 7, text: "أَبِي الْحَسَنِ الْمَاضِي عليه‌السلام" },
        { c: 5, text: "مُحَمَّدُ بْنُ عَلِيِّ بْنِ الْحُسَيْنِ" },
        { c: 6, text: "الصَّادِقِينَ قَالَ" },
        { c: 1, text: "عَلِيّاً عليه‌السلام" },
        { c: 1, text: "أَبِي الْحَسَنِ الْأَوَّلِ عليه‌السلام" },
        { c: 1, text: "أَبِي الْحَسَنِ عليه‌السلام" },
        { c: 7, text: "مُوسَى عليه‌السلام" },
        { c: 5, text: "الْبَاقِرِ عليه‌السلام" },
        { c: 5, text: "أَبِي جَعْفَرٍ عليه‌السلام" },
        { c: 1, text: "أَبَا الْحَسَنِ عليه‌السلام" },
        { c: 6, text: "أَبِي عَبْدِ اللَّهِ عليه‌السلام" },
        { c: 6, text: "الصَّادِقِ عَنْ آبَائِهِ" },
        { c: 10, text: "عَلِيِّ بْنِ مُحَمَّدٍ الْهَادِي‏" },
        { c: 1, text: "أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام" },
        { c: 8, text: "الرِّضَا عليه‌السلام" },
        { c: 6, text: "أَبَا عَبْدِ اللَّهِ عليه‌السلام" },
        { c: 8, text: "أَبِي الْحَسَنِ الرِّضَا عليه‌السلام" },
        { c: 7, text: "مُوسَى بْنِ جَعْفَرٍ" },
        { c: 6, text: "جَعْفَرِ بْنِ مُحَمَّدٍ عليه‌السلام" },
        { c: 6, text: "الصَّادِقُ جَعْفَرُ بْنُ مُحَمَّدٍ عليه‌السلام" },
        { c: 5, text: "عَنْ أَحَدِهِمَا عليه‌السلام" },
        { c: 4, text: "عَلِيِّ بْنِ الْحُسَيْنِ عليه‌السلام" },
        { c: 6, text: "عَنْ جَعْفَرِ بْنِ مُحَمَّدٍ" },
        { c: 6, text: "عَنِ الصَّادِقِ عليه‌السلام" },
        { c: 5, text: "أَبَا جَعْفَرٍ عليه‌السلام" },
        { c: 6, text: "أَبُو عَبْدِ اللَّهِ عليه‌السلام" },
        { c: 1, text: "عَنْ أَمِيرِ الْمُؤْمِنِينَ عليه‌السلام" },
        { c: 8, text: "عَنِ الرِّضَا" },
        { c: 5, text: "عَنْ أَبِي جَعْفَرٍ" },
        { c: 1, text: "عَلِيٍّ عليه‌السلام" },
        { c: 6, text: "الصَّادِقِ جَعْفَرِ بْنِ مُحَمَّدٍ عليه‌السلام" },
        { c: 1, text: "خَطَبَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام" },
        { c: 5, text: "أَبِي جَعْفَرٍ عليه‌السلام" },
        { c: 5, text: "أَبُو جَعْفَرٍ عليه‌السلام" },
        { c: 6, text: "عَنْ أَبِي عَبْدِ اللَّهِ عليه‌السلام" },
        { c: 6, text: "قَالَ الصَّادِقُ عليه‌السلام" },
        { c: 7, text: "أَبِي إِبْرَاهِيمَ" },
        { c: 7, text: "أَبَا إِبْرَاهِيمَ" },

        { c: 6, text: "زُرَارَةَ" },
        { c: 6, text: "سَمَاعَةَ" },
        { c: 6, text: "مُحَمَّدُ بْنُ يَعْقُوبَ" },

        { c: 13, text: "عَنِ النَّبِيِّ" },
        { c: 13, text: "رَسُولِ اللَّهِ" },
        { c: 13, text: "رَسُولُ اللَّهِ" },
        { c: 13, text: "عَنْ رَسُولِ اللَّهِ" },
        { c: 13, text: "صلى‌الله‌عليه‌وآله‌وسلم" },

    ];

    for ( let p of cdnBOX ) {
        if ( item[0].includes( p.text ) ) {
            item.c = p.c;
            break;
        }
    }

    if ( !item.c ) {
        for ( let p of cdnBOX ) {
            if ( item.a.includes( p.text ) ) {
                item.c = p.c;
                break;
            }
        }
    }

    return item;

}

// .. ====================================================================

function build_db ( db: TS.db ) {

    let newDB: TS.db = [];

    // .. create empty template
    for ( let i=1; i<=35868; i++ )
        newDB[i-1] = {0:"",9:"",a:"",b:"",c:null,d:i+"",cDB:[],n:null}

    // .. fill actual data
    for ( let p of db ) newDB[ Number(p.d) -1 ] = p;

    return newDB;

}

// .. ====================================================================

function cellPatcher_byHand ( db: TS.db ) {

    for ( let p of db ) {

        if
        (
            ( p.a.includes( "مِثْل" ) || p.a.includes( "نَحْوَهُ" ) ) &&
            p.a.length < 20
        )
        {
            // .. concat
            p[0] += " " + p.a;
            // .. exchange slots
            if ( !p[9] ) { p[9] = p[0]; p[0] = ""; }
            // .. purge
            p.a = "";
        }

        // .. purge
        if ( p.a === "." ) p.a = "";


    }

    let cdnBox = [ 
        25462, 29840, 29849, 30432, 30541, 30581, 32501, 33907, 37065,
        40543, 41036, 41918, 49662, 50087, 51136, 23907, 28334, 22367,
        22362, 17386, 21609, 45693, 47104, 47228, 24108, 28869, 28870,
        28887, 29483, 30309, 32278, 32866, 33751, 40947, 50887
    ];
    let p: TS.db_item;

    for ( let q of cdnBox ) {

        p = db.find( x => x.n === q );
        // .. concat
        p[0] += " " + p.a;
        // .. exchange slots
        if ( !p[9] ) { p[9] = p[0]; p[0] = ""; }
        // .. purge
        p.a = "";

    }

    return db;

}

// .. ====================================================================

function cellPatcher ( db: TS.db ) {

    let filePath = "source/" + name +  "/patches.json";
    // .. check
    fs.accessSync( filePath, fs.constants.R_OK );
    // .. get source
    let patches: TS.db = JSON.parse( fs.readFileSync( filePath , 'utf8' ) );
    // .. apply patch
    for ( let p of patches ) db[ db.findIndex( x => x.n === p.n ) ] = p;

    return db;

}

// .. ====================================================================

function db_exporter () {

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

        p[0] = p[0].replace( /-/g, " - " ).replace( / +/g, " " ).trim();
        p[9] = p[9].replace( /-/g, " - " ).replace( / +/g, " " ).trim();
        p.a = p.a.replace( /-/g, " - " ).replace( / +/g, " " ).trim();

        if ( p[0].endsWith( " ص‏" ) ) 
            p[0] = p[0].slice( 0, p[0].length -1 ) + "صلى‌الله‌عليه‌وآله‌وسلم";

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

export function resource_update () {

    let db_Path = "db/" + name + ".json";

    try { fs.mkdirSync( tmpFolder ) } catch {}
    try { db = JSON.parse( fs.readFileSync( db_Path, 'utf8' ) ) } catch {}
    try { R  = JSON.parse( fs.readFileSync( R_Path,  'utf8' ) ) } catch {}

}

// .. ====================================================================