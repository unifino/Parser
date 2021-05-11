// عَنْ أَبِي عَبْدِ اللهِعليه‌السلام ، قَالَ : « قَالَ رَسُولُ اللهِصلى‌الله‌عليه‌وآله : إِذَا رَأَيْتُمْ أَهْلَ الرَّيْبِ وَالْبِدَعِ مِنْ بَعْدِي ، فَأَظْهِرُوا الْبَرَاءَةَ مِنْهُمْ ، وَأَكْثِرُوا مِنْ سَبِّهِمْ ، وَالْقَوْلَ فِيهِمْ وَالْوَقِيعَةَ ، وَبَاهِتُوهُمْ كَيْلَا يَطْمَعُوا فِي الْفَسَادِ فِي الْإِسْلَامِ ، وَيَحْذَرَهُمُ النَّاسُ ، وَلَايَتَعَلَّمُوا مِنْ بِدَعِهِمْ ؛ يَكْتُبِ اللهُ لَكُمْ بِذلِكَ الْحَسَنَاتِ ، وَيَرْفَعْ لَكُمْ بِهِ الدَّرَجَاتِ فِي الْآخِرَةِ ». 
// الشِّيعَةِ ، خَاصِمُوا بِسُورَةِ‌

import * as fs                          from "fs";
let filePath = "KAFI.txt";

console.log( "\n... AL-KAFI Parser v.1.0.0 ...\n");

// .. check
await fs.promises.access( filePath, fs.constants.F_OK )
// .. file is found
.then( () => console.log( "Go...\n" ) )
// .. file is NOT found
.catch( e => console.log(e) );

// .. tools ===============================================================================

function id_extractor ( str ) {
    str = str.split( "." )[0].split( "/" )[0];
    str = str.replace( "<p class=libNormal0>", "" );
    str = str.replace( "<p class=libNormal>", "" );
    str = str.replace( "<span class=libBold2>", "" );
    let b = str;
    str = str.replace( " ", "" );
    str = str.replace( "‌", "" ); 
    str = arabicDigits( str );
    str = Number( str );
    if ( !str ) console.log(str, b);
    return str;
}

function arabicDigits2 ( str ) {
    const base = [ '۰','۱','۲','۳','۴','۵','۶','۷','۸','۹' ];
    return str.replace( /[0-9]/g, w => base[+w] );
}

function arabicDigits ( str ) {
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
    str = str.replace( /٩/g, "9" );

    return str;
}

function textTrimmer ( str ) {
    str = str.replace( /<p class=libNormal0>/g, " " );
    str = str.replace( /<p class=libNormal>/g, " " );
    str = str.replace( /<\/p>/g, " " );
    str = str.replace( / +/g, " " );
    str = str.trim();
    // str = str.replace( /‌      +/g, " " );
    return str;
}

