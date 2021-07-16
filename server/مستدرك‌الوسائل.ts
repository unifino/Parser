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

export let name         = "مستدرك‌الوسائل";
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
    // .. get v0 [ Scratch | Cached ]
    db = load_db_v0( mode );
    // // .. get Actual DB
    // db = build_db ( db );
    // // .. N allocation
    // n_pad = tools.n_allocation( db, n_pad );
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
    // // .. create and save DBs
    // db_exporter();
    // .. clean the tmpFolder
    __.janitor( tmpFolder );
    // .. N-PAD report
    return n_pad;

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
        let tmp_db: TS.db = [];

        // .. merge Books as Source
        textBook += " " + readSrcBook( "source/مستدرك‌الوسائل/base.html" );
        // ..  do some edits
        textBook = __.some_edits( textBook );
        // .. remove unwanted parted => neat
        textBook = getNeatBook( textBook );
        // .. build first db => rawDB
        let raw_db = getRawDB( textBook );
        // // .. provide a preview for checking
        // preview_1( raw_db.join("</p>") );
        // .. build main db
        tmp_db = hadith_db_generator( raw_db );
        // .. scatter 0-a-9
        tmp_db = a_0_9( tmp_db );
        storage.saveData( tmp_db, "tmp", "cdn" );
        // .. provide a preview for checking
        let tmp = "";
        for ( let p of tmp_db ) tmp += "<p>" + p.d + p.tmp.w.join( " " ) + "</p>";

        preview_1( tmp );
        // // .. assign c code
        // tmp_db = c_allocator( tmp_db );
        // // .. sum up Books
        // db_v0 = [ ...db_v0, ...tmp_db ];

        // // .. provide a preview for checking
        // preview_2( db_v0 );

    }

    return db_v0;

}

// .. ====================================================================

function readSrcBook ( link: string ): string {

    // .. check
    fs.accessSync( link, fs.constants.R_OK );
    // .. get source
    let txt = fs.readFileSync( link, 'utf8' );

    // .. cut beginning and end of the book
    let a = txt.indexOf( "<body>" );
    let b = txt.indexOf( "</body>" );

    if ( a>0 && b>0 ) return txt.slice( a+6, b );
    else console.log( "err-01",a , b )

}

// .. ====================================================================

function getNeatBook ( text: string ) {

    text = text.replace( /<p class="pagen">[0-9]+<\/p>/g, "" );
    text = text.replace( /<h1(.*?)<\/h1>/g, "" );
    text = text.replace( /<h2(.*?)<\/h2>/g, "" );
    text = text.replace( /<h3(.*?)<\/h3>/g, "" );
    text = text.replace( /<h4(.*?)<\/h4>/g, "" );
    text = text.replace( /\n+/g, "" );
    text = text.replace( /\r+/g, "" );
    text = text.replace( /<p/g, "\n<p" );
    text = text.replace( /<p><\/p>/g, " " );

    let box = text.split( "\n" );
    for ( let i=box.length-1; i>0; i-- ) {
        if ( !( box[i].match( /[0-9]+-? [0-9]+/) || [] ).length ) {
            box[i-1] = box[i-1] + box[i];
            box[i] = "";
        } 
    }
    box = box.filter( x => x );

    text = box.join( "\n" );

    text = removeAlaemTags( text );

    return text;

}

// .. ====================================================================

