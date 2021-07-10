import * as tools                       from "./tools";
import * as report                      from "./logger"
import * as TS                          from "../types/types";
import * as WS                          from "worker_threads";
import * as storage                     from "./storage";
import * as basic_tools                 from "./basic_tools";
import * as fs                          from "fs";
import * as server_الكافي                  from "../server/الكافي";
import * as server_وسائل_الشيعة             from "../server/وسائل‌الشيعة";
import * as server_نهج_البلاغة              from "../server/نهج‌البلاغة";

// .. ====================================================================

export function some_edits ( str: string ) {

    for ( let e of basic_tools.erabs ) {
        let regx = new RegExp( " " +e, "g" );
        str = str.replace( regx, e );
    }

    str = str.replace( / ‌/g, " " );
    str = str.replace( /ـ/g , "" );
    str = str.replace( /–/g , "-" );
    str = str.replace( /&nbsp;/g , " " );
    str = str.replace( / +/g, " " );

    str = str.replace( /\.\.\.\.\.+/g, "....." );
    str = str.replace( /\.\.\.\.\./g, " " );
    str = str.replace( /\[\.\.\.\]/g, " " );
    str = str.replace( /\. \. \./g, " ... " );
    str = str.replace( / +/g, " " );
    str = str.replace( /\.\. \./g, " ... " );
    str = str.replace( / +/g, " " );
    str = str.replace( /، +/g, "،" );
    str = str.replace( / +،/g, "،" );
    str = str.replace( / ، /g, "،" );
    str = str.replace( /،/g, " ، " );
    str = str.replace( /،  ،/g, " ، " );
    str = str.replace( /، +/g, "،" );

    str = str.replace( /«/g, " « " );
    str = str.replace( /»/g, " » " );
    str = str.replace( /،/g, " ، " );
    str = str.replace( /؛/g, " ؛ " );
    str = str.replace( /:/g, " : " );
    str = str.replace( /\./g, " . " );
    str = str.replace( / +/g, " " );
    str = str.trim();

    str = str.replace( /عَزَّوَجَلَّ/g, " عزوجل " );
    str = str.replace( /عَزَّ وجَلَّ/g, " عزوجل " );
    str = str.replace( /جَلَّ وعَزَّ/g, " عزوجل " );
    str = str.replace( /عز وجل/g, " عزوجل " );
    str = str.replace( /عَزَّ وَجَلَّ/g, " عزوجل " );
    str = str.replace( /عَزَّ وَجَلَ/g, " عزوجل " );
    str = str.replace( /عَزّ وَجَلَّ/g, " عزوجل " );
    str = str.replace( /عَزَّ وجلَّ/g, " عزوجل " );
    str = str.replace( /عَزَّ وَ جَلَّ/g, " عزوجل " );
    str = str.replace( /عز و جل/g, " عزوجل " );
    str = str.replace( /عزَّ وَ جَلَّ/g, " عزوجل " );
    str = str.replace( /عزّوجلّ/g, " عزوجل " );
    str = str.replace( /عَزَّوجلَّ/g, " عزوجل " );
    str = str.replace( /عَزَّوَ جَلَّ/g, " عزوجل " );
    str = str.replace( /عَزَّوَجلَّ \.\.\./g, " عزوجل " );
    str = str.replace( /تَبَارَكَ وَتَعَالى/g, " عزوجل " );
    str = str.replace( /تَبَارَكَ اسْمُهُ/g, " عزوجل " );

    str = str.replace( /\(ص\)/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلی الله علیه وآیه/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلی الله علیه وآله/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلّي الله عليه و آله/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلی الله علیه و آله/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلى اللّه عليه و آله/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلى الله عليه و آله/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صَلَّى اللَّهُ عَلَيْهِ وَ سَلَّمَ/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلی الله علیه و آله و سلم/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صَلَّى اللَّهُ عَلَيْهِ وَ آلِهِ وَ سَلَّمَ/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /صلّى اللّه عليه و آله و سلّم/g, " صلى‌الله‌عليه‌وآله‌وسلم " );

    str = str.replace( /علیه‏ السلام/g, " عليه‌السلام " );
    str = str.replace( /عليه السلام/g, " عليه‌السلام " );
    str = str.replace( /علیه السلام/g, " عليه‌السلام " );
    str = str.replace( /علیه السّلام/g, " عليه‌السلام " );
    str = str.replace( /صَلَوَاتُ اللهِ عَلَيْهِمْ أَجْمَعِينَ/g, " عليه‌السلام " );
    str = str.replace( /صَلَوَاتُ اللهِ عَلَيْهِمْ/g, " عليه‌السلام " );

    str = str.replace( /علیها السلام/g, " عليها‌السلام " );
    str = str.replace( /- عليها‌السلام -/g, " عليها‌السلام " );

    str = str.replace( /عليهما السلام/g, " عليهما‌السلام " );
    str = str.replace( /علیهماالسلام/g, " عليهما‌السلام " );
    str = str.replace( /علیهما السلام/g, " عليهما‌السلام " );

    str = str.replace( /عليهم السلام/g, " عليهم‌السلام " );
    str = str.replace( /علیهم السلام/g, " عليهم‌السلام " );
    str = str.replace( /- عليهم‌السلام -/g, " عليهم‌السلام " );

    str = str.replace( /رَحِمَهُ اللهُ/g, " رحمه‌الله " );

    str = str.replace( / +/g, " " );
    str = str.replace( /- عزوجل -/g, " عزوجل " );
    str = str.replace( /\( عزوجل \)/g, " عزوجل " );
    str = str.replace( /- صلى‌الله‌عليه‌وآله‌وسلم -/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /\( صلى‌الله‌عليه‌وآله‌وسلم \)/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    str = str.replace( /- عليه‌السلام -/g, " عليه‌السلام " );
    str = str.replace( /\( عليه‌السلام \)/g, " عليه‌السلام " );
    str = str.replace( /- عليهما‌السلام -/g, " عليهما‌السلام " );
    str = str.replace( /\( عليهما‌السلام \)/g, " عليهما‌السلام " );
    str = str.replace( /- رحمه‌الله -/g, " رحمه‌الله " );
    str = str.replace( /\( رحمه‌الله \)/g, " رحمه‌الله " );

    // str = str.replace( /\. ،/g, " ، " ).replace( /  +/g, " " );
    // str = str.replace( /\. :/g, " . " ).replace( /  +/g, " " );
    // str = str.replace( /\. \./g, " . " ).replace( /  +/g, " " );
    str = str.replace( / +/g, " " );
    str = str.trim();

    return str;

}

// .. ====================================================================

export function w_0__0 ( item: TS.db_item, idx: number ) {

    // .. concat slot 0
    item.tmp[0].push( item.tmp.w[0].slice( 0, idx ) );
    // .. concat slot a
    item.tmp.a.push( item.tmp.w[0].slice( idx ) );

    // .. remove temp w[0] slot
    item.tmp.w.shift();

    return item;

}

// .. ====================================================================

export function w_9__9 ( item: TS.db_item, idx: number ) {

    let _9ID = item.tmp.w.length -1;

    // .. concat slot 9
    item.tmp[9].unshift( item.tmp.w[ _9ID ].slice( idx ) );
    // .. remove some part of temp w[9] slot
    item.tmp.w[ _9ID ] = item.tmp.w[ _9ID ].slice( 0, idx );

    return item;

}

// .. ====================================================================

export function hrCtr ( page: string[], HR: string ) {

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

// .. ====================================================================

let R: TS.R[] = [];

export async function R_wrapper ( R_Path: string, db: TS.db ) {

    // .. return cached
    if ( fs.existsSync( R_Path ) ) {
        R = JSON.parse( fs.readFileSync( R_Path, 'utf8' ) );
        return R;
    }

    time = new Date().getTime()
    report.timer( 0, tools.fragment, time, 4 );

    // .. prepare DB
    db = tools.addTmpProps( db );

    // .. do processes synchronously
    for ( let i=0; i<tools.cpus; i++ ) R_worker( db );


    return R;

}

// .. ====================================================================

async function waiter () {
    // await new Promise( _ => setTimeout( _, 1000 ) );
    // if ( false ) return Promise.resolve();
    // else return waiter();
}
 
// .. ====================================================================

let fragged = tools.cpus;
let time: number;

function R_worker( workerData: TS.db ): Promise<TS.R[]> {

    let address = "./tools/R_worker.js";

    return new Promise( (rs, rx) => {
        const worker = new WS.Worker( address, { workerData } );
        worker.on( 'message', async r => {
            // .. concat R
            R = [ ...R, ...r ];
            if ( ~fragged && fragged < tools.fragment ) { 
                // .. report progress
                report.timer( fragged, tools.fragment, time, 4 );
                // .. new Worker
                R_worker( workerData );
                // .. counter
                fragged++;
            }
            // .. save R result
            if ( fragged === tools.fragment ) 
                storage.saveData( R, "tmp", "نهاية-R", true );
        } );
        worker.on( 'error', rx );
        worker.on( 'exit', code => {
            if ( code ) rx( new Error(`Worker stopped! ${code}`) );
        } )
    } );

}

// .. ====================================================================

export function cook ( R__: TS.R[], db: TS.db, tmpFolder: string  ) {
    // .. R => Bound
    let tmpB = tools.R2Bound( R__, db.length );
    // .. boundBoxDivider_SD
    let tmpE = tools.boundBoxDivider( tmpB );
    storage.saveData( tmpE.single, tmpFolder, "single", true );
    storage.saveData( tmpE.double, tmpFolder, "double", true );
    storage.saveData( tmpE.m_1, tmpFolder, "m_1", true );
    // .. re-do the process for remaining "m_1" ==> "m_2"
    let m_2 = tools.aggressiveClusterPeptics( tmpE.m_1, R__ );
    storage.saveData( m_2, tmpFolder, "m_2", true );
    let tmpE2 = tools.multiScatter( m_2 );
    storage.saveData( tmpE2.multi, tmpFolder, "multi", true );
    storage.saveData( tmpE2.other, tmpFolder, "other", true );
}

// .. ====================================================================

export function janitor ( tmpFolder: string ) {
    storage.saveData( null, tmpFolder, "single" );
    storage.saveData( null, tmpFolder, "double" );
    storage.saveData( null, tmpFolder, "multi" );
    storage.saveData( null, tmpFolder, "other" );
    storage.saveData( null, tmpFolder, "m_1" );
    storage.saveData( null, tmpFolder, "m_2" );
}

// .. ====================================================================

export async function getFinalR ( db: TS.db ) {
    let tmpFolder = "tmp/";
    let final_name = "نهاية";
    let final_path = tmpFolder + final_name + "-R.json";
    let final_R = await R_wrapper( final_path, db );
    return final_R;
}


// .. ====================================================================

export async function db_db ( db: TS.db, R: TS.R[] ) {

    let tmpFolder = "tmp/";
    // .. search for optimizing
    cook( R, db, tmpFolder );
    // .. check result
    await tools._db_check_( tmpFolder, db );
    // .. get relations in one BIG DB
    db = tools.relation_definer( tmpFolder, db );
    // .. save DBs | divide them ***
    let n1 = server_الكافي.db.length; let c1 = n1;
    let n2 = server_وسائل_الشيعة.db.length; let c2 = n1 + n2;
    let n3 = server_نهج_البلاغة.db.length; let c3 = n1 + n2 + n3;
    storage.saveData( db.slice( 0,  c1 ), "db", server_الكافي.name );
    storage.saveData( db.slice( c1, c2 ), "db", server_وسائل_الشيعة.name );
    storage.saveData( db.slice( c2, c3 ), "db", server_نهج_البلاغة.name );

    // .. clean the tmpFolder
    janitor( tmpFolder );

}

// .. ====================================================================

