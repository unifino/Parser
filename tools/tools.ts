import * as TS                          from "../types/types";
import * as basic_tools                 from "./basic_tools";
import * as storage                     from "./storage";
import * as report                      from "./logger"
import * as OS                          from "os";

// .. ====================================================================

export let cpus = OS.cpus().length;
export let fragment = 100;

// .. ====================================================================

export function do_charSpacer ( db: TS.db ): void  {
    for ( let cell of db ) {
        cell.a = basic_tools.charSpacer( cell.a );
        cell.b = basic_tools.charSpacer( cell.b );
        if ( typeof cell.d === "string" ) 
            cell.d = basic_tools.charSpacer( cell.d );
    }
}

// .. ====================================================================

export function addTmpProps ( db: TS.db ) {

    let tmp_1: string;
    let tmp_2: string[];

    for ( let cell of db ) {
        if ( !cell.tmp ) cell.tmp = {} as any;
        tmp_1 = basic_tools.inFarsiLetters( cell.a );
        cell.tmp.inFarsiLetter = basic_tools.cutSomePhrases( tmp_1 );
        tmp_2 = cell.tmp.inFarsiLetter.split( " " );
        cell.tmp.kalamat = basic_tools.deleteSomeWords( tmp_2 );
    }

    return db;

}

// .. ====================================================================

export async function R ( item: TS.db_item, reference: TS.db ) {

    let R: TS.R[] = [],
        r: TS.R;

    for ( let x of reference ) {
        r = R_Calc( item, x );
        if ( r ) {
            if ( r[2] > 55 )
                R.push( r );
        }
        else await trap( "ERR!:  R Calc." );
    }

    return R;

}


// .. ====================================================================

export async function R_Searcher ( item: TS.db_item, reference: TS.db, deep: boolean ) {

    let R: TS.R[] = [],
        r: TS.R;

    for ( let x of reference ) {
        r = R_Calc( item, x );
        if ( r ) {
            if ( r[2] === 100 ) return [r];
            if ( deep && r[2] > 80 ) R.push( r );
        }
        else await trap( "ERR!:  R Calc." );
    }

    return R;

}

// .. ====================================================================

function R_Calc ( A: TS.db_item, X: TS.db_item ): TS.R {

    // .. critical error
    if ( typeof A.n !== "number" || typeof X.n !== "number" ) return;

    let partsA = A.tmp.kalamat.slice(0);
    let partsX = X.tmp.kalamat.slice(0);
    let totalParts = partsA.length + partsX.length;
    // .. preserve match_c info
    let match_C = (partsA.length>=5 && partsX.length>=5) ? 
        partsA.length - partsX.length : 0;
    if ( match_C < 0 ) match_C *= -1;

    // .. trimming by A on (X and A)
    pAOX( partsA, partsX );
    partsA = partsA.filter( a => a );

    let totalRemains = partsA.length + partsX.length;

    // .. match_c meets not the condition
    // ! define distance if ( partsA.length > 3 && partsX.length > 3 ) 
    match_C = 0;
    // .. calculate final matched value
    match_C += totalParts - totalRemains;

    let correlationRate = ( match_C / totalParts )*100;

    let r: TS.R = [ A.n, X.n, (correlationRate*100|0)/100 ];

    return r;

}

// .. ====================================================================

function pAOX ( A: string[], X: string[] ) {

    let found: number;

    for ( let i=0; i<A.length; i++ ) {
        found = X.findIndex( x => x === A[i] );
        if ( ~found ) {
            X.splice( found, 1 );
            delete A[i];
        }
    }

}

// .. ====================================================================

export function R_optimizer ( data: TS.R[], min: number ) {

    // .. not a-a situation + r > min ( ?50 )
    data = data.filter( x => x[0] !== x[1] && x[2] > min );
    // .. sort by R
    data.sort( (a,x) => x[2] > a[2] ? 1 : -1 );
    // .. put a,b,R <== a<b
    data = data.map( x => [ x[0]>x[1] ? x[1]:x[0], x[0]>x[1] ? x[0]:x[1], x[2]] );

    // .. condition defined
    function cnd ( x, a: [number, number, number] ) {
        return x[0] === a[0] && x[1] === a[1] && x[2] === a[2];
    }
    // .. remove duplicates
    data = data.reduce( ( sigma, one ) => {
        if ( !sigma.find( x => cnd( x, one ) ) ) sigma.push(one);
        return sigma;
    }, [] );

    return data;

}

