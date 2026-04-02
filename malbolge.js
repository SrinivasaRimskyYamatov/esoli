// ===== 安全完全版 Malbolge インタプリタ =====
const malbolge = (function() {
    const xlat1 = "+b(29e*j1VMEKLyC})8&m#~W>qxdRp0wkrUo[D7,XTcA\"lI.v%{gJh4G\\-=O@5`_3i<?Z';FNQuY]szf$!BS/|t:Pn6^Ha";
    const xlat2 = "5z]&gqtyfr$(we4{WP)H-Zn,[%\\3dL+Q;>U!pJS72FhOA1CB6v^=I_0/8|jsb9m<.TVac`uY*MK'X~xDl}REokN:#?G\"i@";

    function op(x, y) {
        const p9 = [1, 9, 81, 729, 6561];
        const o = [
            [4,3,3,1,0,0,1,0,0],
            [4,3,5,1,0,2,1,0,2],
            [5,5,4,2,2,1,2,2,1],
            [4,3,3,1,0,0,7,6,6],
            [4,3,5,1,0,2,7,6,8],
            [5,5,4,2,2,1,8,8,7],
            [7,6,6,7,6,6,4,3,3],
            [7,6,8,7,6,8,4,3,5],
            [8,8,7,8,8,7,5,5,4]
        ];
        let i = 0;
        for (let j = 0; j < 5; j++) {
            i += o[Math.floor(y / p9[j]) % 9][Math.floor(x / p9[j]) % 9] * p9[j];
        }
        return i % 59049;
    }

    return function(code, input="") {
        const MEM_SIZE = 59049;
        const mem = new Uint16Array(MEM_SIZE);
        let i = 0;

        // ===== 読み込み =====
        for (let ch of code) {
            if (/\s/.test(ch)) continue;
            let x = ch.charCodeAt(0);
            if (i >= MEM_SIZE) throw new Error("input too long");
            mem[i++] = x;
        }

        // ===== メモリ初期化 =====
        while (i < MEM_SIZE) {
            mem[i] = op(mem[i-1], mem[i-2]);
            i++;
        }

        // ===== 実行 =====
        let a = 0, c = 0, d = 0;
        let output = "";
        let inputPtr = 0;
        const LIMIT = 10000000;
        let steps = 0;

        while (true) {
            if (++steps > LIMIT) throw new Error("step limit exceeded");

            let v = mem[c];
            if (v < 33 || v > 126) {
                c = (c + 1) % MEM_SIZE;
                d = (d + 1) % MEM_SIZE;
                continue;
            }

            let cmd = xlat1[(v - 33 + c) % 94];

            switch(cmd) {
                case 'j': d = mem[d] % MEM_SIZE; break;
                case 'i': c = mem[d] % MEM_SIZE; break;
                case '*':
                    mem[d] = (Math.floor(mem[d]/3) + (mem[d]%3)*19683) % MEM_SIZE;
                    a = mem[d];
                    break;
                case 'p':
                    mem[d] = op(a, mem[d]);
                    a = mem[d];
                    break;
                case '<':
                    output += String.fromCharCode(a & 0xFF);
                    break;
                case '/':
                    if (inputPtr >= input.length) a = 59048;
                    else a = input.charCodeAt(inputPtr++);
                    break;
                case 'v': return output;
            }

            // 命令自己書き換え（33〜126）
            mem[c] = 33 + (xlat2[mem[c]-33].charCodeAt(0) - 33) % 94;

            c = (c + 1) % MEM_SIZE;
            d = (d + 1) % MEM_SIZE;
        }
    };
})();

window.malbolge = malbolge;