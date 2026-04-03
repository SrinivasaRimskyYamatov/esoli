function bflak(code) {
    // 有効文字のみ
    code = code.replace(/[^()\[\]{}<>]/g, "");

    let i = 0;

    // 左右スタック
    const stacks = [[], []];
    let active = 0; // 0:左, 1:右

    // --- スタック操作 ---
    function pop() {
        return stacks[active].length ? stacks[active].pop() : 0;
    }

    function peek() {
        return stacks[active].length
            ? stacks[active][stacks[active].length - 1]
            : 0;
    }

    function push(v) {
        stacks[active].push(v);
    }

    // --- 対応括弧検索 ---
    function findMatching(pos) {
        const open = code[pos];
        const close = { "(": ")", "[": "]", "{": "}", "<": ">" }[open];

        let depth = 1;

        for (let j = pos + 1; j < code.length; j++) {
            if (code[j] === open) depth++;
            else if (code[j] === close) {
                depth--;
                if (depth === 0) return j + 1;
            }
        }

        throw new Error("Unmatched " + open + " at " + pos);
    }

    // --- 式評価（コア） ---
    function evalExpr(endChar = null) {
        let sum = 0;

        while (i < code.length) {
            const c = code[i++];

            // 対応括弧で終了
            if (endChar && c === endChar) {
                return sum;
            }

            switch (c) {

                // () または (foo)
                case "(":
                    if (code[i] === ")") {
                        i++;
                        sum += 1;
                    } else {
                        const val = evalExpr(")");
                        push(val);
                        sum += val;
                    }
                    break;

                // [] または [foo]
                case "[":
                    if (code[i] === "]") {
                        i++;
                        sum += stacks[active].length;
                    } else {
                        const val = evalExpr("]");
                        sum += -val;
                    }
                    break;

                // {} または {foo}
                case "{":
                    if (code[i] === "}") {
                        i++;
                        sum += pop();
                    } else {
                        let total = 0;
                        const start = i;

                        // while top != 0
                        while (peek() !== 0) {
                            i = start;
                            total += evalExpr("}");
                        }

                        // 対応位置へジャンプ
                        i = findMatching(i - 1);
                        sum += total;
                    }
                    break;

                // <> または <foo>
                case "<":
                    if (code[i] === ">") {
                        i++;
                        active ^= 1; // スタック切替
                    } else {
                        const saved = active;
                        active ^= 1;
                        evalExpr(">");
                        active = saved;
                    }
                    break;

                default:
                    throw new Error("Invalid char: " + c);
            }
        }

        return sum;
    }

    // 実行
    evalExpr();

    // 出力（アクティブスタック）
    return stacks[active].join("\n");
}