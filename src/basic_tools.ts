import * as TS                          from "./types";

// .. ======================================================================

export function charSpacer ( str: string ) {
    if ( !str ) return "";
    str = str.replace( /-/g , " - " );
    str = str.replace( /،/g , " ، " );
    str = str.replace( /؛/g , " ؛ " );
    str = str.replace( /؟/g , " ؟ " );
    str = str.replace( /!/g , " ! " );
    str = str.replace( /:/g , " : " );
    str = str.replace( /\(/g , " ( " );
    str = str.replace( /\)/g , " ) " );
    str = str.replace( /\[/g , " [ " );
    str = str.replace( /\]/g , " ] " );
    str = str.replace( /\./g, ' . ' );
    str = str.replace( /  +/g , " " );
    str = simple_trimmer( str );
    return str;
}

// .. ======================================================================

export function simple_trimmer ( str: string ) {

    str = str.replace( /: :/g , " : " );
    str = str.replace( /  +/g , " " );
    str = str.trim();
    return str;

}

// .. ======================================================================

export function inFarsiLetters ( str: string ) {

    if ( !str ) return "";

    str = erabTrimmer( str );
    str = str
        .replace( /ء/g, 'ا' )
        .replace( /إ/g, 'ا' )
        .replace( /أ/g, 'ا' )
        .replace( /آ/g, 'ا' )
        .replace( /ة/g, 'ه' )
        .replace( /ؤ/g, 'و' )
        .replace( /ك/g, 'ک' )
        .replace( /ي/g, 'ی' )
        .replace( /ﺉ/g, 'ی' )
        .replace( /ئ/g, 'ی' )
        .replace( /ى/g, 'ی' );
        // .replace( /ڑ/g, 'ر' );

    return str;

}

// .. ======================================================================

function erabTrimmer ( str ) {
    if ( !str ) return "";
    const erabs = [
        "ٕ", "ٓ", "ٖ", "ۡ", "ۚ", "ۢ", "ۖ", "ۗ", "ٌۚ", "ۥ", " ٌ",
        "ً", "ٌ", "ٍ",  "َ", "ُ",  "ِ",  "ّ",  "ْ", "‎ٓ", "ٔ",  "ٰ", 
        "ـ",
    ];
    for ( const erab of erabs ) str = str.replace( new RegExp( erab, 'g' ), "" );
    str = str.replace( /ٱ/g, 'ا' );
    return str;
}

// .. ======================================================================

export function cutSomePhrases ( str: string ) {

    str = str.replace( /رسول الله صلی‌الله‌علیه‌واله‌وسلم/g , " " );
    str = str.replace( /ابی عبد الله علیه‌السلام/g , " " );
    str = str.replace( /ابو عبد الله علیه‌السلام/g , " " );
    str = str.replace( /امیر المومنین علیه‌السلام/g , " " );
    str = str.replace( /ابو الحسن علیه‌السلام/g , " " );
    str = str.replace( /علی بن الحسین علیه‌السلام/g , " " );
    str = str.replace( /ابا الحسن علیه‌السلام/g , " " );
    str = str.replace( /ابا جعفر علیه‌السلام/g , " " );
    str = str.replace( /ابا عبد الله علیه‌السلام/g , " " );
    str = str.replace( /قول الله عزوجل/g , " " );
    str = str.replace( /ابی جعفر علیه‌السلام/g , " " );
    str = str.replace( /ابی جعفر وابی عبد الله/g , " " );
    str = str.replace( /ابی جعفر الثانی/g , " " );
    str = str.replace( /ابی الحسن علیه‌السلام/g , " " );
    str = str.replace( /ابو جعفر علیه‌السلام/g , " " );
    str = str.replace( /فقال علیه‌السلام/g , " " );
    str = str.replace( /ابی الحسن الاول علیه‌السلام/g , " " );
    str = str.replace( /ابی الحسن الرضا علیه‌السلام/g , " " );
    str = str.replace( /ابی الحسن الرضا علیه‌السلام/g , " " );
    str = str.replace( /ابی الحسن الرضا علیه‌السلام/g , " " );
    str = str.replace( /ابو عبد الله ابا الحسن علیهما‌السلام/g , " " );
    str = str.replace( / +/g , " " );

    
    return str;

}

// .. ======================================================================

export function deleteSomeWords ( arr: string[] ) {

    let omit = [ 
        "و", "ان", 
        "", "(", ")","[", "]","ـ","،",":","؟","»","«","؛","!",
        "من","لم","ما","به","اذا","عن","مع","الله","لیس","الی","علی","کان"
        ,"له","لله","له","معه","رب","ی","شی","ا","یا","ه","لا",
        "قال","علیه‌السلام","فقال","علیهما‌السلام","عزوجل","صلی‌الله‌علیه‌واله‌وسلم", 
        "<Q>","</Q>",".","م","ل","-"
        // "خیر","شر",
    ];

    // .. remove some first letters
    for ( let i in arr ) 
        if 
        ( 
               arr[i].slice(0,1) === "و" 
            || arr[i].slice(0,1) === "ف" 
            || arr[i].slice(0,1) === "ل" 
            || arr[i].slice(0,1) === "ال" 
        ) 
            arr[i] =  arr[i].slice(1);

    // .. remove omitting cells
    arr = arr.filter( a => !~omit.indexOf( a ) && isNaN( Number(a) ) )
    return arr;

}

// .. ======================================================================
