import * as __                          from "../tools/__";
import * as server001                   from "./الكافي";
import * as server002                   from "../tmp/server_002-old";
import * as server003                   from "./server_003";
import * as storage                     from "../tools/storage";
import * as tools                       from "../tools/tools";
import * as fs                          from "fs";
import * as Path 						from "path";
import * as TS                          from "../types/types";
import * as cheerio                     from 'cheerio';
import * as basic_tools                 from "../tools/basic_tools";

// .. ====================================================================

export let tmpFolder = "db/tmp/";
export let name      = "وسائل‌الشيعة";
let list: string[] = [];
// export let tmpFolder = "db/tmp/" + name + "/";
export function resource_update () { console.log(".......") }
export let db;

// .. ====================================================================

console.clear();

export function init () {

    let db: TS.db = JSON.parse( fs.readFileSync( "db/ready/وسائل‌الشيعة.json", "utf-8" ) );
    let exp: TS.db = JSON.parse( fs.readFileSync( "db/tmp/exp.json", "utf-8" ) );

    let tmp: string;
    let item: TS.db_item;
    for ( let p of exp ) {
        tmp = p.d = basic_tools.arabicDigits( "وسائل‌الشيعة" + "، الحديث: " + p.d );
        item = db.find( x => x.d === tmp );
        if ( item ) {
            item[0] = p[0];
            item.a = p.a;
            item[9] = p[9];
        }
    }

    fs.writeFileSync( "db/ready/وسائل‌الشيعة.json", JSON.stringify( db, null, "\t") );

}

// .. ====================================================================

function main () {

    let base = fs.readFileSync( "db/tmp/base.html", "utf-8" );
    let box = base.split( "\n" );
    let mini_box: string[] = [];
    let big_box: string[][] = [];
    let $: cheerio.CheerioAPI;

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
            if ( ( p.match( /> ?[0-9]+/ ) || [] ).length ) {
                big_box.push( mini_box );
                mini_box = [];
                mini_box.push(p);
            }
            else mini_box.push(p);
        }
    }
    // .. add last item
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

    let exported = [];
    let d: number;
    let d_s: number;
    let tmp;
    let p;
    for ( let i in big_box ) {

        p = big_box[i];
        let parts0 = cheerio.load( p[0] ).text().split( "-" );
        if ( parts0.length === 3 ) {
            // .. check structure
            d = Number(parts0[0]);
            d_s = Number(parts0[1]);
            if ( isNaN(d) ) console.log( parts0[0] );
            else if ( isNaN(d_s) ) console.log( parts0[1] );
            else {
                tmp = hadith_builder(p);
                if ( tmp ) {
                    exported[ tmp.d ] = tmp;
                    delete big_box[i];
                }
                else {
                    tmp = build_patch(p);
                    if ( tmp ) {
                        exported[ tmp.d ] = tmp;
                        delete big_box[i];
                    }
                }
            }
        };

    }
    big_box = big_box.filter( x => x );
    exported = exported.filter( x => x );

    exported = fine( exported );
    // .. report
    let prog = exported.length / 35686 * 100 | 0;
    console.log( "Done:     ", exported.length );
    console.log( "Remains:  ", big_box.length );
    console.log( "Progress: ", prog + "%" );

    fs.writeFileSync( "db/tmp/exp.json", JSON.stringify( exported, null, "\t") );

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

