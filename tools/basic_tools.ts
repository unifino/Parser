import * as TS                          from "../types/types";

// .. ====================================================================

export function beautyJSON ( str: string ) {
    str = str.replace( /\n.\t/g, " " );
    str = str.replace( /\n\t\]/g, " ]" );
    return str;
}

// .. ====================================================================

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
    str = str.replace( / /g , " " );
    str = str.replace( / +/g , " " );
    str = simple_trimmer( str );
    return str;
}

// .. ====================================================================

export function simple_trimmer ( str: string ) {

    str = str.replace( /: :/g , " : " );
    str = str.replace( /  +/g , " " );
    str = str.trim();
    return str;

}

// .. ====================================================================

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
        .replace( /ى/g, 'ی' )
        .replace( /-/g, ' ' );
        // .replace( /ڑ/g, 'ر' );

    return str;

}

// .. ====================================================================

export const erabs = [
    "ٕ", "ٓ", "ٖ", "ۡ", "ۚ", "ۢ", "ۖ", "ۗ", "ٌۚ", "ۥ", " ٌ",
    "ً", "ٌ", "ٍ",  "َ", "ُ",  "ِ",  "ّ",  "ْ", "‎ٓ", "ٔ",  "ٰ", 
    "ـ",
];

export function erabTrimmer ( str ) {
    if ( !str ) return "";
    for ( const erab of erabs ) str = str.replace( new RegExp( erab, 'g' ), "" );
    str = str.replace( /ٱ/g, 'ا' );
    return str;
}

// .. ====================================================================

export function arabicDigits ( str: string ) {
    const base = [ '۰','۱','۲','۳','٤','۵','٦','۷','۸','۹' ];
    return str.replace( /[0-9]/g, w => base[+w] );
}

// .. ====================================================================

export function latinDigits ( str ) {

    str = str.replace( /۰/g, "0" );
    str = str.replace( /۱/g, "1" );
    str = str.replace( /۲/g, "2" );
    str = str.replace( /۳/g, "3" );
    str = str.replace( /۴/g, "4" );
    str = str.replace( /۵/g, "5" );
    str = str.replace( /۶/g, "6" );
    str = str.replace( /۷/g, "7" );
    str = str.replace( /۸/g, "8" );
    str = str.replace( /۹/g, "9" );

    str = str.replace( /٠/g, "0" );
    str = str.replace( /١/g, "1" );
    str = str.replace( /٢/g, "2" );
    str = str.replace( /٣/g, "3" );
    str = str.replace( /٤/g, "4" );
    str = str.replace( /٥/g, "5" );
    str = str.replace( /٦/g, "6" );
    str = str.replace( /٧/g, "7" );
    str = str.replace( /٨/g, "8" );
    str = str.replace( /٩/g, "9" );

    return str;

}

// .. ====================================================================

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

// .. ====================================================================

export function deleteSomeWords ( arr: string[] ) {

    let omit = [ 
        "و", "ان", 
        "", "(", ")","[", "]","ـ","،",":","؟","»","«","؛","!",
        "من","لم","ما","به","اذا","عن","مع","الله","لیس","الی","علی","کان"
        ,"له","لله","له","معه","رب","ی","شی","ا","یا","ه","لا",
        "قال","علیه‌السلام","فقال","علیهما‌السلام","عزوجل","صلی‌الله‌علیه‌واله‌وسلم", 
        "<Q>","</Q>",".","م","ل","-",
        "[","]"
        // "خیر","شر",
    ];

    // .. remove some first letters
    for ( let i in arr ) 
        if ( arr[i].slice(0,1) === "و" )
            arr[i] =  arr[i].slice(1);

    for ( let i in arr ) 
        if 
        ( 
               arr[i].slice(0,1) === "ل" 
            || arr[i].slice(0,1) === "ف" 
            || arr[i].slice(0,1) === "ف" 
            || arr[i].slice(0,1) === "ال" 
        ) 
            arr[i] =  arr[i].slice(1);

    // .. remove omitting cells
    arr = arr.filter( a => !~omit.indexOf( a ) && isNaN( Number(a) ) )
    return arr;

}

// .. ====================================================================

