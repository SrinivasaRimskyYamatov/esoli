// symbolic.js
window.symbolic = function(code, input="") {
    const stack = [];
    const inputArr = input.split('').map(c => c.charCodeAt(0));
    let inputPtr = 0;
    let output = "";
    const loopStack = [];

    const getTop = () => stack.length ? stack[stack.length-1] : 0;
    const popTop = () => stack.length ? stack.pop() : 0;

    for (let ip = 0; ip < code.length; ip++) {
        const cmd = code[ip];

        switch(cmd) {
            case '!': // duplicate top
                stack.push(getTop());
                break;
            case '@': // pop and print as character
                output += String.fromCharCode(popTop());
                break;
            case '#': // pop and print as number
                output += popTop();
                break;
            case '$': // swap top two
                if (stack.length >= 2) {
                    const a = popTop();
                    const b = popTop();
                    stack.push(a);
                    stack.push(b);
                } else if (stack.length === 1) {
                    // swap top with 0 if only one element
                    stack.push(popTop());
                }
                break;
            case '%': // rotate right
                if (stack.length > 1) {
                    const top = popTop();
                    stack.unshift(top);
                }
                break;
            case '^': // increment top
                if (stack.length) stack[stack.length-1] = (stack[stack.length-1]+1)&0xFF;
                else stack.push(1);
                break;
            case '&': // pop and push stack[value]
                const idx = popTop();
                stack.push(stack[idx] !== undefined ? stack[idx] : 0);
                break;
            case '*': // read 1 byte input and add to top
                const c = inputPtr < inputArr.length ? inputArr[inputPtr++] : 0;
                if (stack.length) stack[stack.length-1] += c;
                else stack.push(c);
                break;
            case '(': // loop start
                loopStack.push(ip);
                if (getTop() === 0) {
                    // skip to matching )
                    let nest = 1;
                    while (nest > 0) {
                        ip++;
                        if (ip >= code.length) throw new Error("Loop mismatch: '(' without ')'");
                        if (code[ip] === '(') nest++;
                        else if (code[ip] === ')') nest--;
                    }
                    loopStack.pop();
                }
                break;
            case ')': // loop end
                if (loopStack.length === 0) throw new Error("Loop mismatch: ')' without '('");
                if (getTop() !== 0) {
                    ip = loopStack[loopStack.length-1];
                } else {
                    loopStack.pop();
                }
                break;
            case '_': // negate top
                if (stack.length) stack[stack.length-1] = -getTop();
                else stack.push(0);
                break;
            case '+': // pop and add to new top
                const val = popTop();
                if (stack.length) stack[stack.length-1] += val;
                else stack.push(val);
                break;
            case '?': // print state info
                console.log("STACK:", stack.slice());
                break;
            default: // push char code
                stack.push(cmd.charCodeAt(0));
                break;
        }
    }

    return output;
};