function removeAlaemTags ( text: string ) {

    text = text.replace( /<\/p><p>/g, " " );

    text = text.replace( /<span class="fm"> ?عزوجل ?<\/span>/g, " عزوجل " );
    text = text.replace( /<span class="fm"> ?رحمه‌الله ?<\/span>/g, " رحمه‌الله " );
    text = text.replace( /<span class="fm"> ?رحمهم‌الله ?<\/span>/g, " رحمهم‌الله " );
    text = text.replace( /<span class="fm"> ?عليه‌السلام ?<\/span>/g, " عليه‌السلام " );
    text = text.replace( /<span class="fm"> ?عليها‌السلام ?<\/span>/g, " عليها‌السلام " );
    text = text.replace( /<span class="fm"> ?عليهم‌السلام ?<\/span>/g, " عليهم‌السلام " );
    text = text.replace( /<span class="fm"> ?عليهما‌السلام ?<\/span>/g, " عليهما‌السلام " );
    text = text.replace( /<span class="fm"> ?رضي‌الله‌عنه ?<\/span>/g, " رضي‌الله‌عنه " );
    text = text.replace( /<span class="fm"> ?قدس‌سره ?<\/span>/g, " قدس‌سره " );
    text = text.replace( /<span class="fm"> ?صلى‌الله‌عليه‌وآله‌وسلم ?<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );

    // .. replace libAie with native Q tag
    let q = ( text.match( /<span class="quran">(.*?)<\/span>/g ) || [] );
    for ( let c of q ) {
        let r = c;
        r = r.replace( "<span class=\"quran\">", " <Q> " );
        r = r.replace( "<\/span>", " </Q> " );
        text = text.replace( c, r );
    }

    text = text.replace( / +/g, " " );
    text = text.trim();

    text = text.replace( /<\/span> ?<span class="hadith">/g, " " );

    return text;

}

// .. ====================================================================

function getRawDB ( text: string ) {

    let db: string[] = [];

    // .. build DB: based on <P>
    for ( let p of text.split( "</p>" ) ) {
        // .. remove number span tags
        let match = p.match( /<span class="hadith">(.*?)<\/span>/ ) || [];
        let rgx = new RegExp( match[0], "g" );
        if ( match.length )
            if ( ( match[1].match( /[0-9]+-? [0-9].?/ ) || [] ).length ) 
                p = p.replace( rgx, " " + match[1] + " " );
        // .. register in DB
        db.push(p);
    }

    return db;

}

// .. ====================================================================

function hadith_db_generator ( raw_db: string[] ) {

    let db: TS.db = [],
        hadith: TS.db_item = { tmp: { 0: [], 9:[], a: [], w: [] } } as any;

    for ( let p of raw_db ) {

        let cdn = p.match( /[0-9]+-? [0-9]+/ ) || [];
        // .. append this line
        if ( cdn.length === 0 ) hadith.tmp.w.push( p );
        // .. beginning of a new Hadith
        else if ( cdn.length === 1 ) {
            // .. add to newBook
            if ( hadith.tmp.w.length ) {
                hadith.tmp.w[0] = hadith.tmp.w[0].replace( /<span/g, "\n<span" );
                hadith.tmp.w[0] = hadith.tmp.w[0].replace( /<\/span>/g, "</span>\n" );
                hadith.tmp.w = hadith.tmp.w[0].split( "\n" );
                hadith.tmp.w = hadith.tmp.w.filter( x => x );
            }
            db.push( hadith );
            // .. reset the HadithBox
            hadith = { tmp: { 0: [], 9:[], a: [], w: [] } } as any;
            p = p.slice( cdn.index + cdn[0].length );
            hadith.tmp.w.push( p );
            let dp = cdn[0].split( " " );
            hadith.d = Number( dp[0].replace("-","") ).toString();
            hadith.idInSection = Number( dp[1].trim() );
        }
        // .. error report
        else console.log( "Unexpected Line:", p );
    }
    // .. add ĺast item
    if ( hadith.tmp.w.length ) {
        hadith.tmp.w[0] = hadith.tmp.w[0].replace( /<span/g, "\n<span" );
        hadith.tmp.w[0] = hadith.tmp.w[0].replace( /<\/span>/g, "</span>\n" );
        hadith.tmp.w = hadith.tmp.w[0].split( "\n" );
        hadith.tmp.w = hadith.tmp.w.filter( x => x );
        db.push( hadith );
    }

    // .. remove first cell
    db.shift();

    // .. return
    return db;

}