// .. ====================================================================

export function R2Bound ( R: TS.R[], ref_db_length: number ) {

    let boundBox: TS.boundBox = [],
        a: number,
        b: number;

    report.notify( "R => Bound" );

    for ( let p of R ) {

        a = p[0];
        b = p[1];
        if ( boundBox[a] ) boundBox[a].push(b);
        else boundBox[a] = [b];
        if ( boundBox[b] ) boundBox[b].push(a);
        else boundBox[b] = [a];

    }

    for ( let p of boundBox ) p = [ ...new Set(p) ];

    return boundBox;

}

// .. ====================================================================

export function boundBoxDivider( boundBox: TS.boundBox ) {

    let single: TS.s = [],
        double: TS.d = [],
        other: TS.m = [],
        m_1: TS.ClusterBox,
        child: number;

    // .. get singles
    for ( let i in boundBox ){
        if ( boundBox[i].length === 0 ) {
            single.push( Number(i) );
            delete boundBox[i];
        }
    }
    // .. get doubles
    for ( let i in boundBox ) {
        if ( boundBox[i] ) {
            if ( boundBox[i].length === 1 ) {
                child = boundBox[i][0];
                if ( boundBox[ child ] && boundBox[ child ].length === 1 ) {
                    if ( boundBox[ child ][0] === Number(i) ) {
                        double.push( [ Number(i), child ] );
                        delete boundBox[i];
                        delete boundBox[ child ];
                    }
                }
            }
        }
    }

    for ( let i in boundBox ) 
        if ( boundBox[i] )
            other.push( [ Number(i), ...boundBox[i] ] );


    m_1 = simpleClusterPeptics ( other );

    // .. report
    return {
        single: single,
        double: double,
        m_1: m_1,
    };

}

// .. ====================================================================

export function multiScatter( multiBox: TS.boundBox ) {

    let clusterBox: TS.ClusterBox = [],
        other: TS.m = []

    // .. get singles
    for ( let row of multiBox )
        if ( row.length === 0 ) 
            console.log("ERROR!");

    if ( clusterBoxRealLengthReport( multiBox ).diff ) {
        console.log( "ERROR!!" );
        return;
    }

    for ( let i in multiBox ) {
        if ( multiBox[i].length <= 14 ) {
            clusterBox.push( multiBox[i] );
            delete multiBox[i];
        }
    }

    multiBox = multiBox.filter( x => x );

    return {
        multi: clusterBox,
        other: multiBox
    }

}

// .. ====================================================================

function multiUnifier ( raw_multi:TS.ClusterBox ) {
    // .. remove duplicates
    let tmp_01: string[] = [];
    let multiples: TS.ClusterBox = [];
    // .. sort and stringify
    for ( let line of raw_multi ) 
        tmp_01.push( line.sort( (a,b) => a>b ? 1:-1 ).join(":") )
    let tmp_02: string[] = [ ...new Set(tmp_01) ];
    for ( let line of tmp_02 ) multiples.push( line.split(":").map( x => Number(x) ) );
    return multiples;
}

// .. ====================================================================

function simpleClusterPeptics ( other: TS.ClusterBox ) {

    let oneCluster: TS.Cluster = [],
        clusterBox: TS.ClusterBox = [],
        time = new Date().getTime(),
        c = 0,
        total = other.length;

    report.notify( "Simple Cluster Peptic" );

    for ( oneCluster of other ) {

        report.timer( c, total, time );

        oneCluster = [ ...new Set( oneCluster ) ];
        clusterBox.push( oneCluster );
        c++;

    }

    return multiUnifier( clusterBox );

}

// .. ====================================================================

export function aggressiveClusterPeptics ( m_1: TS.ClusterBox, R: TS.R[] ) {

    let clusterBox: TS.ClusterBox = [],
        time = new Date().getTime();

    // .. unify multiDB
    let uni = []
    for ( let r of m_1 ) uni = [ ...uni, ...r  ];
    uni = [ ...new Set(uni) ];

    report.notify( "Advance Cluster Peptic " );

    for ( let i in uni ) {

        if ( !(Number(i) % 300) ) report.timer( Number(i), uni.length, time );

        clusterBox.push( cluster( uni[i], R ) );

    }

    return multiUnifier( clusterBox );
}

