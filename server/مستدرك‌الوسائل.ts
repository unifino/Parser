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
    // .. last editor
    db = editor_1( db );
    db = editor_2( db );
    db = editor_1( db );
    // .. N allocation
    n_pad = tools.n_allocation( db, n_pad );
    // .. d allocation
    db = d_allocator( db );
    // .. create and save DBs
    storage.saveData( db, "tmp/مستدرك‌الوسائل", "مستدرك‌الوسائل" );
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

        // .. merge Books as Source
        textBook += " " + readSrcBook( "source/مستدرك‌الوسائل/base-00.html" );
        // .. some internal edits
        textBook = my_some_edits( textBook );
        // ..  do some edits
        textBook = __.some_edits( textBook );
        // .. remove unwanted parted => neat
        textBook = getNeatBook( textBook );
        // .. build first db => rawDB
        let raw_db = getRawDB( textBook );
        // .. build main db
        db_v0 = hadith_db_generator( raw_db );
        // .. scatter 0-a-9
        db_v0 = a_0_9( db_v0 );
        // .. sort db
        db_v0 = sortByD( db_v0 );
        // // .. assign c code
        // db_v0 = c_allocator( db_v0 );
        // // .. provide a preview for checking
        // preview_1( tmpProvider_1( db_v0 ) );

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

