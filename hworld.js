// hworld.js
window.hworld = function(code) {
    let output = "";
    const tokens = code.match(/hh|ww|hw|wh|h|w|q|./g) || [];

    for (let t of tokens) {
        switch (t) {
            case "hh": output += "Hello, Hello!"; break;
            case "h":  output += "Hello!"; break;
            case "ww": output += "World, World!"; break;
            case "w":  output += "World!"; break;
            case "hw": output += "Hello, World!"; break;
            case "wh": output += "World, Hello!"; break;
            case "q":  return output;  // 終了
            default:
                // 誤った命令はそのまま出力
                output += t;
        }
    }

    return output;
};