function hadith_builder( g: string[] ) {

    let hadith: TS.db_item = {} as any;
    let parts0 = cheerio.load( g[0] ).text().split( "-" );
    let hLineId: number;
    let sLineId: number;
    let bak = g[0];

    // ! add rest of parts0
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

    // .. module 3 [ N !S! H+ ]
    if ( g.filter( x => x.includes( 'class="snd"' ) ).length === 1 ) {
        sLineId = g.findIndex( x => x.includes( 'class="snd"' ) );
        if ( sLineId === 1 ) {
            // ! aya!
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
            if ( !endH ) hadith.a += " #Q# " + cheerio.load( g[i] ).text() + " #/Q# ";
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

    g[0] = bak;
    return hadith.a ? hadith : null;

}

// .. ====================================================================

function build_patch ( g: string[] ) {

    let hadith: TS.db_item = {} as any;
    let parts0 = cheerio.load( g[0] ).text().split( "-" );
    let hLineId: number;
    let sLineId: number;
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

function patch () {

    parse();
    let file = fs.readFileSync( "db/tmp/hhh.html", "utf-8" );
    console.log(file.length);
    file = file.replace( /<span><\/span>/g, "" );
    file = file.replace( /\n/g, " " );
    file = file.replace( /<s/g, "\n<s" );
    file = file.replace( / +/g, " " );
    fs.writeFileSync( "db/tmp/hhh2.html", file );

}

// .. ====================================================================

function parse () {

	let BIG = '<head><meta charset="utf-8" /><style>body{width:700px;margin:auto;padding:50px;background-color:#2a2a2a;direction: rtl;}p,span{direction:rtl;color:#cecece;font-family:Terafik;margin:20px;padding:10px;border:gray 1px dotted;display:block;}.aya{color:#18b2e0}.hdeth{color:#8df764}.snd{color:#d87f0a}.sh3r{color:#c7324b}</style></head>';
    let LITTLE = "";
    let $: cheerio.CheerioAPI;
    let time = new Date().getTime();

    for ( let i=0; i<8; i++ ) {
        LITTLE = loader( i, "hhh" );
        LITTLE = LITTLE.replace( /<\/body> <head><\/head><body>/g, "" );
        $ = cheerio.load( trimmer2( LITTLE ) );
        $( ".RM" ).remove();
        for ( let p of $("p") ) BIG += " " + $(p).html();
    }

    fs.writeFileSync( "db/tmp/hhh.html", BIG );

	// BIG = '<head><meta charset="utf-8" /><style>body{width:700px;margin:auto;padding:50px;background-color:#2a2a2a;direction: rtl;}p,span{direction:rtl;color:#cecece;font-family:Terafik;margin:20px;padding:10px;border:gray 1px dotted;display:block;}.aya{color:#18b2e0}.hdeth{color:#8df764}.snd{color:#d87f0a}.sh3r{color:#c7324b}</style></head>';

    // for ( let i=0; i<8; i++ ) {
    //     LITTLE = loader( i, "xxx" );
    //     LITTLE = LITTLE.replace( /<\/body> <head><\/head><body>/g, "" );
    //     $ = cheerio.load( LITTLE );
    //     for ( let p of $("p") ) BIG += " " + $(p).html();
    // }

    // fs.writeFileSync( "db/tmp/xxx.html", BIG );

}

// .. ====================================================================

function loader ( num: number, type:"xxx"|"hhh" ) {
    return fs.readFileSync( "db/tmp/" + type + "_" + num + ".html", "utf-8" );
}

// .. ====================================================================

function pre_init () {

    let html = "";
    let $: cheerio.CheerioAPI;
	let bigHTML = '<head><meta charset="utf-8" /><style>body{width:700px;margin:auto;padding:50px;background-color:#2a2a2a;direction: rtl;}p,span{direction:rtl;color:#cecece;font-family:Terafik;margin:20px;padding:10px;border:gray 1px dotted;display:inline-block;}.aya{color:#18b2e0}.hdeth{color:#8df764}.snd{color:#d87f0a}.sh3r{color:#c7324b}</style></head>';
    let time = new Date().getTime();

    // .. get files list
    filesList( "db/source/new" );

    let part = 5;
    if ( part ) bigHTML = "";
    let ppp = 888 * part;

    for ( let i=ppp; i<ppp+888; i++ ) {
        if ( i%333 ) tools.timer(list.length,i,time);
        html = fs.readFileSync( list[i], "utf-8" );
        $ = cheerio.load( html );
        html = $( ".WordSection1" ).html();
        html = html.replace( /colr:#2A415C"/g, "\"class='RM'" );
        $ = cheerio.load( html );
        // .. remove inline footNotes
        $( "p" ).filter( i => $( "p" ).eq(i).text().includes("__________________") ).remove();
        $( ".RM" ).parent().remove();
        $( ".MsoFootnoteReference" ).parent().remove();
        $( "sup" ).parent().remove();
        html = $( "*" ).html();
        bigHTML += " " + html;
    }

    bigHTML = trimmer( bigHTML );

    let test: string
    let t: cheerio.CheerioAPI
    time = new Date().getTime();
    $ = cheerio.load( bigHTML );
    console.log( $( "p" ) .length );
    $( "p" ).filter( i => {
        if ( i%333 ) tools.timer($( "p" ).length,i,time);
        test = $( "p" ).eq(i).html();
        t = cheerio.load( test );
        t( ".aya" ).remove();
        if ( $( "p" ).eq(i).find( '.hdeth' ).length ) return true;
        else if ( $( "p" ).eq(i).find( '.snd' ).length ) return true;
        else if ( t.text().includes("َ") || t.text().includes("ِ") || t.text().includes("ُ") ) return true;
        else return false;
    } ).remove();
    bigHTML = $( "*" ).html();
    console.log( $( "p" ) .length );

    fs.writeFileSync( "db/tmp/xxx_" + part + ".html", bigHTML );

}

// .. ====================================================================

function filesList ( path: string ) {

	fs.readdirSync( path ).forEach( file => {
		let Absolute = Path.join( path, file );
		if ( fs.statSync( Absolute ).isDirectory() )
			return filesList( Absolute );
		else{
            if ( file.replace( ".htm", "" ).length === 1 ) {
                let newAbsolute = Path.join( path, "0" + file );
                fs.renameSync( Absolute, newAbsolute );
                Absolute = newAbsolute;
            }
            return list.push( Absolute );
        }
	} );

}

// .. ====================================================================

function trimmer ( bigHTML: string ) {
    bigHTML = bigHTML.replace( /\n/g, " " );
    bigHTML = bigHTML.replace( / +/g, " " );
    bigHTML = bigHTML.replace( /<p/g, "\n<p" );
    bigHTML = bigHTML.replace( /dir="RTL" /g, "" );
    bigHTML = bigHTML.replace( /sh3r" /g, "SHR" );
    bigHTML = bigHTML.replace( /&quot;/g, " " );
    bigHTML = bigHTML.replace( / +/g, " " );
    bigHTML = bigHTML.replace( / <\/body> <head><\/head><body>/g, " " );
    bigHTML = bigHTML.replace( /<p class="MsoNormal"> <\/p> /g, "" );
    bigHTML = bigHTML.replace( /direction:rtl;?/g, "" );
    bigHTML = bigHTML.replace( /text-align:center;?/g, "" );
    bigHTML = bigHTML.replace( /text-align:right;?/g, "" );
    bigHTML = bigHTML.replace( /line-height: ?normal;?/g, "" );
    bigHTML = bigHTML.replace( / ?class="MsoNormal"/g, "" );
    bigHTML = bigHTML.replace( /unicode-bidi:embed:?/g, "" );
    bigHTML = bigHTML.replace( /font-fam: ,/g, "" );
    bigHTML = bigHTML.replace( /color:"/g, "\"" );
    bigHTML = bigHTML.replace( /font-si:15.0pt;/g, "" );
    bigHTML = bigHTML.replace( /lang="FA"/g, "" );
    bigHTML = bigHTML.replace( / +/g, " " );
    bigHTML = bigHTML.replace( /style=" ;/g, "style=\"" );
    bigHTML = bigHTML.replace( / ?style=" ?"/g, "" );
    bigHTML = bigHTML.replace( /<span >/g, "<span>" );
    bigHTML = bigHTML.replace( /> </g, "><" );
    bigHTML = bigHTML.replace( /; "/g, ";\"" );
    bigHTML = bigHTML.replace( /<p><span>&nbsp;<\/span><\/p>/g, "" );
    bigHTML = bigHTML.replace( /<span dir="RTL"><\/span>/g, "" );
    bigHTML = bigHTML.replace( /<p>&nbsp;<\/p>/g, "" );
    bigHTML = bigHTML.replace( / +/g, " " );
    bigHTML = bigHTML.replace( /style=";"/g, "" );
    return bigHTML;
}

// .. ====================================================================

function trimmer2 ( str: string ) {

    str = str.replace( /colr:/g, "color:" );
    str = str.replace( /dir="LTR"/g, "" );
    str = str.replace( /dir="RTL"/g, "" );
    str = str.replace( /font-famfont-famional Arabic ,/g, "" );
    str = str.replace( /font-famfont-famitional Arabic ,/g, "" );
    str = str.replace( /font-famional Arabic ,/g, "" );
    str = str.replace( /font-si: ?14.0pt;?/g, "" );
    str = str.replace( /font-si: ?15.0pt;?/g, "" );
    str = str.replace( /line-height: ?107%;/g, "" );
    str = str.replace( /style=" ?; ?/g, "style=\"" );
    str = str.replace( /style=" ?;?"/g, "" );
    str = str.replace( /lang="AR-SA" /g, "" );
    str = str.replace( /lang="AR-SA" /g, "" );
    str = str.replace( /style=" ?color:#965AA0"/g, "class=\"RM\"" );
    str = str.replace( /style=" ?color:"/g, "" );
    str = str.replace( /style="color:#465BFF"/g, "class=\"RM\"" );
    str = str.replace( /<s/g, "\n<s" );
    str = str.replace( / +/g, " " );
    return str;

}