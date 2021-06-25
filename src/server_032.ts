import * as __                          from "./server_common_tools";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
import * as server003                   from "./server_003";
import * as storage                     from "./storage";
import * as tools                       from "./tools";
import * as fs                          from "fs";
import * as Path 						from "path";
import * as TS                          from "./types";
import * as cheerio                     from 'cheerio';

// .. ====================================================================

let tmpFolder = "src/db/tmp/";
let list: string[] = [];

// .. ====================================================================

console.clear();

// .. ====================================================================

export function init () {

    let html = "";
    let $: cheerio.CheerioAPI;
	let bigHTML = '<head><meta charset="utf-8" /><style>*{direction: rtl} .aya {color: rgb(231, 217, 208);}.hdeth{color: rgb(43, 133, 8);}.snd{color: rgb(199, 195, 189);}.sh3r{color: rgb(219, 5, 41);}</style></head>';
    let time = new Date().getTime();

    // .. get files list
    filesList( "src/db/source/new" );

    for ( let i=0; i<list.length; i++ ) {
        if ( i%333 ) tools.timer(list.length,i,time);
        html = fs.readFileSync( list[i], "utf-8" );
        $ = cheerio.load( html );
        html = $( ".WordSection1" ).html();
        $ = cheerio.load( html );
        html = $( "*" ).html();
        bigHTML += " " + html;
    }

    // bigHTML = bigHTML.replace( / dir="RTL" style="text-align:right;direction:rtl;unicode-bidi:embed"/g, "" );
    // bigHTML = bigHTML.replace( / dir="RTL" style="text-align:right;line-height:normal;/g, "" );
    bigHTML = bigHTML.replace( /\n/g, " " );
    bigHTML = bigHTML.replace( / +/g, " " );
    bigHTML = bigHTML.replace( /<p/g, "\n<p" );
    bigHTML = bigHTML.replace( /dir="RTL" /g, "" );
    bigHTML = bigHTML.replace( /direction:rtl;" /g, "" );
    bigHTML = bigHTML.replace( /unicode-bidi:embed" /g, "" );
    bigHTML = bigHTML.replace( /&quot;/g, " " );
    bigHTML = bigHTML.replace( / +/g, " " );
    bigHTML = bigHTML.replace( / <\/body> <head><\/head><body>/g, " " );
    bigHTML = bigHTML.replace( /<p class="MsoNormal"> <\/p> /g, "" );
    bigHTML = bigHTML.replace( /font-fam: ,;/g, "" );
    bigHTML = bigHTML.replace( /font-fam: ,/g, "" );
    bigHTML = bigHTML.replace( /color:"/g, "\"" );
    bigHTML = bigHTML.replace( /font-si:15.0pt;/g, "" );
    bigHTML = bigHTML.replace( /lang="FA"/g, "" );
    bigHTML = bigHTML.replace( /<span >/g, "<span>" );
    bigHTML = bigHTML.replace( / +/g, " " );
    bigHTML = bigHTML.replace( /> </g, "><" );
    bigHTML = bigHTML.replace( /style=" ;/g, "style=\"" );
    bigHTML = bigHTML.replace( /style=";/g, "style=\"" );
    bigHTML = bigHTML.replace( /style=" +/g, "style=\"" );

    bigHTML = bigHTML.replace( / style=" "/g, "" );
    bigHTML = bigHTML.replace( / style=";"/g, "" );
    bigHTML = bigHTML.replace( / style="; "/g, "" );
    bigHTML = bigHTML.replace( / style=" ;"/g, "" );
    bigHTML = bigHTML.replace( / style=" "/g, "" );

    bigHTML = bigHTML.replace( / style=""/g, "" );
    bigHTML = bigHTML.replace( / +/g, " " );

    fs.writeFileSync( "src/db/tmp/bigHTML.html", bigHTML );

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
