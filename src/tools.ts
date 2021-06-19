import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";
import * as storage                     from "./storage";

// .. ======================================================================

export function do_charSpacer ( db: TS.db ): void  {
    for ( let cell of db ) {
        cell.a = basic_tools.charSpacer( cell.a );
        cell.b = basic_tools.charSpacer( cell.b );
        if ( typeof cell.d === "string" ) 
            cell.d = basic_tools.charSpacer( cell.d );
    }
}

// .. ======================================================================

export function addTmpProps ( db: TS.db ) {

    let tmp_1: string;
    let tmp_2: string[];

    for ( let cell of db ) {
        tmp_1 = basic_tools.inFarsiLetters( cell.a );
        cell.tmp_inFarsiLetter = basic_tools.cutSomePhrases( tmp_1 );
        tmp_2 = cell.tmp_inFarsiLetter.split( " " );
        cell.tmp_kalamat = basic_tools.deleteSomeWords( tmp_2 );
    }

    return db;

}

// .. ======================================================================

export function R ( item: TS.db_item, reference: TS.db ) {

    let R: TS.R[] = [];
    for ( let x of reference ) R.push( R_Calc( item, x ) );
    return R.filter( x => x[2] > 44 );

}

// .. ======================================================================

export function R_old ( newDB: TS.db, reference: TS.db, detour: boolean ) {

    let R: TS.R[] = [],
        title = " R Calculation",
        start_time = new Date().getTime();

    for ( let i=0; i<newDB.length; i++ ) {

        timer( newDB.length, i, start_time, title );

        // .. detour mode just for same : db-db mode
        if ( detour )
            for ( let j = i+1; j < newDB.length; j++)
                R.push( R_Calc( newDB[i], newDB[j] ) );

        // .. normal | long mode
        else
            for ( let x of reference ) R.push( R_Calc( newDB[i], x ) );

        // .. memory releaser
        if ( Number(i) % 999 ) R = R.filter( x => x[2] > 30 );
    }

    return R;

}

// .. ======================================================================

export function R_Calc ( A: TS.db_item, X: TS.db_item ): TS.R {

    let partsA = A.tmp_kalamat.slice(0);
    let partsX = X.tmp_kalamat.slice(0);
    let totalParts = partsA.length + partsX.length;

    // .. trimming by A on (X and A)
    pAOX( partsA, partsX );
    partsA = partsA.filter( a => a );

    let totalRemains = partsA.length + partsX.length;
    let correlationRate = ( (totalParts - totalRemains) / totalParts )*100;

    let r: TS.R = [ A.j, X.n, (correlationRate*100|0)/100 ];

    return r;

}
// .. ======================================================================

export function R_Calc__old ( i: number, j: number, db: TS.db ): TS.R {

    let partsA = db[i].tmp_kalamat.slice(0);
    let partsX = db[j].tmp_kalamat.slice(0);
    let totalParts = partsA.length + partsX.length;

    // .. trimming by A on (X and A)
    pAOX( partsA, partsX );
    partsA = partsA.filter( a => a );

    let totalRemains = partsA.length + partsX.length;
    let correlationRate = ( (totalParts - totalRemains) / totalParts )*100;

    let r: TS.R = [ i, j, (correlationRate*100|0)/100 ];

    return r;

}

// .. ======================================================================

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

// .. ======================================================================

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

// .. ======================================================================

export function R2Bound ( R: TS.R[], length: number ) {

    let sTime = new Date().getTime(),
        boundBox: TS.boundBox = [],
        boundLine: TS.boundLine,
        a: number,
        b: number;

    for ( let i=0; i<length; i++ ) {
        if ( !(i%100) ) timer( length, i, sTime, "    R2Bound   " );
        boundLine = [];
        for ( let j=0; j<R.length; j++ ) {
            a = R[j][0];
            b = R[j][1];
            if ( a === i ) boundLine.push(b);
            if ( b === i ) boundLine.push(a);
        }
        boundBox.push( boundLine );
    }

    if ( boundBox.length !== length ) console.log( "Critical Error!" );
    else return boundBox;

}

// .. ======================================================================

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

// .. ======================================================================

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

// .. ======================================================================