// .. ====================================================================

export function cluster ( start: number, r: TS.R[] ) {

    let hand = [ start ];
    let cluster: TS.Cluster = [];

    while ( hand.length ) {
        for ( let i=0; i<r.length; i++ ) {
            if ( r[i][0] === hand[0] || r[i][1] === hand[0] ) {
                hand.push( r[i][0], r[i][1] );
            }
        }
        hand = [ ... new Set(hand) ];
        cluster.push( hand[0] );
        hand.shift();
        hand = hand.filter( x => !cluster.includes(x) );
    }

    return cluster;

}

// .. ====================================================================

function getPepticR ( peptic: TS.ClusterBox, R: TS.R[] ) {
    let patients = [];
    for ( let r of peptic ) patients = [ ...patients, ...r  ];
    let pR = R.filter( x => patients.includes(x[0]) && patients.includes(x[1]) );
    return pR;
}

// .. ====================================================================

function clusterBoxRealLengthReport ( db: TS.ClusterBox, tag?: string ) {

    let t = [],
        report: TS.Repo = {} as any;

    for ( let r of db ) t = [ ...t, ...r  ];
    report.any = t.length;
    t = [ ...new Set(t) ];
    report.uniqe = t.length;
    report.diff = report.any - report.uniqe;

    if ( tag ) {
        if ( report.diff ) console.log( tag,"\t",report );
        else console.log( tag,"\t",report.any );
    }

    report.seq = t;
    return report;

}

// .. ====================================================================

function checkPresents ( src: TS.db, s: TS.s, d: TS.d, m: TS.m ) {

    let mix = [],
        tmp = [];

    mix = [ ...mix, ...s ];
    for ( let x of d ) tmp = [ ...tmp, ...x  ];
    mix = [ ...mix, ...tmp ];
    for ( let x of m ) tmp = [ ...tmp, ...x  ];
    mix = [ ...new Set( [ ...mix, ...tmp ] ) ];

    return mix.length === src.length;

}

// .. ====================================================================

export async function _db_check_ ( tmpFolder: string, db: TS.db ) {

    report.notify( "Cook Results" );

    let files = storage.getParts( tmpFolder );

    let s = files.single.length;
    // .. clear line
    console.log( "\n\n             " );
    console.log( "\nsingle", "\t", s );
    let d = clusterBoxRealLengthReport( files.double, "double" );
    let m = clusterBoxRealLengthReport( files.multi, "multi" );
    let o = clusterBoxRealLengthReport( files.other, "other" );
    let t = s + d.any + m.any + o.any;

    // .. trap the script
    if ( !db.length === t ) trap( "ERROR! : CSxRV : " + db.length );

}

// .. ====================================================================

function cluster_info ( clusterBox: TS.ClusterBox, ref_db: TS.db ) {

    let tmp: TS.ClusterInfo,
        box: TS.ClusterInfoBox;

    box = clusterBox.map( cluster => {

        tmp = [];

        for ( let p of cluster ) {
            tmp.push( {
                id_in_book: p,
                index_in_db: ref_db.findIndex( x => x.n === p ),
                length: ref_db.find( x => x.n === p ).a.length
            } );
        }
        return tmp;

    } );

    return box;

}

// .. ====================================================================

