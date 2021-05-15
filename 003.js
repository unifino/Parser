import * as fs                          from "fs";

console.log( "\n... AL-KAFI DB Tunner v.1.0.0 ...\n");


// .. ======================================================================

let c_map = [
    [ 8 , "عَنِ الرِّضَا عليه‌السلام ، قَالَ : «" ],
    [ 5 , "عَنْ أَبِي جَعْفَرٍ عليه‌السلام ، قَالَ : «" ],
    [ 1 , "عَنْ عَلِيٍّ عليه‌السلام ، قَالَ : «" ],
    [ 8 , "سَمِعْتُ الرِّضَا عليه‌السلام يَقُولُ : «" ],
    [ 6 , "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام : «" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ : «" ],
    [ 7 , "عَنْ أَبِي الْحَسَنِ مُوسى عليه‌السلام ، قَالَ : «" ],
    [ 1 , "سَمِعْتُ أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام يَقُولُ : «" ],
    [ 6 , "سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ : «" ],
    [ 5 , "عَنْ أَبِي جَعْفَرٍ عليه‌السلام ، قَالَ : قَالَ : «" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، عَنْ آبَائِهِ عليهم‌السلام ، قَالَ : «" ],
    [ 6 , "قَالَ لِي أَبُو عَبْدِ اللهِ عليه‌السلام : «" ],
    [ 4 , "عَنْ عَلِيِّ بْنِ الْحُسَيْنِ عليهما‌السلام ، قَالَ : «" ],
    [ 8 , "عَنْ أَبِي الْحَسَنِ الرِّضَا عليه‌السلام ، قَالَ : «" ],
    [ 1 , "قَالَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام : «" ],
    [ 77, "قَالَ عِيسَى بْنُ مَرْيَمَ عليه‌السلام : «" ],
    [ 7 , "سَمِعْتُ أَبَا الْحَسَنِ مُوسَى بْنَ جَعْفَرٍ عليه‌السلام يَقُولُ : «" ],
    [ 77, "قَالَ لُقْمَانُ لِابْنِهِ : «" ],
    [ 7 , "عَنْ أَبِي الْحَسَنِ مُوسَى بْنِ جَعْفَرٍ عليه‌السلام ، قَالَ : «" ],
    [ 5 , "سَمِعْتُ أَبَا جَعْفَرٍ عليه‌السلام يَقُولُ : «" ],
    [ 6 , "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام لِحُمْرَانَ بْنِ أَعْيَنَ فِي شَيْ‌ءٍ سَأَلَهُ : «" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ : قَالَ : «" ],
    [ 13, "قَالَ رَسُولُ اللهِ صلى‌الله‌عليه‌وآله‌وسلم : «" ],
    [ 1 , "كَانَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام يَقُولُ : «" ],
    [ 6 , "رَفَعَهُ إِلى أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ : «" ],
    [ 1 , "أَنَّ أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام قَالَ فِي بَعْضِ خُطَبِهِ : «" ],
    [ 6 , "قُلْتُ لِأَبِي عَبْدِ اللهِ عليه‌السلام :" ],
    [ 6 , "سَمِعْنَا أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ : «" ],
    [ 6 , "عَنْ‌أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ : «" ],
    [ 77, "قُلْتُ لِأَبِي جَعْفَرٍ الثَّانِي عليه‌السلام :" ],
    [ 77, "قَالَ لِي أَبُو الْحَسَنِ عليه‌السلام : «" ],
    [ 1 , "عَنْ أَمِيرِ الْمُؤْمِنِينَ عليه‌السلام أَنَّهُ قَالَ : «" ],
    [ 5 , "عَنْ أَبِي جَعْفَرٍ وَأَبِي عَبْدِ اللهِ عليهما‌السلام ، قَالَا :" ],
    [ 7 ,"قُلْتُ لِأَبِي الْحَسَنِ مُوسى عليه‌السلام :" ],
    [ 77, "قُلْتُ لِأَبِي الْحَسَنِ الْأَوَّلِ عليه‌السلام :" ],
    [ 7 , "عَنْ أَبِي الْحَسَنِ مُوسى عليه‌السلام ، قَالَ :" ],
    [ 6 , "حَدَّثَنِي جَعْفَرٌ ، عَنْ أَبِيهِ عليهما‌السلام : «" ],
    [ 6 , "دَخَلَ أَبُو حَنِيفَةَ عَلى أَبِي عَبْدِ اللهِ عليه‌السلام ، " ],
    [ 5 , "قَالَ أَبُو جَعْفَرٍ عليه‌السلام : «" ],
    [ 5 , "عَنْ أَبِي جَعْفَرٍ عليه‌السلام ، قَالَ : سَمِعْتُهُ يَقُولُ : «" ],
    [ 5 , "عَنْ أَبِي جَعْفَرٍ عليه‌السلام ، قَالَ : قَالَ لِي : «" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام : قَالَ" ],
    [ 6 , "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام لِأَبِي حَنِيفَةَ : «" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام أَنَّهُ قَالَ : «" ],
    [ 5 , "عَنْ أَحَدِهِمَا عليهما‌السلام ، قَالَ : «" ],
    [ 5 , "عَنْ أَبِي جَعْفَرٍ عليه‌السلام ، قَالَ :" ],
    [ 77, "عَنْ أَبِي الْحَسَنِ الرِّضَا عليه‌السلام ، قَالَ :" ],
    [ 6 , "سَمِعْتُ أَبَا عَبْدِ اللهِ عليه‌السلام يَقُولُ :«" ],
    [ 13, "قَالَ رَسُولُ اللهِ صلى‌الله‌عليه‌وآله‌وسلم :«" ],
    [ 6 , "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام :«" ],
    [ 5 , "قَالَ أَبُو جَعْفَرٍ عليه‌السلام :«" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام «" ],
    [ 77, "عَنْ أَبِي الْحَسَنِ الْأَوَّلِ عليه‌السلام ، قَالَ : «" ],
    [ 5 , "عَنْ أَبِي جَعْفَرٍ عليه‌السلام :" ],
    [ 5 , "قُلْتُ لِأَبِي جَعْفَرٍ عليه‌السلام :" ],
    [ 6 , "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام لِرَجُلٍ : «" ],
    [ 77, "سَمِعْتُ أَبَا الْحَسَنِ عليه‌السلام يَقُولُ : «" ],
    [ 1 , "« قَالَ أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام :" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ ، عَنْ آبَائِهِ عليهم‌السلام ، قَالَ : «" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام :" ],
    [ 1 , "عَنْ أَمِيرِ الْمُؤْمِنِينَ عليه‌السلام ، قَالَ : «" ],
    [ 77, "قَالَ أَبُو الْحَسَنِ الْأَوَّلُ عليه‌السلام : «" ],
    [ 6 , "عَنْ جَعْفَرٍ ، عَنْ أَبِيهِ عليهما‌السلام ، قَالَ : «" ],
    [ 6 , "سَأَلْتُ أَبَا عَبْدِ اللهِ عليه‌السلام :" ],
    [ 11, "عَنْ أَبِي الْحَسَنِ الْعَسْكَرِيِّ عليه‌السلام ، قَالَ : «" ],
    [ 77, "عَنْ أَبِي الْحَسَنِ عليه‌السلام ، قَالَ : سَمِعْتُهُ يَقُولُ : «" ],
    [ 6 , "قَالَ رَجُلٌ لِأَبِي عَبْدِ اللهِ عليه‌السلام :" ],
    [ 77, "قُلْتُ لِأَبِي الْحَسَنِ الثَّانِي عليه‌السلام :" ],
    [ 77, "عَنْ أَبِي الْحَسَنِ عليه‌السلام ، قَالَ :" ],
    [ 5 , "عَنْ أَحَدِهِمَا عليهما‌السلام ، قَالَ :" ],
    [ 5, "عَنْ أَحَدِهِمَا عليهما‌السلام" ],
    [ 6 , "عَنْ أبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ : «" ],
    [ 5 , "كَتَبْتُ إِلى أَبِي جَعْفَرٍ عليه‌السلام :" ],
    [ 77, "قُلْتُ لِأَبِي الْحَسَنِ عليه‌السلام :" ],
    [ 6 , "سَأَلْتُ أَبَا عَبْدِ اللهِ عليه‌السلام ، فَقُلْتُ :" ],
    [ 7 , "عَنْ أَخِيهِ مُوسَى بْنِ جَعْفَرٍ عليه‌السلام ، قَالَ :" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام قَالَ" ],
    [ 6 , "عن أبي عبد الله عليه‌السلام ، قال : «" ],
    [ 6 , "عن أبي عبد الله عليه‌السلام ، قال :" ],
    [ 5 , "قال أبو جعفر عليه‌السلام : «" ],
    [ 1 , "«قال أمير المؤمنين عليه‌السلام : " ],
    [ 6 , "قلت لأبي عبد الله عليه‌السلام :" ],
    [ 5 , "عن أبي جعفر عليه‌السلام ، قال : «" ],
    [ 6 , "قال أبو عبد الله عليه‌السلام : «" ],
    [ 5 , "سمعت أبا جعفر عليه‌السلام يقول : «" ],
    [ 6 , "عن أبي عبد الله عليه‌السلام : «" ],
    [ 5 , "قلت لأبي جعفر عليه‌السلام :" ],
    [ 13, "قال النبي صلى‌الله‌عليه‌وآله‌وسلم : «" ],
    [ 6 , "رفعه إلى أبي عبد الله عليه‌السلام ، قال : «" ],
    [ 6 , "سمعت أبا عبد الله عليه‌السلام يقول : «" ],
    [ 5 , "عن أبي جعفر عليه‌السلام : «" ],
    [ 77, "عن أبي الحسن موسى عليه‌السلام ، قال : «" ],
    [ 6 , "قال لي أبو عبد الله عليه‌السلام : «" ],
    [ 6 , "عن أبي عبد الله عليه‌السلام ، عن آبائه عليهم‌السلام ، قال : «" ],
    [ 6 , "دخلت على أبي عبد الله عليه‌السلام ، فقال : «" ],
    [ 77, "سمعت أبا الحسن عليه‌السلام يقول : «" ],
    [ 6 , "عن علي بن الحسين عليهما‌السلام ، قال : «" ],
    [ 6 , "عَنْ جَعْفَرٍ ، عَنْ آبَائِهِ عليهم‌السلام ، قَالَ : «" ],
    [ 77, "عَنْ آبَائِهِ عليهم‌السلام ، قَالَ : «" ],
    [ 6 , "أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ : «" ],
    [ 6 , "قَالَ أَبُو عَبْدِ اللهِ عليه‌السلام لِأَبِي : «" ],
    [ 7 ,"، رَفَعَهُ إِلى أَبِي الْحَسَنِ عليه‌السلام ، قَالَ : «" ],
    [ 7 , "أَبَا الْحَسَنِ مُوسى عليه‌السلام يَقُولُ : «" ],
    [ 8 , "عن الرضا عليه‌السلام : «" ],
    [ 5, "عن أحدهما عليهما‌السلام ، قال : «" ],
    [ 7 , "عَنْ أَبِي الْحَسَنِ مُوسَى بْنِ جَعْفَرٍ عليهما‌السلام" ],
    [ 7 , "عَنْ أَبِي الْحَسَنِ مُوسَى بْنِ جَعْفَرٍ عليه‌السلام" ],
    [ 6, "حدثنا أبو جعفر محمد بن علي عليه‌السلام ، قال : «" ],
    [ 77, "عن أبي الحسن عليه‌السلام : «" ],
    [ 7 , "قَالَ لِي أَبُو الْحَسَنِ مُوسَى بْنُ جَعْفَرٍ عليه‌السلام : «" ],
    [ 1 , "قَالَ أَمِيرُ المـُؤْمِنِينَ عليه‌السلام : «" ],
    [ 6 , "قال أَبُو عَبدِ اللهِ عليه‌السلام : «" ],
    [ 4 , "سمعت علي بن الحسين عليه‌السلام يقول : «" ],
    [ 77, "عن عبد صالح عليه‌السلام ، قال : «" ],
    
    [ 5 , "عن أبي جعفر عليه‌السلام ، قال :" ],
    [ 6 , "عن أبي عبد الله عليه‌السلام أنه قال :" ],
    [ 77, "عَنْ أَبِي الْحَسَنِ الْأَوَّلِ عليه‌السلام ، قَالَ :" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :" ],
    [ 6 , "رَفَعَهُ إِلَى أَبِي عَبْدِ اللهِ عليه‌السلام ، قَالَ :" ],
    [ 6 , "عَنْ أَبِي عَبْدِ اللهِ عليه‌السلام " ],
    [ 6 , "سألت أبا عبد الله عليه‌السلام " ],
    [ 6 , "عن أبي عبد الله عليه‌السلام " ],
    [ 5 , "عن أبي جعفر عليه‌السلام " ],
];

// .. ======================================================================

let filePath = "db/db.json";
// .. check
await fs.promises.access( filePath, fs.constants.F_OK )
// .. file is found
.then( () => {} )
// .. file is NOT found
.catch( e => console.log(e) );

// .. get source
let source = fs.readFileSync( filePath , 'utf8' );
let db = JSON.parse( source );

pre();
init();
init();
fine();

// .. write down db
await fs.writeFileSync( "db/Kafi.json", JSON.stringify( db, null, "\t" ) );

// .. tools ================================================================

function pre () {

    let replace_map = [
        [ "" , "سمعت عثمان الأحول يقول :" ],
        [ "" , "حدثني أبو عبد الله المدائني :" ],
    ]

    for( let x in db ) {
        for( let y of replace_map ) { 
            if ( db[x].a.includes( y[1] ) ) {
                db[x].a = db[x].a.replace( y[1], y[0] );
            }
        }
    }

}

// .. ======================================================================

function init () {

    for( let x in db ) {

        let new_a = remover( db[x].a );

        // .. remove ravis
        while ( new_a != db[x].a ) { 
            // console.log( db[x].d ); 
            db[x].a = new_a;
            new_a = remover( db[x].a );
        }

        //.. replace the Man
        db[x] = cs_finder( db[x] );
        db[x] = cs_finder_patch( db[x] );

    }

}

// .. ======================================================================

function fine () {

    let final_map = [
        [ 6 , "أَبِي عَبْدِ اللهِ عليه‌السلام" ],
        [ 1, "أَمِيرِ الْمُؤْمِنِينَ عليه‌السلام" ],
        [ 6, "أَبَا عَبْدِ اللهِ عليه‌السلام" ],
        [ 5, "أَبَا جَعْفَرٍ عليه‌السلام" ],
        [ 6 , "أبي عبد الله عليه‌السلام" ],
        [ 6 , "أبو عبد الله عليه‌السلام" ],
        [ 6, "أبو عبد الله عليه‌السلام" ],
        [ 5, "أبو جعفر عليه‌السلام" ],
        [ 5, "أبا جعفر عليه‌السلام" ],
        [ 6, "أبو عبد الله عليه‌السلام" ],
        [ 6, "أبي عبد الله عليه‌السلام" ],
        [ 4, "علي بن الحسين عليهما‌السلام" ],
        [ 1, "أمير المؤمنين عليه‌السلام" ],
        [ 5, "أبو جعفر محمد بن علي عليهما‌السلام" ],
        [ 6, "أبا عبد الله عليه‌السلام" ],
        [ 8, "أبي الحسن الرضا عليه‌السلام" ],
        [ 77, "أبا الحسن عليه‌السلام" ],
        [ 13, "رسول الله صلى‌الله‌عليه‌وآله‌وسلم" ],
        [ 8, "الرضا عليه‌السلام" ],
        [ 5, "أحدهما عليهما‌السلام" ],
        [ 5, "أبو جعفر محمد بن علي عليه‌السلام" ],
        [ 7, "أبي الحسن موسى عليه‌السلام" ],
        [ 77, "أبي الحسن الماضي عليه‌السلام" ],
        [ 5, "أبي جعفر عليه‌السلام" ],
        [ 6, "على أبي عبد الله عليه‌السلام" ],
        [ 8, "أبا الحسن الرضا عليه‌السلام" ],
        [ 8, "الرِّضَا عليه‌السلام" ],
        [ 77, "أَبِي الْحَسَنِ عليه‌السلام" ],
        [ 77, "أَبُو الْحَسَنِ عليه‌السلام" ],
        [ 1, "أَمِيرَ الْمُؤْمِنِينَ عليه‌السلام" ],
        [ 4, "عَلِيِّ بْنِ الْحُسَيْنِ عليه‌السلام" ],
        [ 77, "أَبِي الْحَسَنِ الْأَوَّلِ عليه‌السلام" ],
        [ 77, "أبي الحسن عليه‌السلام" ],
        [ 5, "أَبِي جَعْفَرٍ عليه‌السلام" ],
        [ 77, "أَبِي الْحَسَنِ عليه‌السلام" ],
        [ 1, "أَمِيرُ الْمُؤْمِنِينَ عليه‌السلام" ],
        [ 6, "أَبِي عَبْدِ اللهِ عليه‌السلام" ],
        [ 8, "أَبِي الْحَسَنِ الرِّضَا عليه‌السلام" ],
        [ 7, "أَبَا الْحَسَنِ مُوسى عليه‌السلام" ],
        [ 4, "عَلِيُّ بْنُ الْحُسَيْنِ عليهما‌السلام" ],
        [ 77, "أَبُو جَعْفَرٍ الثَّانِي عليه‌السلام" ],
        [ 6, "أَبُو جَعْفَرٍ عليه‌السلام" ],
        [ 4, "عَلِيُّ بْنُ الْحُسَيْنِ عليه‌السلام" ],
        [ 8, "الرِّضَا عليه‌السلام" ],
    ]

    for( let x in db ) {
        if ( db[x].c === null ) {
            for( let y of final_map ) { 
                if ( db[x].a.slice( 0, y[1].length + 23 ).includes( y[1] ) ) {
                    db[x].c = y[0];
                    // console.log(y[0],db[x].c, x);
                    break;
                }
            }
        }
    }

}

// .. ======================================================================

function cs_finder ( cell ) {

    if ( cell.c ) return cell;

    let pin = -1;
    let matchPos = -1;

    // .. find one and just one matched in c_map
    for ( let cmd in c_map ) {
        let b = c_map[ cmd ][1].length + 12;
        matchPos = cell.a.slice( 0, b ).indexOf( c_map[ cmd ][1] );
        if ( matchPos > -1 ) {
            pin = cmd; 
            break;
        }
    }

    if ( pin !== -1 ) {
        let fID = matchPos + c_map[ pin ][1].length;
        let lID = cell.a.length;
        if ( c_map[ pin ][1].includes( "«" ) ) {
            if ( c_map[ pin ][1].slice( lID - 5 ).includes( "»" ) )
                lID = cell.a.lastIndexOf( "»" ) ;
        } 
        cell.a = cell.a.substring( fID, lID ).trim(); 
        cell.c = c_map[ pin ][0];
    }

    return cell;

}

// .. ======================================================================

function cs_finder_patch( cell ) {

    cell.a = cell.a.replace( / ‌/g, " " );

    let c_map = [
        "قُلْتُ لَهُ :",
        "، قَالَ :",
        "قَالَ : ",
        "قَالَ :"
    ];

    cell.a = cell.a.replace( / +/g, " " ).trim();

    cell.a = cell.a.replace( /قَالَ : قَالَ :/g, "قَالَ : " );

    cell.a = cell.a.replace( / +/g, " " ).trim();

    for ( let cmd of c_map ) {
        if ( cell.a.startsWith( cmd ) )
            cell.a = cell.a.slice( cmd.length ).trim();
    }

    cell.a = cell.a.replace( / +/g, " " ).trim();

    if ( !cell.a.includes( "«" ) ) {
        if ( cell.a.endsWith( "» ." ) ) 
            cell.a = cell.a.slice( 0, cell.a.length - 3 ).trim();
        if ( cell.a.endsWith( "»." ) ) 
            cell.a = cell.a.slice( 0, cell.a.length - 2 ).trim();
    }

    cell.a = cell.a.replace( / +/g, " " ).trim();

    let c1 = ( cell.a.match( /«/g ) || [] ).length;
    let c2 = ( cell.a.match( /»/g ) || [] ).length;

    if ( c1 === 1 && c2 === 1 ) {
        if ( cell.a.startsWith( "«" ) ) {
            cell.a = cell.a.replace( "«", "" );
            cell.a = cell.a.replace( "»", "" );
        }
    }

    if ( cell.a.endsWith( "»." ) || cell.a.endsWith( "» ." ) ) 
        cell.a = cell.a.slice( 0, cell.a.length - 1 ).trim();

    cell.a = cell.a.replace( / +/g, " " ).trim();

    return cell;

}

// .. ======================================================================

function remover ( text ) {

    text = text.replace( /عَنِ الْقَاسِمِ/g, " " );
    text = text.replace( /عَنِ الْمِنْقَرِيِّ/g, " " );
    text = text.replace( /، +/g, "،" );
    text = text.replace( / +،/g, "،" );
    text = text.replace( / ، /g, "،" );
    text = text.replace( /،/g, " ، " );
    text = text.replace( /،  ،/g, " ، " );
    
    
    text = text.replace( /عن أبي الجارود/g, " " );
    text = text.replace( /عن ابن سنان/g, " " );
    text = text.replace( /عن علي بن الحكم/g, " " );
    text = text.replace( /عَنْ إِبْرَاهِيمَ بْنِ عُقْبَةَ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ عِيسى/g, " " );
    text = text.replace( /عَنْ يُونُسَ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ مُحَمَّدِ بْنِ عِيسى/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ مُحَمَّدِ بْنِ خَالِدٍ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ أَحْمَدَ/g, " " );
    text = text.replace( /عَنْ بَعْضِ أَصْحَابِهِ/g, " " );
    text = text.replace( /عَنْ عَبْدِ الرَّحْمنِ بْنِ الْحَجَّاجِ/g, " " );
    text = text.replace( /عَنِ ابْنِ أَبِي عُمَيْرٍ/g, " " );
    text = text.replace( /عَنِ ابْنِ سِنَانٍ/g, " " );
    text = text.replace( /عَنْ مُنْذِرِ بْنِ يَزِيدَ/g, " " );
    text = text.replace( /عَنِ الْمُفَضَّلِ بْنِ عُمَرَ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ عَبْدِ الْجَبَّارِ/g, " " );
    text = text.replace( /عَنْ سَهْلِ بْنِ زِيَادٍ/g, " " );
    text = text.replace( /عَنْ أَبِي سَعِيدٍ الْقَمَّاطِ/g, " " );
    text = text.replace( /عَنْ إِسْمَاعِيلَ بْنِ مِهْرَانَ/g, " " );
    text = text.replace( /عَنْ هَارُونَ بْنِ خَارِجَةَ/g, " " );
    text = text.replace( /عَنْ مَنْصُورِ بْنِ يُونُسَ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ يَحْيى/g, " " );
    text = text.replace( /عَنْ عَبْدِ الْحَمِيدِ بْنِ عَوَّاضٍ الطَّائِيِّ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ مُحَمَّدٍ/g, " " );
    text = text.replace( /عَنِ ابْنِ فَضَّالٍ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ إِبْرَاهِيمَ/g, " " );
    text = text.replace( /عَنْ بَكْرِ بْنِ صَالِحٍ/g, " " );
    text = text.replace( /عَنِ الْحَجَّالِ/g, " " );
    text = text.replace( /عَنْ جَعْفَرِ بْنِ مُحَمَّدٍ الْأَشْعَرِيِّ/g, " " );
    text = text.replace( /عَنِ النَّوْفَلِيِّ/g, " " );
    text = text.replace( /عَنْ مُعَلَّى بْنِ مُحَمَّدٍ/g, " " );
    text = text.replace( /عَنْ صَفْوَانَ/g, " " );
    text = text.replace( /عَنْ هِشَامِ بْنِ سَالِمٍ/g, " " );
    text = text.replace( /عَنْ دَاوُدَ بْنِ فَرْقَدٍ/g, " " );
    text = text.replace( /عَنِ الْقَاسِمِ بْنِ يَحْيى/g, " " );
    text = text.replace( /عَنْ جَدِّهِ الْحَسَنِ بْنِ رَاشِدٍ/g, " " );
    text = text.replace( /عَنْ أَبِي بَصِيرٍ/g, " " );
    text = text.replace( /عَنِ السَّكُونِيِّ/g, " " );
    text = text.replace( /عَنْ عَلِيِّ بْنِ أَسْبَاطٍ/g, " " );
    text = text.replace( /عَنْ مُوسَى بْنِ الْحَسَنِ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ عَبْدِ الْحَمِيدِ/g, " " );
    text = text.replace( /عَنْ سَعْدِ بْنِ طَرِيفٍ/g, " " );
    text = text.replace( /عَنْ هَارُونَ بْنِ الْجَهْمِ/g, " " );
    text = text.replace( /عَنِ الْمُفَضَّلِ بْنِ صَالِحٍ/g, " " );
    text = text.replace( /عَنِ الْحُسَيْنِ بْنِ سَعِيدٍ/g, " " );
    text = text.replace( /عَنْ مَنْصُورٍ/g, " " );
    text = text.replace( /عَنْ عُمَرَ بْنِ أُذَيْنَةَ/g, " " );
    text = text.replace( /عَنْ زُرَارَةَ/g, " " );
    text = text.replace( /عَنِ ابْنِ أَبِي نَجْرَانَ/g, " " );
    text = text.replace( /عَنْ‌ عَمَّارِ بْنِ حَكِيمٍ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ سِنَانٍ/g, " " );
    text = text.replace( /عَنْ طَلْحَةَ بْنِ زَيْدٍ/g, " " );
    text = text.replace( /عَنْ أَبِي نَهْشَلٍ/g, " " );
    text = text.replace( /عَنِ الْحَسَنِ بْنِ مَحْبُوبٍ/g, " " );
    text = text.replace( /عَنْ مَالِكِ بْنِ عَطِيَّةَ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ مُسْلِمٍ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ أَبِي عَبْدِ اللهِ/g, " " );
    text = text.replace( /عَنْ عَلِيِّ بْنِ الْحَكَمِ/g, " " );
    text = text.replace( /عَنْ دَاوُدَ بْنِ النُّعْمَانِ/g, " " );
    text = text.replace( /عَنْ إِبْرَاهِيمَ بْنِ عُثْمَانَ/g, " " );
    text = text.replace( /عَنْ أَبَانِ بْنِ عُثْمَانَ/g, " " );
    text = text.replace( /الْحَسَنِ بْنِ مُحَمَّدِ بْنِ سَمَاعَةَ/g, " " );
    text = text.replace( /عَنْ غَيْرِ وَاحِدٍ/g, " " );
    text = text.replace( /عَنْ إِسْحَاقَ بْنِ عَمَّارٍ/g, " " );
    text = text.replace( /عَنِ ابْنِ مَحْبُوبٍ/g, " " );
    text = text.replace( /وَسَهْلِ بْنِ زِيَادٍ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ الْفُضَيْلِ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ إِسْمَاعِيلَ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ إِسْحَاقَ/g, " " );
    text = text.replace( /عَنْ جَعْفَرِ بْنِ مُحَمَّدٍ الْبَغْدَادِيِّ/g, " " );
    text = text.replace( /إِسْحَاقَ الْجَعْفَرِيِّ/g, " " );
    text = text.replace( /عَنْ يَعْقُوبَ بْنِ سَالِمٍ/g, " " );
    text = text.replace( /عَنْ دَاوُدَ بْنِ الْحُصَيْنِ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ مُحَمَّدِ بْنِ أَبِي نَصْرٍ/g, " " );
    text = text.replace( /عَنْ حَمَّادِ بْنِ عُثْمَانَ/g, " " );
    text = text.replace( /عَنِ الْحَسَنِ بْنِ عَلِيٍّ الْوَشَّاءِ/g, " " );
    text = text.replace( /عَلِيُّ بْنُ مُحَمَّدٍ/g, " " );
    text = text.replace( /مُحَمَّدُ بْنُ الْحَسَنِ/g, " " );
    text = text.replace( /عَنْ عُبَيْدِ اللهِ بْنِ عَبْدِ اللهِ الدِّهْقَانِ/g, " " );
    text = text.replace( /عَنْ دُرُسْتَ الْوَاسِطِيِّ/g, " " );
    text = text.replace( /عَنْ إِبْرَاهِيمَ بْنِ عَبْدِ الْحَمِيدِ/g, " " );
    text = text.replace( /عَنْ دُرُسْتَ بْنِ أَبِي مَنْصُورٍ/g, " " );
    text = text.replace( /عِدَّةٌ مِنْ أَصْحَابِنَا/g, " " );
    text = text.replace( /عَنْ نُوحِ بْنِ شُعَيْبٍ النَّيْسَابُورِيِّ/g, " " );
    text = text.replace( /عَلِيُّ بْنُ إِبْرَاهِيمَ/g, " " );
    text = text.replace( /مُحَمَّدُ بْنُ إِسْمَاعِيلَ/g, " " );
    text = text.replace( /عَنِ الْفَضْلِ بْنِ شَاذَانَ/g, " " );
    text = text.replace( /بْنِ يَحْيى وَابْنِ أَبِي عُمَيْرٍ/g, " " );
    text = text.replace( /عَنْ أَبِي سَعِيدٍ الْمُكَارِي/g, " " );
    text = text.replace( /عَنِ الْبَرْقِيِّ/g, " " );
    text = text.replace( /عَنْ دَاوُدَ بْنِ أَبِي يَزِيدَ الْعَطَّارِ/g, " " );
    text = text.replace( /مُحَمَّدُ بْنُ يَحْيى/g, " " );
    text = text.replace( /عَنِ ابْنِ رِئَابٍ/g, " " );
    text = text.replace( /عَنْ بُكَيْرِ بْنِ أَعْيَنَ/g, " " );
    text = text.replace( /عَنْ جَعْفَرِ بْنِ سَمَاعَةَ/g, " " );
    text = text.replace( /عَنْ سَمَاعَةَ/g, " " );
    text = text.replace( /عَنْ عَبْدِ الْأَعْلى/g, " " );
    text = text.replace( /عَنْ عَلِيِّ بْنِ أَبِي حَمْزَةَ/g, " " );
    text = text.replace( /بْعِيِّ بْنِ عَبْدِ اللهِ/g, " " );
    text = text.replace( /عَنِ الْفُضَيْلِ بْنِ يَسَارٍ/g, " " );
    text = text.replace( /عَنِ الْحُسَيْنِ بْنِ خَالِدٍ/g, " " );
    text = text.replace( /عَنْ سَعْدٍ الْإِسْكَافِ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ يَحْيَى الْكَاهِلِيِّ/g, " " );
    text = text.replace( /اوِيَةَ بْنِ عَمَّارٍ/g, " " );
    text = text.replace( /يَحْيى ،/g, "،" );
    text = text.replace( /عَنِ الْحَسَنِ بْنِ عَلِيٍّ/g, " " );
    text = text.replace( /بْنِ يَعْقُوبَ/g, " " );
    text = text.replace( /عَنْ عُمَرَ بْنِ يَزِيدَ/g, " " );
    text = text.replace( /عَنْ عِيسَى الْفَرَّاءِ/g, " " );
    text = text.replace( /عَنْ حَمَّادِ بْنِ عِيسى/g, " " );
    text = text.replace( /عَنْ يَحْيَى بْنِ عُمَرَ/g, " " );
    text = text.replace( /بْنِ كُلَيْعٍ/g, " " );
    text = text.replace( /عَنْ‌ إِسْحَاقَ بْنِ عَمَّارٍ/g, " " );
    text = text.replace( /عَنْ يَحْيَى بْنِ الْمُبَارَكِ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ جَبَلَةَ/g, " " );
    text = text.replace( /عَنْ مُعَاوِيَةَ بْنِ وَهْبٍ/g, " " );
    text = text.replace( /مُحَمَّدُ بْنُ يَحْيَى الْعَطَّارُ/g, " " );
    text = text.replace( /عَنِ الْحَارِثِ بْنِ الْمُغِيرَةِ النَّصْرِيِّ/g, " " );
    text = text.replace( /عَنْ سُلَيْمَانَ بْنِ دَاوُدَ الْمِنْقَرِيِّ/g, " " );
    text = text.replace( /عَنْ حَفْصِ بْنِ غِيَاثٍ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ عَائِذٍ/g, " " );
    text = text.replace( /عَنِ ابْنِ أُذَيْنَةَ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ أَبِي عُمَيْرٍ/g, " " );
    text = text.replace( /وَبِهذَا الْإِسْنَادِ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ عُمَرَ الْحَلَّالِ/g, " " );
    text = text.replace( /عَنْ بُرَيْدٍ الْعِجْلِيِّ/g, " " );
    text = text.replace( /عَنْ إِبْرَاهِيمَ بْنِ عُمَرَ الْيَمَانِيِّ/g, " " );
    text = text.replace( /عَنْ سُلَيْمِ/g, " " );
    text = text.replace( /بْنِ قَيْسٍ الْهِلَالِيِّ/g, " " );
    text = text.replace( /فَضَالَةَ بْنِ أَيُّوبَ/g, " " );
    text = text.replace( /عَنِ النَّضْرِ بْنِ سُوَيْدٍ/g, " " );
    text = text.replace( /مُحَمَّدِ بْنِ خَالِدٍ جَمِيعاً/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ عُمَارَةَ/g, " " );
    text = text.replace( /عَنْ حَرِيزِ بْنِ عَبْدِ اللهِ/g, " " );
    text = text.replace( /عَبْدِ اللهِ بْنِ مُسْكَانَ/g, " " );
    text = text.replace( /عَنْ زَكَرِيَّا بْنِ عِمْرَانَ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ خَالِدٍ/g, " " );
    text = text.replace( /عَنِ الْفَتْحِ بْنِ يَزِيدَ الْجُرْجَانِيِّ/g, " " );
    text = text.replace( /عَنْ عَاصِمِ بْنِ حُمَيْدٍ/g, " " );
    text = text.replace( /عَنْ غِيَاثِ بْنِ إِبْرَاهِيمَ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ الْحَسَنِ بْنِ شَمُّونٍ/g, " " );
    text = text.replace( /عَنْ وُهَيْبِ بْنِ حَفْصٍ/g, " " );
    text = text.replace( /حُمَيْدُ بْنُ زِيَادٍ/g, " " );
    text = text.replace( /عَنِ ابْنِ سَمَاعَةَ/g, " " );
    text = text.replace( /عَنْ حَمَّادٍ/g, " " );
    text = text.replace( /عَنِ الْحَلَبِيِّ/g, " " );
    text = text.replace( /عَنِ ابْنِ بُكَيْرٍ/g, " " );
    text = text.replace( /عَنْ رَجُلٍ مِنْ أَصْحَابِنَا/g, " " );
    text = text.replace( /عَنْ عُبَيْدِ بْنِ زُرَارَةَ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ الْحَسَنِ/g, " " );
    text = text.replace( /عَنْ أَبِي الْعَبَّاسِ/g, " " );
    text = text.replace( /أَبِي الصَّبَّاحِ الْكِنَانِيِّ/g, " " );
    text = text.replace( /عَنِ ابْنِ مُسْكَانَ،/g, " " );
    text = text.replace( /مُحَمَّدِ بْنِ قَيْسٍ/g, " " );
    text = text.replace( /عَنْ عُثْمَانَ بْنِ عِيسى/g, " " );
    text = text.replace( /عَنِ الْحُسَيْنِ بْنِ سَيْفٍ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ سُلَيْمَانَ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ زِيَادٍ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ سِنَانٍ/g, " " );
    text = text.replace( /عَنِ الْقَاسِمِ بْنِ عُرْوَةَ/g, " " );
    text = text.replace( /عَنْ أَبِي هَاشِمٍ الْجَعْفَرِيِّ/g, " " );
    text = text.replace( /عَنْ زَيْدٍ الشَّحَّامِ/g, " " );
    text = text.replace( /عَنْ أَبِي جَمِيلَةَ/g, " " );
    text = text.replace( /عَنْ عَبْدِ الْحَمِيدِ/g, " " );
    text = text.replace( /عَنِ الْحُسَيْنِ بْنِ عُلْوَانَ/g, " " );
    text = text.replace( /، عَنْ رَجُلٍ ،/g, " " );
    text = text.replace( /عَنِ الْحَسَنِ بْنِ صَالِحٍ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ يَحْيَى الْخَثْعَمِيِّ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ عَبْدِ اللهِ بْنِ هِلَالٍ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ إِسْحَاقَ/g, " " );
    text = text.replace( /الْحُسَيْنُ بْنُ مُحَمَّدٍ/g, " " );
    text = text.replace( /عَنْ بَكْرِ بْنِ مُحَمَّدٍ الْأَزْدِيِّ/g, " " );
    text = text.replace( /عَنْ أَبِيهِ جَمِيعاً/g, " " );
    text = text.replace( /بَكْرُ بْنُ مُحَمَّدٍ/g, " " );
    text = text.replace( /عَنْ جُوَيْرَةَ/g, " " );
    text = text.replace( /عَنْ سَيْفِ بْنِ عَمِيرَةَ/g, " " );
    text = text.replace( /عَنْ مَنْصُورِ بْنِ حَازِمٍ/g, " " );
    text = text.replace( /عَنْ سَالِمٍ الْأَشَلِّ/g, " " );
    text = text.replace( /عَنْ أَبِي بَكْرٍ الْحَضْرَمِيِّ/g, " " );
    text = text.replace( /عَنْ بَعْضِ أَصْحَابِنَا/g, " " );
    text = text.replace( /عَنْ عُمَرَ بْنِ حَنْظَلَةَ/g, " " );
    text = text.replace( /عَنْ حَرِيزٍ/g, " " );
    text = text.replace( /أَبُو عَلِيٍّ الْأَشْعَرِيُّ/g, " " );
    text = text.replace( /عَنْ هَارُونَ بْنِ مُسْلِمٍ/g, " " );
    text = text.replace( /عَنْ مَسْعَدَةَ بْنِ صَدَقَةَ/g, " " );
    text = text.replace( /عَنْ أَبِي عَبْدِ اللهِ الْجَامُورَانِيِّ/g, " " );
    text = text.replace( /عَنْ سُلَيْمَانَ بْنِ جَعْفَرٍ الْجَعْفَرِيِّ/g, " " );
    text = text.replace( /عَنْ سُلَيْمَانَ الْجَعْفَرِيِّ/g, " " );
    text = text.replace( /عَنْ‌ عَمَّارِ بْنِ حَكِيمٍ/g, " " );
    text = text.replace( /عَنْ‌ عَلِيِّ بْنِ أَبِي حَمْزَةَ/g, " " );
    text = text.replace( /عَنْ أَبِي حَمْزَةَ/g, " " );
    text = text.replace( /عَنْ أَبِي مُحَمَّدٍ الْوَابِشِيِّ/g, " " );
    text = text.replace( /عَنْ يَحْيَى بْنِ عُقَيْلٍ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ عَبْدِ الرَّحْمنِ الْأَصَمِّ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ حَمَّادٍ الْأَنْصَارِيِّ/g, " " );
    text = text.replace( /يَحْيَى بْنِ عَبْدِ اللهِ بْنِ الْحَسَنِ/g, " " );
    text = text.replace( /عَنْ عَمِّهِ يَعْقُوبَ بْنِ سَالِمٍ/g, " " );
    text = text.replace( /أَبِي حَمَّادٍ جَمِيعاً/g, " " );
    text = text.replace( /عَنِ الْوَشَّاءِ/g, " " );
    text = text.replace( /عَنْ أَبِي خَدِيجَةَ/g, " " );
    text = text.replace( /عَلِيُّ بْنُ الْحَكَمِ/g, " " );
    text = text.replace( /عَنْ أَبَانٍ/g, " " );
    text = text.replace( /عَنْ أَبِي مَخْلَدٍ السَّرَّاجِ/g, " " );
    text = text.replace( /عَنْ عِيسَى بْنِ حَسَّانَ/g, " " );
    text = text.replace( /بْنِ الْمُغِيرَةِ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ مَالِكٍ/g, " " );
    text = text.replace( /مَوْلى آلِ سَامٍ/g, " " );
    text = text.replace( /عَنْ أَبِي إِسْحَاقَ الْخُرَاسَانِيِّ/g, " " );
    text = text.replace( /عَنْ عَطَاءٍ/g, " " );
    text = text.replace( /بْنِ عُمَرَ/g, " " );
    text = text.replace( /عَنِ ابْنِ أَبِي يَعْفُورٍ/g, " " );
    text = text.replace( /عَنْ عَبْدِ الرَّحْمنِ بْنِ حَمَّادٍ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ الْحُسَيْنِ/g, " " );
    text = text.replace( /، عَنْ شُعَيْبٍ ،/g, " " );
    text = text.replace( /عَنْ إِسْمَاعِيلَ/g, " " );
    text = text.replace( /عَنْ عَمَّارِ بْنِ مُوسى/g, " " );
    text = text.replace( /بْنِ مَرَّارٍ/g, " " );
    text = text.replace( /عَنْ‌ مُعَاوِيَةَ بْنِ وَهْبٍ/g, " " );
    text = text.replace( /عَنْ عَلِيِّ بْنِ النُّعْمَانِ/g, " " );
    text = text.replace( /عَنْ سَعِيدٍ الْأَعْرَجِ/g, " " );
    text = text.replace( /عَنْ عَمْرِو بْنِ سَعِيدٍ/g, " " );
    text = text.replace( /عَنْ يَعْقُوبَ بْنِ يَزِيدَ/g, " " );
    text = text.replace( /بْنِ جَابِرٍ/g, " " );
    text = text.replace( /عَنْ أَبِي الْجَارُودِ/g, " " );
    text = text.replace( /عَنِ الْعَلَاءِ بْنِ رَزِينٍ/g, " " );
    text = text.replace( /عَمَّنْ ذَكَرَهُ/g, " " );
    text = text.replace( /عَنْ دُرُسْتَ/g, " " );
    text = text.replace( /عَنْ أَحْمَدَ بْنِ عَبْدِ اللهِ الْأَسَدِيِّ/g, " " );
    text = text.replace( /عَنْ مُفَضَّلِ بْنِ صَالِحٍ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ حَسَّانَ/g, " " );
    text = text.replace( /عَنْ أَبِي مُحَمَّدٍ الرَّازِيِّ/g, " " );
    text = text.replace( /عَنْ هِشَامِ بْنِ الْحَكَمِ/g, " " );
    text = text.replace( /سَعِيدِ بْنِ جَنَاحٍ/g, " " );
    text = text.replace( /عَنْ مُطَرِّفٍ مَوْلى مَعْنٍ/g, " " );
    text = text.replace( /عَنْ عَلِيِّ بْنِ أَبِي الْمُغِيرَةِ/g, " " );
    text = text.replace( /الْقَاسِمِ بْنِ مُحَمَّدٍ الْجَوْهَرِيِّ/g, " " );
    text = text.replace( /عَنْ مُحَمَّدِ بْنِ مَرْوَانَ/g, " " );
    text = text.replace( /عَنْ‌ عَبْدِ اللهِ بْنِ عَبْدِ الرَّحْمنِ/g, " " );
    text = text.replace( /عَنْ خَلَفِ بْنِ حَمَّادٍ/g, " " );
    text = text.replace( /عَنْ وَهْبٍ الْجُرَيْرِيِّ/g, " " );
    text = text.replace( /عَنْ عُبَيْسِ بْنِ هِشَامٍ/g, " " );
    text = text.replace( /عَنْ عَبْدِ الصَّمَدِ بْنِ بَشِيرٍ/g, " " );
    text = text.replace( /عَنْ عَمْرِو بْنِ جُمَيْعٍ/g, " " );
    text = text.replace( /عَنِ الْحَكَمِ بْنِ عُتَيْبَةَ/g, " " );
    text = text.replace( /عَنْ مِسْمَعِ بْنِ عَبْدِ الْمَلِكِ/g, " " );
    text = text.replace( /عَنْ عَلِيٍّ الْأَحْمَسِيِّ/g, " " );
    text = text.replace( /عَنْ عَبْدِ اللهِ بْنِ الْقَاسِمِ/g, " " );

    text = text.replace( /، عَنْ أَبِيهِ ،/g, "، ،" );

    return text;

}

// .. ======================================================================
