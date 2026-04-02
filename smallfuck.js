// smallfuck.js
function smallfuck(code) {
    const mem = [0,0,0,0,0,0,0,0,0,0]; // 10セルだけ
    let ptr=0, output="", ip=0;
    const LIMIT = 10000;
    let steps = 0;

    while(ip<code.length){
        if(++steps>LIMIT) throw new Error("Step limit exceeded");
        const cmd = code[ip];
        switch(cmd){
            case '>': ptr = Math.min(ptr+1, mem.length-1); break;
            case '<': ptr = Math.max(ptr-1,0); break;
            case '+': mem[ptr]^=1; break; // 0<->1
            case '[':
                if(mem[ptr]===0){
                    let loop=1;
                    while(loop>0){ ip++; if(code[ip]==='[') loop++; else if(code[ip]===']') loop--; }
                }
                break;
            case ']':
                if(mem[ptr]!==0){
                    let loop=1;
                    while(loop>0){ ip--; if(code[ip]===']') loop++; else if(code[ip]==='[') loop--; }
                }
                break;
        }
        ip++;
    }

    output = mem.join('');
    return output;
}

window.smallfuck = smallfuck;
