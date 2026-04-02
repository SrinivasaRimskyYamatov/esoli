function commdis(code, inputFn) {
    const mem = Array(30000).fill(0);  // メモリ 30000 セル
    let ptr = 0;                        // ポインタ
    let output = "";                     // 出力文字列
    const LIMIT = 1000000;              // 実行ステップ上限
    let steps = 0;

    // すべての命令にマッチする正規表現（命令が連続してもOK）
    const instructionRegex = /ｱｱ…|ｱｱ､|ｱ…|ｱ､|ｴｯﾄ…|ｴｯﾄ､|ｻｾﾝ…|ｯｽ…|ｱｯ…|ｱｯ､|ｱﾉ…|ｱﾉ､|ｱｰ…|ｱｰ､|ｴ…|ｴ､|ｴｯ…|ｴｯ\?/g;

    // 命令配列に分割
    const commands = code.match(instructionRegex) || [];

    // ループ用ジャンプマップ作成
    const bracketMap = {};
    const stack = [];
    for (let i = 0; i < commands.length; i++) {
        if (commands[i] === "ｻｾﾝ…") stack.push(i);
        if (commands[i] === "ｯｽ…") {
            const start = stack.pop();
            bracketMap[start] = i;
            bracketMap[i] = start;
        }
    }

    // コード実行
    for (let ip = 0; ip < commands.length; ip++) {
        if (++steps > LIMIT) throw new Error("Step limit exceeded");

        const cmd = commands[ip];
        switch(cmd) {
            case "ｱｱ…": ptr++; break;
            case "ｱｱ､": ptr--; break;
            case "ｱ…": mem[ptr] = (mem[ptr] + 1) & 0xFF; break;
            case "ｱ､": mem[ptr] = (mem[ptr] - 1) & 0xFF; break;
            case "ｴｯﾄ…": output += String.fromCharCode(mem[ptr]); break;
            case "ｴｯﾄ､":
                mem[ptr] = (typeof inputFn === "function" ? inputFn() : 0) & 0xFF;
                break;
            case "ｻｾﾝ…": if(mem[ptr] === 0) ip = bracketMap[ip]; break;
            case "ｯｽ…": if(mem[ptr] !== 0) ip = bracketMap[ip]; break;
            case "ｱｯ…": mem[ptr+1] = (mem[ptr] | mem[ptr+1]) & 0xFF; ptr++; break;
            case "ｱｯ､": mem[ptr+1] = (mem[ptr] & mem[ptr+1]) & 0xFF; ptr++; break;
            case "ｱﾉ…": mem[ptr] = (~mem[ptr]) & 0xFF; break;
            case "ｱﾉ､": mem[ptr+1] = (mem[ptr] ^ mem[ptr+1]) & 0xFF; ptr++; break;
            case "ｱｰ…": mem[ptr] = (mem[ptr] << 1) & 0xFF; break;
            case "ｱｰ､": mem[ptr] = (mem[ptr] >> 1) & 0xFF; break;
            case "ｴ…": ptr += mem[ptr]; break;
            case "ｴ､": ptr -= mem[ptr]; break;
            case "ｴｯ…": mem[ptr] = 0; break;
            case "ｴｯ?": ptr = 0; break;
        }
    }

    return output;
}

// グローバルに登録
window.commdis = commdis;