// HQ9+ Interpreter (JavaScript)
function hq9p(code) {
    let output = "";
    const bottlesOfBeer = () => {
        let s = "";
        for (let i = 99; i > 0; i--) {
            s += `${i} bottle${i>1?'s':''} of beer on the wall, ${i} bottle${i>1?'s':''} of beer.\n`;
            s += `Take one down and pass it around, ${i-1>0?i-1:'no more'} bottle${i-1!==1?'s':''} of beer on the wall.\n\n`;
        }
        s += "No more bottles of beer on the wall, no more bottles of beer.\n";
        s += "Go to the store and buy some more, 99 bottles of beer on the wall.\n";
        return s;
    };

    for (let ch of code) {
        switch(ch) {
            case 'H': output += "Hello, World!"; break;
            case 'Q': output += code; break;
            case '9': output += bottlesOfBeer(); break;
            case '+': /* 無意味な累算、無視 */ break;
        }
    }

    return output;
}

// グローバルに公開
window.hq9p = hq9p;
