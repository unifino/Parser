import * as fs                          from "fs";

console.log( "\n... AL-KAFI DB Builder ( v.1.0.0 ) ...\n");

// .. ======================================================================

let db = [];

// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// .. apply on all books
await init ();
// .. write down db
let exp = "../db/tmp/02.json";
fs.writeFileSync( exp, JSON.stringify( db, null, "\t" ) );

console.log( "\n... Done!\n" );

// .. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

async function init () {

    let filePath = "../db/tmp/01.json";
    // .. check
    await fs.promises.access( filePath, fs.constants.F_OK )
    // .. file is found
    .then( () => {} )
    // .. file is NOT found
    .catch( e => console.log(e) );

    // .. get source
    let source = fs.readFileSync( filePath , 'utf8' );
    let extracted = JSON.parse( source );

    // .. do for each cell
    extracted.forEach( (h, i) => {

        // .. extract actual ID
        let id = id_extractor( h[0] );
        if ( id != i+1 ) console.warn( i, id );

        // .. remove ID
        let tmp = h[0].split( "." );
        tmp.shift();
        h[0] = tmp.join( " " );

        // .. remove these odd lines!
        for( let q in h ) if ( h[q].startsWith( "<p class=libNormal>*" ) ) delete h[q];

        if ( h.length === 1 ) {
            // .. detect by uniqe « & »
            let fDQ = ( h[0].match( /«/g ) || [] ).length;
            let lDQ = ( h[0].match( /»/g ) || [] ).length;
            let fDQID = h[0].indexOf( "«" );
            let lDQID = h[0].indexOf( "»" );
            if ( fDQ === 1 && lDQ === 1 ) h[0] = h[0].substring( fDQID +1 , lDQID );
            h[0] = salli( h[0] );
            extracted[ i ] = { a: h[0], b: null, c: null, d: id }
        }
        // .. remove first line
        else if ( h.length > 1 && h[0].slice( h[0].length -7 ).includes( ":" ) ) {
            delete h[0];
            extracted[ i ] = { a: salli( h.join( " " ) ), b: null, c: null, d:id };
        }
        // .. remove first & second lines
        else if ( h.length > 2 && h[1].slice( h[1].length -7 ).includes( ":" ) ) {
            delete h[0];
            delete h[1];
            extracted[ i ] = { a: salli( h.join( " " ) ), b: null, c: null, d: id };
        }
        // .. remove first & second & 3rd lines
        else if ( h.length > 3 && h[2].slice( h[2].length -7 ).includes( ":" ) ) {
            delete h[0];
            delete h[1];
            delete h[2];
            extracted[ i ] = { a: salli( h.join( " " ) ), b: null, c: null, d: id };
        }
        // .. remove first & second & 3rd & 4th lines
        else if ( h.length > 4 && h[3].slice( h[3].length -7 ).includes( ":" ) ) {
            delete h[0];
            delete h[1];
            delete h[2];
            delete h[3];
            extracted[ i ] = { a: salli( h.join( " " ) ), b: null, c: null, d: id };
        }
        // .. add all
        else extracted[ i ] = { a: salli( h.join( " " ) ), b: null, c: null, d: id };

    } );

    db = extracted;

}

// .. ======================================================================

function id_extractor ( str ) {
    str = str.split( "." )[0].split( "/" )[0];
    str = str.replace( "<p class=libNormal0>", "" );
    str = str.replace( "<p class=libNormal>", "" );
    str = str.replace( "<span class=libBold2>", "" );
    let b = str;
    str = str.replace( " ", "" );
    str = str.replace( "‌", "" ); 
    str = Number( str );
    return str;
}

// .. ======================================================================

function salli ( text ) {

    text = text.replace( /<span class=libAlaem>عزوجل<\/span>/g, " عزوجل " );
    text = text.replace( /<span class=libAlaem>رحمه‌الله<\/span>/g, " رحمه‌الله " );
    text = text.replace( /<span class=libAlaem>رحمهم‌الله<\/span>/g, " رحمهم‌الله " );
    text = text.replace( /<span class=libAlaem>عليه‌السلام<\/span>/g, " عليه‌السلام " );
    text = text.replace( /<span class=libAlaem>عليها‌السلام<\/span>/g, " عليها‌السلام " );
    text = text.replace( /<span class=libAlaem>عليهم‌السلام<\/span>/g, " عليهم‌السلام " );
    text = text.replace( /<span class=libAlaem>عليه‌السلام\(<\/span>/g, " عليه‌السلام " );
    text = text.replace( /<span class=libAlaem>عليهما‌السلام<\/span>/g, " عليهما‌السلام " );
    text = text.replace( /<span class=libAlaem>رضي‌الله‌عنه<\/span>/g, " رضي‌الله‌عنه " );
    text = text.replace( /<span class=libAlaem>عليها‌السلام\(<\/span>/g, " عليها‌السلام " );
    text = text.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله‌<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله\(<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );
    text = text.replace( /<span class=libAlaem>صلى‌الله‌عليه‌وآله‌وسلم<\/span>/g, " صلى‌الله‌عليه‌وآله‌وسلم " );

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

    text = text.replace( /<span class=libAlaem>\(<\/span>/g, "" );
    text = text.replace( /<span class=libAlaem>\)<\/span>/g, "" );

    // .. replace libAie with native Q tag
    let q = ( text.match( /<span class=libAie>(.*?)<\/span>/g ) || [] );
    for ( let c of q ) {
        let r = c;
        r = r.replace( "<span class=libAie>", " <Q> ) " );
        r = r.replace( "<\/span>", " ( </Q> " );
        text = text.replace( c, r );
    }

    // .. remove some Tags
    text = text.replace( /<p class=libNormal>/g, " " );
    text = text.replace( /<p class=libNormal0>/g, " " );
    text = text.replace( /<p class=libPoem>/g, " " );
    text = text.replace( /<p class=libCenter>/g, " " );
    text = text.replace( /<p class=libCenterBold1>/g, " " );
    text = text.replace( /<p class=libBold1>/g, " " );
    text = text.replace( /<\/p>/g, " " );
    text = text.replace( /<span class=libAlaem>/g, " " );
    text = text.replace( /<span class=libNormal0>/g, " " );
    text = text.replace( /<span class=libNormal>/g, " " );
    text = text.replace( /<span class=libBold2>/g, " " );
    text = text.replace( /<span class=libFootnoteBold>/g, " " );
    text = text.replace( /<span class=libFootnoteAlaem>/g, " " );
    text = text.replace( /<span class=libFootnoteAie>/g, " " );
    text = text.replace( /<span class=libPoemTiniChar0>/g, " " );
    text = text.replace( /<\/span>/g, " " );
    // .. some fine trims
    text = text.replace( /<span class=libFootnote0>/g, " " );
    text = text.replace( /<p class=libBold2>/g, " " );
    text = text.replace( /<p class=libFootnote0>/g, " " );

    // .. trim
    text = text.replace( /\.\.\.\.\.+/g, "....." );
    text = text.replace( /\.\.\.\.\./g, " " );
    text = text.replace( /\[\.\.\.\]/g, " " );
    text = text.replace( / +/g, " " );
    text = text.trim();

    return text;

}

// .. ======================================================================