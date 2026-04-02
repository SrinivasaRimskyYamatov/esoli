// deadfish.js 完全版
function deadfish(code) {
    const mem = [0];  // メモリは1セルだけ
    let ptr = 0;
    let output = "";
    const LIMIT = 100000;
    let steps = 0;

    for(let ip = 0; ip < code.length; ip++){
        if(++steps > LIMIT) throw new Error("Step limit exceeded");

        const cmd = code[ip];
        switch(cmd){
            case 'i':  // increment
                mem[ptr]++;
                break;
            case 'd':  // decrement
                mem[ptr]--;
                break;
            case 's':  // square
                mem[ptr] = mem[ptr]*mem[ptr];
                break;
            case 'o':  // output
                output += mem[ptr];
                break;
            default:
                // 無視
                break;
        }
    }

    return output;
}

window.deadfish = deadfish;