function c_finder ( cell ) {

    let cs = [
        [ "عَنْ عَلِيٍّ<span class=libAlaem>عليه‌السلام</span>", 1 ],
        [ "عَنْ أَبِي جَعْفَرٍ<span class=libAlaem>عليه‌السلام</span>" , 5 ],
        [ "عَنْ أَبِي عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "قَالَ رَسُولُ اللهِ<span class=libAlaem>صلى‌الله‌عليه‌وآله</span>", 13 ],
        [ "كُنْتُ عِنْدَ أَبِي عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "عَنْ جَعْفَرٍ ، عَنْ أَبِيهِ<span class=libAlaem>عليهما‌السلام</span>", 6 ],
        [ "قَالَ أَبُو عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "سُئِلَ أَبُو عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "قُلْتُ لِأَبِي عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "قَالَ لِي أَبُو عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "كَتَبْتُ إِلى أَبِي جَعْفَرٍ<span class=libAlaem>عليه‌السلام</span>", 5 ],
        [ "عَنْ‌أَبِي عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "عَنْ أَبِي عَبْدِ الله<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "سَأَلْتُ أَبَا عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "سَمِعْتُ أَبَا الْحَسَنِ مُوسى <span class=libAlaem>عليه‌السلام</span>", 7 ],
        [ "شَكَوْتُ إِلى أَبِي عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "عَنْ‌أَبِي جَعْفَرٍ<span class=libAlaem>عليه‌السلام</span>", 5 ],
        [ "قَالَ أَبُو جَعْفَرٍ<span class=libAlaem>عليه‌السلام</span>", 5 ],
        [ "سَأَلْتُ أَبَا جَعْفَرٍ<span class=libAlaem>عليه‌السلام</span>", 5 ],
        [ "عن أمير المؤمنين<span class=libAlaem>عليه‌السلام</span>", 1 ],
        [ "عن أبي جعفر<span class=libAlaem>عليه‌السلام</span>", 5 ],
        [ "عن أبي عبد الله<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "قلت لأبي جعفر<span class=libAlaem>عليه‌السلام</span>", 5 ],
        [ "عن أبي جعفر <span class=libAlaem>عليه‌السلام</span>", 5 ],
        [ "كنت عند أبي عبد الله<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "سألت أبا عبد الله<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "سمعت أبا عبد الله<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "قلت لأبي عبد الله<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "رَفَعَهُ إِلَى أَبِي عَبْدِ اللهِ<span class=libAlaem>عليه‌السلام</span>", 6 ],
        [ "سَمِعْتُ الرِّضَا<span class=libAlaem>عليه‌السلام</span>", 8 ],
        [ "، قَالَ : « قَالَ رَسُولُ اللهِ<span class=libAlaem>صلى‌الله‌عليه‌وآله</span>", 13 ],
        [ "قَالَ أَمِيرُ المـُؤْمِنِينَ<span class=libAlaem>عليه‌السلام</span>", 1 ],
        // [ "قُلْتُ لِأَبِي الْحَسَنِ <span class=libAlaem>عليه‌السلام</span>", 1 ]
        // [ "بي عبد الله<span class=libAlaem>عليه‌السلام</span>", 6 ]
    ];

    for ( let x of cs ) {
        if ( cell.a.slice( 0, x[0].length + 20 ).includes( x[0] ) ) {
            cell.a = cell.a.replace( x[0], " " ).trim();
            cell.c = x[1];
            break;
        }
    }

} 

function insert ( line ) {
    db_json_temp.a = textTrimmer( db_json_temp.a );
    c_finder( db_json_temp );
    db_json.push( db_json_temp );
    // .. reset
    db_json_temp = { a: "", d: id_extractor( line ) };
}

let ravis = "";
function ravi ( str ) {
    let count1 = ( str.match( / عَنْ /g ) || [] ).length;
    let count2 = ( str.match( / عن /g ) || [] ).length;
    let count3 = ( str.match( / عَنِ /g ) || [] ).length;

    if ( count1 + count2 + count3 > 3 ) {
        let id = db_json.length ;
        ravis += id + " " +  str ;
        // ravis += id + "\n";
        return ( 
            id == 1028 || 
            id == 1028 || 
            id == 3435 || 
            id == 7103 || 
            id == 7104 || 
            id == 8072 || 
            id == 9593 || 
            id == 13396 ||
            id == 14819 
        ) ? true : false;
    }
    return true;
}

let test_check = "";
function test ( obj ) {
    let i = 0;
    obj.forEach( x => {
        let count1 = ( x.a.match( / عَنْ /g ) || [] ).length;
        let count2 = ( x.a.match( / عن /g ) || [] ).length;
        let count3 = ( x.a.match( / عَنِ /g ) || [] ).length;

        if ( count1 + count2 + count3 > 3 ) { 
            // .. trim !!!!!!
            // if ( x.d > 13450 && x.d < 14815 ) {
                i++;
                let str = x.d + "";  
                str = str.replace( /0/g, "٠" );
                str = str.replace( /1/g, "١" );
                str = str.replace( /2/g, "٢" );
                str = str.replace( /3/g, "٣" );
                str = str.replace( /4/g, "٤" );
                str = str.replace( /5/g, "٥" );
                str = str.replace( /6/g, "٦" );
                str = str.replace( /7/g, "٧" );
                str = str.replace( /8/g, "٨" );
                str = str.replace( /9/g, "٩" );
                str = str.replace( /9/g, "٩" );
                test_check += "<br>" + str + "<br>" + x.a + "<br>";
                console.log( x.d ) 
            // } 
        };
    } );
    console.log( i );
}

// .. main ================================================================================
let db = "";
let db_json = [];
let db_json_temp = { a: "", d: 0 };
// .. get source
let pureText = fs.readFileSync( filePath , 'utf8');
// .. remove footnote marks
let footNoteSpanRegExp = /<span class=libFootnotenum>(.*?)<\/span>/g;
pureText = pureText.replace( footNoteSpanRegExp, " " );
// .. trim
pureText = pureText.replace( /  +/g , " " );
pureText = pureText.replace( /  /g , " " );
pureText = pureText.trim();
// .. divide Books (15)
let bookDivider = "<!-- //NEW BOOK ---------------------- -->";
let books = pureText.split( bookDivider );

// .. remove first cell if is empty
if ( !books[0] ) books.splice( 0, 1 );

let limit = 0;
for ( let book of books ) {

    // if ( limit ) break;
    limit++;

    // .. divide book to pages
    let pages = book.split( "<a " );

    for ( let pNum in pages ) {

        // .. trim page number
        pages[ pNum ] = pages[ pNum ].replace( "></a>", "" );

        let pageDivider = /<p class=libLine>(.*?)<\/p>/;
        let sides = pages[ pNum ].split( pageDivider );

        let lines = sides[0].split( "\n" );
        // let lines = pages[ pNum ].split( "\n" );

        for ( let lineNum in lines ) {

            let line = lines[ lineNum ];

            // .. should be on the top! check Page number on actual Book
            if ( line.startsWith( "name" ) ) {
                if ( lineNum != 0 ) console.log( "line, lineNum" );
            }
            // .. check if any line starts with p ends also with p
            else if ( line.startsWith( "<p" ) ) {

                // .. line has problem!
                if ( !line.endsWith( "</p>" ) ) { 
                    console.log( "BAD LINE!", line, lineNum ); 
                    break; 
                }
                // .. line is as expected ( <p>()</p> )
                else {

                    // .. this line is BOOK Title
                    if ( line.startsWith( "<p class=Heading1Center>" ) ) {}
                    // .. this line is Bab Title
                    else if ( line.startsWith( "<p class=Heading2Center>" ) ) {}
                    // .. this line is Some Descriptions
                    else if ( line.startsWith( "<p class=libCenter>" ) ) {}
                    // .. includes NameOfAllah & some other titles like numbers
                    else if ( line.startsWith( "<p class=libCenterBold1>" ) ) {}
                    // .. this line is Some Descriptions
                    else if ( line.startsWith( "<p class=libCenterBold2>" ) ) {}
                    // .. this line is Some () Category Title )
                    else if ( line.startsWith( "<p class=libBold1>" ) ) {}
                    // .. some ends
                    else if ( line.startsWith( "<p class=libLeftBold>" ) ) {}

                    // .. this line is FootNote ! should be empty!!!
                    else if ( line.startsWith( "<p class=libFootnote>" ) ) {}
                    else if ( line.startsWith( "<p class=libFootnote0>" ) ) {}
                    else if ( line.startsWith( "<p class=libPoemFootnote>" ) ) {}
                    else if ( line.startsWith( "<p class=libLine>" ) ) {}
                    // .. this line is FootNoteLink ! should be empty!!!
                    else if ( line.includes( "class=libFootnotenum>" ) ) {}

                    // .. duplicate notification !CAUTION
                    else if ( line.includes( ">*" ) ) {}

                    // .. START of a New HADIS (Module 1)
                    else if ( line.includes( "class=libBold2>" ) ) {

                        // .. we need this
                        if ( line.includes( "يَا هِشَامُ" ) ) { db += line }
                        else insert ( line );

                    }
                    // .. START of a New HADIS (Module 2) numbers differ from 9t Book so on
                    else if (
                        limit > 8 &&
                        (
                            line.slice(0,30).includes( "٠" ) ||
                            line.slice(0,30).includes( "١" ) ||
                            line.slice(0,30).includes( "٢" ) ||
                            line.slice(0,30).includes( "٣" ) ||
                            line.slice(0,30).includes( "٤" ) ||
                            line.slice(0,30).includes( "٥" ) ||
                            line.slice(0,30).includes( "٦" ) ||
                            line.slice(0,30).includes( "٧" ) ||
                            line.slice(0,30).includes( "٨" ) ||
                            line.slice(0,30).includes( "٩" )
                        )
                    ) insert( line );

                    // .. this line is also libPoem IMPORTANT
                    else if ( line.startsWith( "<p class=libPoem>" ) ) { db_json_temp.a += " " + line }

                    // .. this line is IMPORTANT
                    else if ( line.startsWith( "<p class=libNormal>" ) ) { 
                        if ( ravi( line ) ) db_json_temp.a += " " + line; 
                    }
                    else if ( line.startsWith( "<p class=libNormal0>" ) ) { 
                        if ( ravi( line ) ) db_json_temp.a += " " + line; 

                    }

                    // <span class=libAie>
                    // عليه‌السلام
                    // ()
                    // صلى‌الله‌عليه‌وآله
                    // عليهما‌السلام
                    // عليهم‌السلام
                    // صلى‌الله‌عليه‌وآله‌وسلم
                    // عليها‌السلام
                    // رحمه‌الله
                    // صلى‌الله‌عليه‌وآله
                    // رحمهم‌الله
                    // قدس‌سره
                    // عزوجل
                    // رضي‌الله‌عنه
                    // رضي‌الله‌عنهم‌

                    else { console.log( line, "\n" ) }

                }

            }
            // .. not a p-line
            else {
                // .. omit empty lines
                // if ( line ) console.log( line );
            }

        }

    }

}

// .. first cell is empty
let pre = '<html><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><link href="files/template.css" rel="stylesheet" type="text/css" /><link href="files/book.css" rel="stylesheet" type="text/css" /><link href="files/style.css" rel="stylesheet" type="text/css" /><style> @font-face { font-family: "Alaem"; src: url("files/rfdAlaem05.eot"); src: local("files/rfdAlaem05.ttf"), url("files/rfdAlaem05.ttf") format("truetype"), url("files/rfdAlaem05.woff") format("woff"), url("files/rfdAlaem05.svg#webfontYBMgNOwD") format("svg"); } </style><link rel="stylesheet" href="files/main2.css" type="text/css" /><link rel="stylesheet" href="files/main.css" type="text/css" /><link rel="stylesheet" href="files/main3.css" type="text/css" /><link rel="stylesheet" href="files/template-ltr.css" type="text/css" /><link href="files/book-ltr.css" rel="stylesheet" type="text/css" /><body>';
db_json.shift();
test( db_json );
let extracted = JSON.stringify( db_json, null, "\t" );
fs.writeFileSync( "../export.json", extracted );
// fs.writeFileSync( "../ravi.html", pre + ravis + "</body></html>" );
fs.writeFileSync( "../ravi.html", pre + test_check + "</body></html>" );

console.log( "\nDone!\n" );



























// fs.writeFileSync( "pre.html"  , pre + db + "</body></html>" );
// fs.writeFileSync( "test.html"  , pre + test + "</body></html>" );