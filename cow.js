// cow-full.js
window.cow = function(code, input="") {
    const mem = new Array(30000).fill(0);
    let ptr = 0;
    let output = "";
    const inputArr = input.split('').map(c => c.charCodeAt(0));
    let inputPtr = 0;
    const LIMIT = 500000;
    let steps = 0;
    let reg = null; // MMM命令用レジスタ

    // Cow命令抽出（大文字小文字を区別）
    const regex = /(moO|mOo|MoO|MOo|oom|OOM|MOO|moo|mOO|OOO|MMM|Moo)/g;
    const tokens = code.match(regex) || [];

    const loopStack = [];
    for(let ip=0; ip<tokens.length; ip++){
        if(++steps > LIMIT) throw new Error("Step limit exceeded");
        const cmd = tokens[ip];
        switch(cmd){
            case 'moO': ptr++; break;
            case 'mOo': ptr--; break;
            case 'MoO': mem[ptr] = (mem[ptr]+1)&0xFF; break;
            case 'MOo': mem[ptr] = (mem[ptr]-1+256)&0xFF; break;
            case 'oom': mem[ptr] = inputPtr < inputArr.length ? inputArr[inputPtr++] : 0; break;
            case 'OOM': output += String.fromCharCode(mem[ptr]); break;
            case 'MOO':
                if(mem[ptr] === 0){
                    let nest = 1;
                    while(nest > 0){
                        ip++;
                        if(ip >= tokens.length) throw new Error("Loop mismatch");
                        if(tokens[ip]==='MOO') nest++;
                        else if(tokens[ip]==='moo') nest--;
                    }
                } else loopStack.push(ip);
                break;
            case 'moo':
                if(mem[ptr] !== 0){
                    if(loopStack.length === 0) throw new Error("Loop mismatch");
                    ip = loopStack[loopStack.length-1]-1; // -1 で次ループで ip++される
                } else loopStack.pop();
                break;
            case 'mOO':
                // ポインタの値を特定の命令として実行、3は無効
                if(mem[ptr] === 3) break; // 無効
                if(mem[ptr] === 0) ptr++;         // 例: 0→'>' 相当
                else if(mem[ptr] === 1) ptr--;    // 1→'<'
                else if(mem[ptr] === 2) mem[ptr] = (mem[ptr]+1)&0xFF; // 2→'+'
                // それ以外は無視
                break;
            case 'OOO':
                mem[ptr] = 0; break;
            case 'MMM':
                if(reg === null){ reg = mem[ptr]; mem[ptr]=0; } 
                else { mem[ptr] = reg; reg = null; }
                break;
            case 'Moo':
                if(mem[ptr] === 0){
                    // "oom" を即実行
                    mem[ptr] = inputPtr < inputArr.length ? inputArr[inputPtr++] : 0;
                } else {
                    // "OOM" を即実行
                    output += String.fromCharCode(mem[ptr]);
                }
                break;
        }
    }

    return output;
};