export function multiUnifier ( raw_multi:TS.ClusterBox ) {
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

// .. ======================================================================

export function simpleClusterPeptics ( other: TS.ClusterBox ) {

    let oneCluster: TS.Cluster = [],
        clusterBox: TS.ClusterBox = [],
        startTime = new Date().getTime(),
        c = 0,
        total = other.length;

    for ( oneCluster of other ) {
        timer( total, c, startTime, "clusterPeptic-" );
        oneCluster = [ ...new Set( oneCluster ) ];
        clusterBox.push( oneCluster );
        c++;
    }

    return multiUnifier( clusterBox );

}

// .. ======================================================================

export function aggressiveClusterPeptics ( m_1: TS.ClusterBox, R: TS.R[] ) {

    let clusterBox: TS.ClusterBox = [],
        startTime = new Date().getTime();

    // .. unify multiDB
    let uni = []
    for ( let r of m_1 ) uni = [ ...uni, ...r  ];
    uni = [ ...new Set(uni) ];

    for ( let i in uni ) {
        timer( uni.length, Number(i), startTime, "clusterPeptic+" );
        clusterBox.push( cluster( uni[i], R ) );
    }

    return multiUnifier( clusterBox );
}

// .. ======================================================================

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

// .. ======================================================================

export function jAllocator ( kafi: TS.db, misc: TS.db ) {
    // .. allocate fromSourceID: j
    for ( let i in kafi ) {
        kafi[i].j = Number(i) +1;
    }
    for ( let i in misc ) {
        misc[i].j = Number(i) +kafi.length +1;
    }
}

// .. ======================================================================

export function getPepticR ( peptic: TS.ClusterBox, R: TS.R[] ) {
    let patients = [];
    for ( let r of peptic ) patients = [ ...patients, ...r  ];
    let pR = R.filter( x => patients.includes(x[0]) && patients.includes(x[1]) );
    return pR;
}

// .. ======================================================================

export function timer (
    length: number,
    i: number,
    startTime: number,
    title: string = "     Timer    ",
    version: string = "1.0.4",
    quality: number = null,
    dupC: number = null
) {

    let passedTime, ets,
        p_H, p_M, p_S, p_M_r, p_S_r,
        ets_H, ets_M, ets_S, ets_M_r, ets_S_r,
        dialog: string = "";

    notify( title );

    passedTime = ( new Date().getTime() - startTime ) / 1000;

    p_H = ( passedTime/3600 )|0;
    p_M = ( passedTime/60 )|0;
    p_S = ( passedTime )|0;
    p_M_r = ( ( passedTime - p_H*3600 ) /60 ) |0;
    p_S_r = ( ( passedTime - ( (p_H*3600) + (p_M_r*60) ) ) ) | 0;

    ets = ( length * passedTime / i ) - passedTime;
    ets_H = ( ets/3600 )|0;
    ets_M = ( ets/60 )|0;
    ets_S = ( ets )|0;
    ets_M_r = ( ( ets - ets_H*3600 ) /60 ) |0;
    ets_S_r = ( ( ets - ( (ets_H*3600) + (ets_M_r*60) ) ) ) | 0;
    dialog = ( (i/length ) *100 ).toFixed(2) + "%";
    if ( quality !== null ) dialog += " | QC: " + quality;
    if ( dupC !== null ) dialog += " | F: " + dupC;
    dialog += " | T: " + p_H + "°: " + p_M_r + "': " + p_S_r;
    dialog += " | ETS: " + ets_H + "°: " + ets_M_r + "': " + ets_S_r + "\"";
    console.log( dialog );

}

// .. ======================================================================

export function clusterBoxRealLengthReport ( db: TS.ClusterBox, tag?: string ) {

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

// .. ======================================================================

export function checkPresents ( src: TS.db, s: TS.s, d: TS.d, m: TS.m ) {

    let mix = [],
        tmp = [];

    mix = [ ...mix, ...s ];
    for ( let x of d ) tmp = [ ...tmp, ...x  ];
    mix = [ ...mix, ...tmp ];
    for ( let x of m ) tmp = [ ...tmp, ...x  ];
    mix = [ ...new Set( [ ...mix, ...tmp ] ) ];

    return mix.length === src.length;

}

// .. ======================================================================

export function resultValidator
(
    single: TS.s,
    double: TS.d,
    multi: TS.m,
    other: TS.m,
    db_v1: TS.db
)
{
    let s = single.length;
    console.log( "\nsingle", "\t", s );
    let d = clusterBoxRealLengthReport( double, "double" );
    let m = clusterBoxRealLengthReport( multi, "multi" );
    let o = clusterBoxRealLengthReport( other, "other" );
    let t = s + d.any + m.any + o.any;
    return db_v1.length === t;
}

// .. ======================================================================

export function cluster_info ( clusterBox: TS.ClusterBox, ref_db: TS.db ) {

    let tmp: TS.ClusterInfo,
        box: TS.ClusterInfoBox;

    box = clusterBox.map( cluster => {
        tmp = [];
        for ( let p of cluster ) 
            tmp.push( {
                id_in_book: p,
                index_in_db: ref_db.findIndex( x => x.d === p ),
                length: ref_db.find( x => x.d === p ).a.length 
            } );
        return tmp;
    } );

    return box;

}

// .. ======================================================================

export function head_cluster ( row: TS.ClusterInfo ) {

    let head = row.reduce( (lastSelected,nextOne) => {

        // .. _1 is longer
        if ( nextOne.length > lastSelected.length ) return nextOne;
        // .. _1 has same length
        else if ( nextOne.length === lastSelected.length ) {
            // .. _1 comes first
            if ( nextOne.id_in_book <= lastSelected.id_in_book ) return nextOne;
            // .. _1 come later
            else return lastSelected
        }
        // .. _1 is shorter
        else return lastSelected;

    }, { id_in_book: -1, index_in_db: -1, length: -1 } );

    return head.index_in_db;

}

// .. ======================================================================

export function 
relation_definer ( double: TS.d, multi: TS.m, other: TS.m, db_v1: TS.db ) {

    let mix = [ ...double, ...multi ],
        rich_mix = cluster_info( mix, db_v1 ),
        idx_head: number,
        i_children: TS.ClusterInfo;

    // .. set cDB Slot
    for ( let p of db_v1 ) p.cDB = [];

    for ( let p of rich_mix ) {
        idx_head = head_cluster(p);
        i_children = p.filter( x => x.index_in_db !== idx_head );
        // .. set cDB data to Head
        db_v1[ idx_head ].cDB = i_children.map( x => x.id_in_book );
        // .. set null in cDB data fot Children
        for ( let q of i_children.map( x => x.index_in_db ) ) db_v1[ q ].cDB = null;
    }

    // ! .. control by Hand
    // rich_mix = cluster_info( other, db_v1 );
    // let ttt = rich_mix.map( x => {
    //     let qqq = []
    //     for ( let p of x ) qqq.push( db_v1[p.index_in_db].a );
    //     return qqq
    // } )
    // storage.saveData( ttt, "/tmp/", "test", true);
    // head = head_cluster( rich_mix[0] );
    // children = rich_mix[0].filter( x => x.index !== head ).map( x => x.index );
    // db_v1[ head ].cDB = children.map( x => db_v1[x].d as number );
    // for ( let q of children ) db_v1.find( x => x.d === q ).cDB = null;

    return db_v1;

}

// .. ======================================================================

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

// .. ======================================================================

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
    storage.saveData( mox, "src/db/base", "mox" );
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
        storage.saveData( library[p], "src/db/ready", p );
        storage.saveData( library[p], "../Moshaf/src/db/H/", p );
    }

}