function head_cluster ( row: TS.ClusterInfo ) {

    let head = row.reduce( (lastSelected,nextOne) => {

        // .. _1 is Kafi
        if ( ~nextOne.index_in_db && nextOne.index_in_db <= 15413 ) {
            // .. _S is also Kafi
            if ( ~lastSelected.index_in_db && lastSelected.index_in_db <= 15413 ) {
                // .. _1 is longer
                if ( nextOne.length > lastSelected.length ) return nextOne;
                // .. _1 has same length
                else if ( nextOne.length === lastSelected.length ) {
                    // .. _1 comes first
                    if ( nextOne.index_in_db <= lastSelected.index_in_db ) return nextOne;
                    // .. _1 come later
                    else return lastSelected
                }
                // .. _1 is shorter
                else return lastSelected;
            }
            // .. _S is Not Kafi
            else return nextOne;
        }
        else {
            // .. _S is Kafi
            if ( ~lastSelected.index_in_db && lastSelected.index_in_db <= 15413 ) {
                return lastSelected;
            }
            // .. _S is NOT also Kafi
            else {
                // .. _1 is longer
                if ( nextOne.length > lastSelected.length ) return nextOne;
                // .. _1 has same length
                else if ( nextOne.length === lastSelected.length ) {
                    // .. _1 comes first
                    if ( nextOne.index_in_db <= lastSelected.index_in_db ) return nextOne;
                    // .. _1 come later
                    else return lastSelected
                }
                // .. _1 is shorter
                else return lastSelected;
            }
        }

    }, { id_in_book: -1, index_in_db: -1, length: -1 } );

    return head.index_in_db;

}

// .. ====================================================================

export function relation_definer ( tmpFolder: string, db: TS.db ) {

    let files = storage.getParts( tmpFolder );

    let mix = [ ...files.double, ...files.multi ],
        rich_mix = cluster_info( mix, db ),
        idx_head: number,
        i_children: TS.ClusterInfo;

    // .. set cDB Slot
    for ( let p of db ) p.cDB = [];

    for ( let p of rich_mix ) {
        idx_head = head_cluster(p);
        i_children = p.filter( x => x.index_in_db !== idx_head );
        // .. set cDB data to Head
        db[ idx_head ].cDB = i_children.map( x => x.id_in_book );
        db[ idx_head ].cDB = [ ...new Set( db[ idx_head ].cDB ) ];
        // .. set null in cDB data fot Children
        for ( let q of i_children.map( x => x.index_in_db ) ) db[ q ].cDB = null;
    }

    // ! .. control by Hand
    rich_mix = cluster_info( files.other, db );
    let ctl = rich_mix.map( x => {
        let b=[];
        for ( let p of x ) b.push( db[p.index_in_db].a );
        return b;
    } )
    if ( ctl.length ) storage.saveData( ctl, "tmp/", "control", true );

    for ( let i in rich_mix ) {
        idx_head = head_cluster( rich_mix[i] );
        i_children = rich_mix[i].filter( x => x.index_in_db !== idx_head );
        db[ idx_head ].cDB = i_children.map( x => x.id_in_book );
        db[ idx_head ].cDB = [ ...new Set( db[ idx_head ].cDB ) ];
        for ( let q of i_children.map( x => x.index_in_db ) ) db[ q ].cDB = null;
    }

    return dbCleaner( db );

}

// .. ====================================================================

function cndMotor ( keys: string[], miscDB: TS.db ) {

    let _cnd = ( x: TS.db_item ) => {
        let state = false;
        if ( typeof x.d === "string" )
            for ( let k of keys ) 
                if ( x.d.includes(k) ) 
                    state = true;
        return state;
    }

    // .. create new Book
    let newBook = miscDB.filter( x => _cnd(x) );
    // .. trim miscDB
    miscDB = miscDB.filter( x => !_cnd(x) );

    return [ newBook, miscDB ];

}

// .. ====================================================================

function bookSaver ( books: TS.bookKeys, order: TS.source[], db: TS.db ) {

    let newBook: TS.db,
        library: { [key in TS.source]: TS.db } = {} as any,
        keys: string[],
        miscDB: TS.db,
        mox: TS.db = [],
        summery = {},
        c = 0;

    for ( let p of order ) {
        if ( p === "الكافي" ) {
            newBook = db.filter( (x,i) => i<14647 );
            // .. assign source of Kafi
            for ( let p of newBook ) 
                if ( typeof p.d === "number" )
                    p.d = basic_tools.arabicDigits( "الكافي، الحديث: " +p.d );
            miscDB = db.filter( (x,i) => i>=14647 );
        }
        else if ( p !== "متفرقه" ) {
            keys = books[ p ];
            [ newBook, miscDB ] = cndMotor ( keys, miscDB );
        }
        else {
            newBook = miscDB;
        }
        library[ p ] = newBook;
        mox = [ ...mox, ...newBook ];
    }

    // ! IMPORTANT .. SAVE MOX REFERENCE FILE
    // .. get last n
    let n = mox.reduce( (n,x) => { if( x.n && x.n > n ) n = x.n; return n }, 0 );
    // .. allocate new N index
    for ( let i=0; i<mox.length; i++ ) if ( !~mox[i].n ) mox[i].n = n++ +1;
    storage.saveData( mox, "db/base", "mox" );
    // ! IMPORTANT .. SAVE MOX REFERENCE FILE

    // .. summery
    for ( let title of Object.keys( library ) ) {
        c += library[ title ].length;
        summery[ "$ Book " + title + " is "] = library[ title ].length;
    }

    console.table( summery );
    console.table( { passed: c === db.length ? "Yes" : ("No" + (c - db.length)) }  );

    // .. save books
    for ( let p of order ) {
        storage.saveData( library[p], "db/ready", p );
        storage.saveData( library[p], "../Moshaf/db/H/", p );
    }

}

