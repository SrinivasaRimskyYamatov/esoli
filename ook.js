// ook.js
window.ook = function(code, input="") {
    const mem = new Array(30000).fill(0);
    let ptr = 0;
    let output = "";
    const inputArr = input.split('').map(c=>c.charCodeAt(0));
    let inputPtr = 0;
    const LIMIT = 500000;
    let steps = 0;

    // Ook! 命令ペア抽出
    const regex = /(Ook[.!?])\s*(Ook[.!?])/g;
    const tokens = [];
    let match;
    while(match = regex.exec(code)) {
        tokens.push(match[1] + " " + match[2]);
    }

    // Ook! -> Brainfuck マッピング
    const map = {
        "Ook. Ook?": ">",
        "Ook? Ook.": "<",
        "Ook. Ook.": "+",
        "Ook! Ook!": "-",
        "Ook! Ook.": ".",
        "Ook. Ook!": ",",
        "Ook! Ook?": "[",
        "Ook? Ook!": "]"
    };

    const bf = tokens.map(t => map[t] || '').join('');

    const loopStack = [];
    for(let ip=0; ip<bf.length; ip++){
        if(++steps > LIMIT) throw new Error("Step limit exceeded");
        const cmd = bf[ip];
        switch(cmd){
            case '>': ptr++; break;
            case '<': ptr--; break;
            case '+': mem[ptr] = (mem[ptr]+1)&0xFF; break;
            case '-': mem[ptr] = (mem[ptr]-1+256)&0xFF; break;
            case '.': output += String.fromCharCode(mem[ptr]); break;
            case ',': mem[ptr] = inputPtr < inputArr.length ? inputArr[inputPtr++] : 0; break;
            case '[':
                if(mem[ptr] === 0){
                    let nest=1;
                    while(nest>0){
                        ip++;
                        if(ip >= bf.length) throw new Error("Loop mismatch");
                        if(bf[ip]==='[') nest++;
                        else if(bf[ip]===']') nest--;
                    }
                } else loopStack.push(ip);
                break;
            case ']':
                if(mem[ptr] !== 0){
                    if(loopStack.length===0) throw new Error("Loop mismatch");
                    ip = loopStack[loopStack.length-1];
                } else loopStack.pop();
                break;
        }
    }

    return output;
};