// .. ======================================================================

export function dbExporter ( db: TS.db ) {

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

// .. ======================================================================

export function notify ( title = " Server Script", end?: boolean ) {

    let pad = "        ",
        msg = "";


    if ( end ) {
        console.log( "" );
        console.timeEnd( "App Clock" );
        msg = "\n##########################################\n";
    }
    else { 
        console.clear();
        msg += "##### " + pad + title + pad + " #####";
        msg += '\n';
    }

    console.log(msg);

}

// .. ======================================================================

export function finalEditor ( db: TS.db ) {

    for ( let p of db ) {

        if ( p.a ) {
            p.a = basic_tools.arabicDigits( p.a );

            if ( p.b ) {
                p.b = basic_tools.arabicDigits( p.b );
            }
            if ( typeof p.d === "string" ) {
                p.d = basic_tools.arabicDigits( p.d );
            }
        }

    }

    return db;

}

// .. ======================================================================

export function newDBConverter ( newDB: TS.newDB ) {
    let db: TS.db = [];
    db = newDB.map( (x,j) => {
        return { 
            a: x.a,
            b: x.b,
            c: x.c || null,
            d: x.d || null,
            n: -1,
            tmp_kalamat: null,
            tmp_inFarsiLetter: null,
            j: j,
            cDB: null
        }
    } );
    return db;
}

// .. ======================================================================

export function dbCleaner ( db: TS.db ) {
    for ( let p of db ) {
        delete p.tmp_inFarsiLetter;
        delete p.tmp_kalamat;
    }
}

// .. ======================================================================