// .. ====================================================================

function a_0_9 ( db: TS.db ) {

    // ! الْخَبَرَ
    // ! إلخ
    // ! م
    // ! 12273 check if ajmaein?

    let container: { [key: string]: TS.db_item[] } = {};

    for( let p of db ) {

        // .. module A
        if ( p.tmp.w.length === 1 )
            if ( p.tmp.w[0].includes( "مِثْل" ) || p.tmp.w[0].includes( "أَيْضاً" ) ) {
                p[0] = p.tmp.w[0];
                p.a = "remove it";
            }

        // .. module S - H
        if ( p.tmp.w.length === 2 )
            if ( !p.tmp.w[0].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) ) {
                    p[0] = p.tmp.w[0];
                    p.a = p.tmp.w[1];
                }

        // .. module S - H - A
        if ( p.tmp.w.length === 3 )
            if ( !p.tmp.w[0].includes( "class" ) )
                if
                (
                    p.tmp.w[2].includes( "مِثْل" ) ||
                    p.tmp.w[2].includes( "رَوَى" ) ||
                    p.tmp.w[2].includes( "رَوَاهُ" ) ||
                    p.tmp.w[2].includes( "يَأْتِي" )
                )
                    if ( p.tmp.w[1].includes( "hadith" ) ) {
                        p[0] = p.tmp.w[0];
                        p.a = p.tmp.w[1];
                        p[9] = p.tmp.w[2];
                    }

        // .. module 3: x H x
        if ( p.tmp.w.length === 3 )
            if ( !p.tmp.w[0].includes( "class" ) && !p.tmp.w[2].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) ) {
                    p[0] = p.tmp.w[0];
                    p.a = p.tmp.w[1];
                    p[9] = p.tmp.w[2];
                }

        // ! check again : 1877
        // .. module S - H - Q - H
        if ( p.tmp.w.length === 4 ) {
            if ( !p.tmp.w[0].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) && p.tmp.w[3].includes( "hadith" ) ) 
                    if ( p.tmp.w[2].includes("Q") ) {
                        p[0] = p.tmp.w.splice(0,1)[0];
                        p.a = p.tmp.w.join( " " );
                    }
        }
        // .. module S - H - S - A
        if ( p.tmp.w.length === 4 ) {
            if ( !p.tmp.w[0].includes( "class" ) && !p.tmp.w[2].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) && p.tmp.w[3].includes( "hadith" ) ) 
                    if ( !p.tmp.w[2].includes("Q") ) {
                        p[0] = p.tmp.w[0];
                        p.a = p.tmp.w[1];
                        p[9] = p.tmp.w[2] + " " + p.tmp.w[3];
                    }
        }

        // ! .. control by hand: 7851 7859
        let cdnBox_1 = [ 
            473,574,681,688,1143,1298,1791,3175,3186,3236,3558,3598,3831,
            4177,4222,4790,4800,4977,5387,5390,6129,6287,6750,6822,7106,
            7310,7421,7851,8286,8292,8987,8997,9168,9171,9757,9772,9775,
            9876,9980,10155,12263,16358,18100,7117,16548,16846,18608,
            22235
        ];

        if ( cdnBox_1.includes( Number(p.d) ) ) {
            p[0] = p.tmp.w.splice(0,1).join( " " );
            p.a = p.tmp.w.splice(0,1).join( " " );
            p[9] = p.tmp.w.join( " " );
        };

        let cdnBox_2 = [
            91,108,214,325,343,730,845,957,1096,1106,1111,1125,1137,1194,
            1264,1301,1355,1359,1363,1425,1435,1444,1563,1669,1686,1692,
            1707,1777,1784,1876,1877,1987,2098,2177,2188,2328,2348,2360,
            2374,2405,2467,2514,2516,2529,2559,2560,2568,2653,2671,2911,
            2978,3003,3074,3093,3098,3122,3125,3132,3148,3222,3252,3400,
            3428,3449,3455,3509,3536,3559,3579,3627,3669,3704,3951,4202,
            4360,4746,5016,5130,5337,5576,5870,6098,6200,6260,6569,7082,
            7084,7201,7264,7372,7521,7554,7560,7690,7918,8116,8174,8308,
            8432,8497,8524,8669,8744,8815,8842,8888,10027,10073,10121,
            11152,11160,11519,11674,11741,11804,11876,11914,11930,12182,
            12193,12232,12293,12295,12313,12738,12751,12752,12769,12778,
            12830,12846,12911,12987,13015,13069,13138,13159,13208,13238,
            13217,13146,13125,13115,13376,13388,13401,13422,13463,13481,
            13512,13527,13528,13541,13544,13558,13567,13578,13588,13592,
            13623,13627,13629,13633,13639,14328,14339,14437,14516,14529,
            14563,14662,14695,14703,14724,14908,15119,15198,15342,15974,
            16350,16384,16416,16621,16658,16687,16856,17362,17908,17919,
            17924,17933,17955,18039,18080,18083,18092,18095,18127,18128,
            18143,18183,18203,18207,18217,19134,19306,19553,19593,19627,
            19634,19651,19652,19695,19733,19947,19986,20052,20199,20213,
            20260,20266,20303,20383,20385,20491,20515,20518,20776,20796,
            20815,21100,21482,21601,22005,22233,22439,22607,22728,
            13283,7093,7095,7442,7859,12649,12931,12954,12963,12965,
            13079,13224,13283,13342,13351,13366,13488,13668,13671,13674,
            13685,13686,13689,13699,13707,13731,13753,13761,13762,13833,
            13837,13895,13945,13947,13954,14043,14202,14244,14252,14263,
            14269,14277,14281,14285,14303,15587,19355,19940,
        ];

        if ( cdnBox_2.includes( Number(p.d) ) ) {

            // .. check structure
            for ( let i=0; i<p.tmp.w.length; i++ ) {
                if ( i%2 ) {
                    if ( !p.tmp.w[i].includes( "hadith" ) )
                        console.log(p.d);
                }
                else {
                    if ( p.tmp.w[i].includes( "hadith" ) )
                        console.log(p.d);
                }
            }

            let tmpCnt: TS.db_item[] = [];
            let tmpBox: string[] = [];
            let tmpItem: TS.db_item = {} as any;
            let cdx = 1;
            while ( p.tmp.w.length ) {
                tmpBox = [];
                tmpBox = p.tmp.w.splice(0,2);
                if ( tmpBox.length === 1 ) {
                    tmpCnt[ tmpCnt.length -1 ][9] = tmpBox[0]; 
                }
                else {
                    tmpItem = JSON.parse( JSON.stringify(p) );
                    tmpItem.d += " - " + cdx;
                    tmpItem[0] = tmpBox[0];
                    tmpItem.a = tmpBox[1];
                    tmpCnt.push( tmpItem );
                }
                cdx++;
            }

            container[ p.d ] = tmpCnt;

        };

    }

    // .. replace container with each cell of cdnBox_2
    for( let p of Object.keys( container ) ) {
        db.splice( db.findIndex( x => x.d === p ), 1, ...container[p] )
    }

    return db.filter( x => x.a );

}

// .. ====================================================================

function preview_1 ( text: string ) {

    let header = "<!DOCTYPE html><html><head>"+
    '<link rel="stylesheet" type="text/css" href="main.css" />'+
    "</head><body>";

    storage.saveTMP( header + text , "html" );

}

// .. ====================================================================

export function resource_update () {

    let db_Path = "db/" + name + ".json";

    try { fs.mkdirSync( tmpFolder ) } catch {}
    try { db = JSON.parse( fs.readFileSync( db_Path, 'utf8' ) ) } catch {}
    try { R  = JSON.parse( fs.readFileSync( R_Path,  'utf8' ) ) } catch {}

}

// .. ====================================================================

