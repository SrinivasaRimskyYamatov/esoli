function bf(code, input = "") {
    // Brainfuck命令以外は無視（コメント扱い）
    code = code.replace(/[^\+\-\<\>\[\]\.,]/g, "");

    const mem = new Uint8Array(30000);
    let ptr = 0;
    let pc = 0;
    let inputPtr = 0;
    let output = "";

    // ループ対応マップ
    const loopMap = {};
    const stack = [];

    for (let i = 0; i < code.length; i++) {
        if (code[i] === "[") {
            stack.push(i);
        } else if (code[i] === "]") {
            if (stack.length === 0) {
                throw new Error("Unmatched ] at " + i);
            }
            const start = stack.pop();
            loopMap[start] = i;
            loopMap[i] = start;
        }
    }

    if (stack.length !== 0) {
        throw new Error("Unmatched [ at " + stack.pop());
    }

    // 無限ループ対策（任意）
    let steps = 0;
    const MAX_STEPS = 10_000_000;

    while (pc < code.length) {
        if (++steps > MAX_STEPS) {
            throw new Error("Step limit exceeded (possible infinite loop)");
        }

        const cmd = code[pc];

        switch (cmd) {
            case ">":
                ptr++;
                if (ptr >= mem.length) {
                    throw new Error("Pointer overflow");
                }
                break;

            case "<":
                ptr--;
                if (ptr < 0) {
                    throw new Error("Pointer underflow");
                }
                break;

            case "+":
                mem[ptr] = (mem[ptr] + 1) & 255;
                break;

            case "-":
                mem[ptr] = (mem[ptr] - 1) & 255;
                break;

            case ".":
                output += String.fromCharCode(mem[ptr]);
                break;

            case ",":
                mem[ptr] = inputPtr < input.length
                    ? input.charCodeAt(inputPtr++)
                    : 0;
                break;

            case "[":
                if (mem[ptr] === 0) {
                    pc = loopMap[pc];
                }
                break;

            case "]":
                if (mem[ptr] !== 0) {
                    pc = loopMap[pc];
                }
                break;
        }

        pc++;
    }

    return output;
}