function my_some_edits ( textBook: string ) {

    let q = textBook.match( /<span class="fm">(.*?)<\/span>/g ) || [];
    console.log(q.length);
    let i  = 0;
    let time= new Date().getTime();
    for ( let c of q ) {
        if ( !(i%100)) report.timer(i,q.length,time,5); i++;
        let r = c;
        r = r.replace( "<span class=\"fm\">", " " );
        r = r.replace( "<\/span>", " " );
        textBook = textBook.replace( c, r );
    }
    console.log("done");

    return textBook;

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
        r = r.replace( "<span class=\"quran\">", " |Q| " );
        r = r.replace( "<\/span>", " |/Q| " );
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

    // ! ]
    // ! [
    // ! |Q| & in 0
    // ! check: 173 610...q | 1040 ...q
    // ! check again : 1877
    // ! class="sher": 7563,9199,9208,13091,14673,14796,18435,20368,

    let container: { [key: string]: TS.db_item[] } = {};
    let cdnBox_pre: number[];
    let tmpCnt: TS.db_item[];
    let tmpBox: string[];
    let tmpItem: TS.db_item;
    let cdx = 1;

    for( let p of db ) {

        // .. module A-0 : merge-all
        cdnBox_pre = [12055,666];
        if ( cdnBox_pre.find( x => x === Number(p.d) ) ) {
            p[0] = p.tmp.w.join( " " );
            p.a = "";
            p.tmp.w = [];
        }
        // .. module A-1 : merge-all
        cdnBox_pre = [42];
        if ( cdnBox_pre.find( x => x === Number(p.d) ) ) {
            p.a = p.tmp.w.join( " " );
        }
        // .. module A-2 : 0 as a
        cdnBox_pre = [7049,7054,12500,12502,14066,2692,2161];
        if ( cdnBox_pre.find( x => x === Number(p.d) ) ) {
            p.a = p.tmp.w[0];
        }
        // .. module A-3 : مِثْل as 0
        else if ( p.tmp.w.length === 1 ) {
            cdnBox_pre = [
                18325,18550,23041,18571,18777,18876,18939,8818,10042,
                16539,1219,
            ];
            if
            (
                p.tmp.w[0].includes( "مِثْل" ) || 
                p.tmp.w[0].includes( "أَيْضاً" ) ||
                cdnBox_pre.find( x => x === Number(p.d) )
            )
            {
                p[0] = p.tmp.w[0];
                p.a = "";
            }
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
        // ! check 602,1270,7535,8808,9556,12352,13404,13413,13443,14372,
        // ! 14670,14904,18046 HinS,20541,22238,
        if ( p.tmp.w.length === 4 ) {
            cdnBox_pre = [
                443,465,466,927,1679,2173,2929,2973,3654,4177,4208,4298,
                4353,4358,4479,4670,4713,4793,4806,4855,4957,4978,5240,5279,
                5299,5301,5376,5571,6284,6519,6604,6674,6718,6741,6818,6860,
                6868,6962,7005,7019,7068,7139,7177,7402,7465,7645,7933,8025,
                8188,8450,8503,8682,8880,8991,9024,9048,9264,
                9314,9359,9391,9698,
                10147,10234,10387,10682,10881,10886,10942,11370,11915,12002,
                12073,12102,12134,12199,12227,12257,12467,12672,12928,13164,
                13210,13221,13249,13495,13521,13611,13622,13832,13925,14322,
                15192,15440,16117,16169,16232,16298,16351,16420,16550,16650,
                16661,16686,16704,17027,17420,17508,17537,17541,17907,18048,
                18113,18215,19123,19398,19502,19693,19777,19850,20181,20271,
                20561,20594,20875,20901,20925,20954,21281,21365,21367,21387,
                21669,21752,21822,22048,22402,22813,22815,22825,23109,22337
            ];
            if ( !p.tmp.w[0].includes( "class" ) && !p.tmp.w[2].includes( "class" ) )
                if ( p.tmp.w[1].includes( "hadith" ) && p.tmp.w[3].includes( "hadith" ) ) {
                    if ( !p.tmp.w[2].includes("Q") ) {
                        if ( cdnBox_pre.find( x => x === Number(p.d) ) ) {
                            p[0] = p.tmp.w[0];
                            p.a = p.tmp.w[1];
                            p[9] = p.tmp.w[2] + " " + p.tmp.w[3];
                        }
                        else {
                            // .. preparation
                            tmpCnt = [];
                            // .. part 1
                            tmpBox = p.tmp.w.splice(0,2);
                            tmpItem = JSON.parse( JSON.stringify(p) );
                            tmpItem.d += " - " + 1;
                            tmpItem[0] = tmpBox[0];
                            tmpItem.a = tmpBox[1];
                            tmpCnt.push( tmpItem );
                            // .. part 2
                            tmpBox = p.tmp.w.splice(0,2);
                            tmpItem = JSON.parse( JSON.stringify(p) );
                            tmpItem.d += " - " + 2;
                            tmpItem[0] = tmpBox[0];
                            tmpItem.a = tmpBox[1];
                            tmpCnt.push( tmpItem );
                            // .. register
                            container[ p.d ] = tmpCnt;
                        }
                    }
                }
        }

        // .. module B : 0 as 0; 1 as a, join rest
        // ! .. control by hand: 7851 7859
        let cdnBox_1 = [ 
            473,574,681,688,1143,1298,1791,3175,3186,3236,3558,3598,3831,
            4177,4222,4790,4800,4977,5387,5390,6129,6287,6750,6822,7106,
            7310,7421,7851,8286,8292,8987,8997,9168,9171,9757,9772,9775,
            9876,9980,10155,12263,16358,18100,7117,16548,16846,18608,
            22235,1745,2853,3292,5720,6378,6967,22084,22337
        ];

        if ( cdnBox_1.find( x => x === Number(p.d) ) ) {
            p[0] = p.tmp.w.splice(0,1).join( " " );
            p.a = p.tmp.w.splice(0,1).join( " " );
            p[9] = p.tmp.w.join( " " );
        };

        // ! check : 17361,20676
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
            14269,14277,14281,14285,14303,15587,19355,19940,327,7125,
            17361,20676,21304,21337,21799
        ];

        if ( cdnBox_2.find( x => x === Number(p.d) ) ) {

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

            tmpCnt = [];
            tmpBox = [];
            tmpItem = {} as any;
            cdx = 1;
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

    // .. apply patches
    let link = "source/مستدرك‌الوسائل/patches.json";
    let patches: TS.db = JSON.parse( fs.readFileSync( link, 'utf8' ) );
    let cdnBox_after: number[] = [
        1148,1622,3154,3529,3837,4294,4799,5046,5924,7820,7878,8569,8713,
        11143,11611,13245,13429,13658,13933,14038,15459,15944,16209,19159,
        19653,19799,20220,20693,21388
    ];
    for ( let p of patches ) 
        if ( Number(p.d) ) 
            cdnBox_after.push( Number(p.d) );
    for ( let p of cdnBox_after )
        db[ db.findIndex( x => x.d === p + "" ) ].a = "remove";
    db = db.filter( x => x.a !== "remove" );
    db = [ ...db, ...patches ];

    // .. remove tmp
    for( let p of db ) delete p.tmp;

    return db;

}

// .. ====================================================================

function sortByD ( db: TS.db ) {

    let tmpDB: TS.db = [];
    let myDB: TS.db = [];
    let tmpContainer: { [key: string]: TS.db_item[] } = {};
    let itemId: number;

    tmpDB.length = 23130;

    for ( let i=1; i<tmpDB.length; i++ ) {

        itemId = db.findIndex( x => x && x.d === i.toString() );

        if ( ~itemId ) {
            tmpDB[i] = db[ itemId ];
            delete db[ itemId ];
        }

    }

    // .. rest of db
    db = db.filter( x => x );
    // .. touch cells-container
    for ( let i=1; i<23130; i++ ) if ( !tmpDB[i] ) tmpContainer[i] = [];
    // .. find dependent cells
    for ( let p of Object.keys(tmpContainer) ) {
        for ( let i=0; i<db.length; i++ ) {
            if ( db[i].d.split( " - " )[0] === p ) {
                tmpContainer[p].push( db[i] );
                delete db[i];
            }
        }
        // .. rest of db
        db = db.filter( x => x );
    }

    // .. implant data
    for ( let i=1; i<tmpDB.length; i++ ) {
        if ( tmpDB[i] ) myDB.push( tmpDB[i] );
        else myDB.push( ...tmpContainer[i] );
    }

    let c = 0;
    let d = 0;
    // .. check sorted DB
    for ( let p of myDB ) {
        // .. reset counter
        if ( p.d.split( " - " )[1] === "1" ) d = 0;
        // .. check incremental steps [main]
        if ( Number( p.d.split( " - " )[0] ) < c ) console.log(p.d);
        else c = Number( p.d.split( " - " )[0] );
        // .. check incremental steps [child]
        if ( Number( p.d.split( " - " )[1] ) < d ) console.log(p.d);
        else d = Number( p.d.split( " - " )[1] );
    }

    // .. return
    return myDB;

}

// .. ====================================================================

function editor_1 ( db: TS.db ) {

    for ( let p of db ) {
        if (p) {
            if( p[0] ) p[0] = editor_assists( p[0] );
            if( p.a ) p.a = editor_assists( p.a );
            if( p[9] ) p[9] = editor_assists( p[9] );
        }
    }

    return db;

}

// .. ====================================================================

function editor_2 ( db: TS.db ) {

    let cdn: string;

    for ( let p of db ) {
        if( p && p.a ) {
            cdn = "الْخَبَرَ";
            if ( p.a.endsWith( cdn ) ) {
                p.a = p.a.slice( 0, p.a.length - cdn.length );
                if ( p[9] ) p[9] = cdn + " " + p[9];
            }
            cdn = "إلخ";
            if ( p.a.endsWith( cdn ) ) {
                p.a = p.a.slice( 0, p.a.length - cdn.length );
                if ( p[9] ) p[9] = cdn + " " + p[9];
            }
            cdn = "الْحَدِيثَ";
            if ( p.a.endsWith( cdn ) ) {
                p.a = p.a.slice( 0, p.a.length - cdn.length );
                if ( p[9] ) p[9] = cdn + " " + p[9];
            }
        }
    }

    return db;

}

// .. ====================================================================

function editor_assists ( str: string ) {

    str = str.replace( /<span class=\"hadith\">/g, " " );
    str = str.replace( /<\/span>/g, " " );
    str = str.replace( /-/g, " - " );
    str = str.replace( /\. \./g, " ... " );
    str = str.replace( / +/g, " " );
    str = str.trim();
    if ( str.startsWith("،") ) str = str.slice(1);
    if ( str.startsWith(":") ) str = str.slice(1);
    if ( str.endsWith(":") ) str = str.slice( 0, str.length -1 );
    if ( ( str.match( /"/g ) || [] ).length === 1 ) 
        str = str.replace( '"', ' ' );
    str = str.replace( / +/g, " " );
    str = str.trim();
    str = " " + str + " ";
    str = str.replace( /\|Q\|/g, "<Q>" );
    str = str.replace( /\|\/Q\|/g, "</Q>" );
    str = str.replace( / ع /g, " عليه‌السلام " );
    str = str.replace( /\[/g, " [ " );
    str = str.replace( /\]/g, " ] " );
    str = str.replace( / ع /g, " عليه‌السلام " );
    str = str.replace( / +/g, " " );
    str = str.trim();

    return str;

}

// .. ====================================================================

function d_allocator ( db: TS.db ) {

    let parts: string[];

    for ( let p of db ) {
        parts = ( p.d as string ).split( " - " );
        if ( parts.length > 1 ) {
            parts[0] = "مستدرك‌الوسائل: الحديث " + basic_tools.arabicDigits( parts[0] );
            parts[1] = " ، القطاع " + basic_tools.arabicDigits( parts[1] );
        }
        else {
            parts[0] = "مستدرك‌الوسائل، الحديث: " + basic_tools.arabicDigits( parts[0] );
        }
        p.d = parts.join( "" );
    }

    return db;

}

// .. ====================================================================

function tmpProvider_1( tmp_db: TS.db ) {

    let tmp = "";
    for ( let p of tmp_db ) {

        tmp += "<p>";

        tmp += p.d + "\n";
        tmp += "<span class='prefix'>" + p[0] + "</span>";
        if ( p.a ) tmp += "<span class='main'>" + p.a + "</span>";
        if ( p[9] ) tmp += "<span class='suffix'>" + p[9] + "</span>";

        tmp += "</p>";

    };

    return tmp;

}

// .. ====================================================================

function tmpProvider_2( tmp_db: TS.db ) {

    let tmp = "";
    for ( let p of tmp_db ) {

        tmp += "<p>";

        tmp += p.d + "\n";

        for ( let q of p.tmp.w ) tmp += "<span>" + q + "</span>";

        tmp += "</p>";

    };

    return tmp;

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