// .. ====================================================================

function dbExporter ( db: TS.db ) {

    let order: TS.source[],
        keys: string[],
        keysBox: { [key in TS.source]: string[] } = {} as any ;

    keys = [ "نهج الفصاحه","نهج الفصاحة" ];
    keysBox[ "نهج‌الفصاحة" ] = keys;

    keys = [ "نهج البلاغه","نهج‌البلاغه","نهج‌ البلاغه","شرح نهج البلاغة","نهج البلاغة","نهج البلاغ" ];
    keysBox[ "نهج‌البلاغة" ] = keys;

    keys = [ "غررالحکم","غرر الحکم","غرر الحكم","غررالحكم","منتخب الغرر","منتخاب الغرر","شرح غرر" ];
    keysBox[ "غررالحکم" ] = keys;

    keys = [ "كنز العمّال","كنزالعّمال","كنز العمال","کنز العمّال","کنز العمال","کنزالعمال","کنزالعمّال","کنزالعمّال","کنز العال","کنزل العمّال","كنزالعمال","كنزالعمّال"];
    keysBox[ "كنز‌العمّال" ] = keys;

    keys = [ "بحار الأنوار","بحارالأنوار","بحارالانوار","في البحار","بحار الانوار","البحار :","نقل از بحار","بحارالانور" ];
    keysBox[ "بحار‌الأنوار" ] = keys;

    keys = [ "تحف العقول" ];
    keysBox[ "تحف‌العقول" ] = keys;

    keys = [ "وسائل الشيعه", "وسائل الشیعه", "وسائل الشیعة", "وسائل الشّیعه" ];
    keysBox[ "وسائل‌الشيعه" ] = keys;

    order = [
        "الكافي",
        "نهج‌الفصاحة",
        "نهج‌البلاغة",
        "غررالحکم",
        "كنز‌العمّال",
        "تحف‌العقول",
        "بحار‌الأنوار",
        "وسائل‌الشيعة",
        "متفرقه"
    ];

    bookSaver ( keysBox, order, db );

}

// .. ====================================================================

// function finalEditor ( db: TS.db ) {

//     for ( let p of db ) {

//         if ( p.a ) {
//             p.a = basic_tools.arabicDigits( p.a );

//             if ( p.b ) {
//                 p.b = basic_tools.arabicDigits( p.b );
//             }
//             if ( typeof p.d === "string" ) {
//                 p.d = basic_tools.arabicDigits( p.d );
//             }
//         }

//     }

//     return db;

// }

// .. ====================================================================

// function newDBConverter ( newDB: TS.newDB ) {
//     let db: TS.db = [];
//     db = newDB.map( (x,j) => {
//         return { 
//             a: x.a,
//             b: x.b,
//             c: x.c || null,
//             d: x.d || null,
//             n: -1,
//             tmp_kalamat: null,
//             tmp_inFarsiLetter: null,
//             j: j,
//             cDB: null
//         }
//     } );
//     return db;
// }

// .. ====================================================================

export function dbCleaner ( db: TS.db ) {

    for ( let p of db ) delete p.tmp;
    return db;

}

// .. ====================================================================

async function trap ( msg: string ) {
    report.notify( msg );
    report.notify( null, true );
    await new Promise( () => {} );
}

// .. ====================================================================

export function n_allocation ( db: TS.db, n_pad: number ) {
    for ( let p of db ) p.n = n_pad++;
    return n_pad;
}

// .. ====================================================================
