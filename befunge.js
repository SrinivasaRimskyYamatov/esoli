// Befunge-93 Interpreter
function befunge(code, input = "") {
    // Befungeの仕様上のグリッド
    const WIDTH = 80;
    const HEIGHT = 25;
    const grid = Array.from({length: HEIGHT}, () => Array(WIDTH).fill(' '));

    // コードをグリッドに展開
    const lines = code.split('\n');
    for (let y = 0; y < Math.min(HEIGHT, lines.length); y++) {
        for (let x = 0; x < Math.min(WIDTH, lines[y].length); x++) {
            grid[y][x] = lines[y][x];
        }
    }

    // スタック
    const stack = [];
    const push = v => stack.push(v);
    const pop = () => stack.length > 0 ? stack.pop() : 0;

    // ポインタ
    let x = 0, y = 0;
    let dx = 1, dy = 0;

    // 文字列モード
    let stringMode = false;

    // 入力管理
    let inputPtr = 0;

    let output = "";

    // 無限ループ対策
    let steps = 0;
    const MAX_STEPS = 10_000_000;

    while (true) {
        if (++steps > MAX_STEPS) {
            throw new Error("Step limit exceeded (possible infinite loop)");
        }

        let instr = grid[y][x];

        if (stringMode && instr !== '"') {
            push(instr.charCodeAt(0));
        } else {
            switch(instr) {
                // 数字
                case '0': case '1': case '2': case '3': case '4':
                case '5': case '6': case '7': case '8': case '9':
                    push(parseInt(instr));
                    break;

                // 算術
                case '+': push(pop() + pop()); break;
                case '-': { const b = pop(), a = pop(); push(a - b); } break;
                case '*': push(pop() * pop()); break;
                case '/': { const b = pop(), a = pop(); push(b===0?0:Math.floor(a / b)); } break;
                case '%': { const b = pop(), a = pop(); push(b===0?0:a % b); } break;

                // ロジック
                case '!': push(pop() === 0 ? 1 : 0); break;
                case '`': { const b = pop(), a = pop(); push(a > b ? 1 : 0); } break;

                // ポインタ移動
                case '>': dx=1; dy=0; break;
                case '<': dx=-1; dy=0; break;
                case '^': dx=0; dy=-1; break;
                case 'v': dx=0; dy=1; break;
                case '?': // ランダム方向
                    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
                    [dx,dy] = dirs[Math.floor(Math.random()*4)];
                    break;

                // 条件分岐
                case '_': { const a = pop(); dx = a === 0 ? 1 : -1; dy=0; } break;
                case '|': { const a = pop(); dy = a === 0 ? 1 : -1; dx=0; } break;

                // スタック操作
                case ':': push(stack.length > 0 ? stack[stack.length-1] : 0); break;
                case '\\': { const a=pop(), b=pop(); push(a); push(b); } break;
                case '$': pop(); break;

                // 出力
                case '.': output += pop().toString() + " "; break;
                case ',': output += String.fromCharCode(pop()); break;

                // 文字列モード
                case '"': stringMode = !stringMode; break;

                // コード操作（未実装）
                case '#': x = (x + dx + WIDTH) % WIDTH; y = (y + dy + HEIGHT) % HEIGHT; break;

                // 終了
                case '@': return output;

                // 入力
                case '&': { 
                    let val = inputPtr < input.length ? parseInt(input[inputPtr++]) : 0; 
                    push(val); 
                } break;
                case '~': {
                    let ch = inputPtr < input.length ? input.charCodeAt(inputPtr++) : 0;
                    push(ch);
                } break;

                // 空白 or その他
                case ' ':
                    break;
                default:
                    // 無視
                    break;
            }
        }

        // ポインタ更新（ラップアラウンド）
        x = (x + dx + WIDTH) % WIDTH;
        y = (y + dy + HEIGHT) % HEIGHT;
    }
}
