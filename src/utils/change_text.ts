const changeText = (text: string, step: number, status: string) => {
    let res = "";
    for (let index = 0; index < text.length; index++) {
        if (index % 2 === 0) {
            if(status === "get")
                res += String.fromCharCode(text.charCodeAt(index) - step);
            else
                res += String.fromCharCode(text.charCodeAt(index) + step);
        } else {
            if(status === "get")
                res += String.fromCharCode(text.charCodeAt(index) + step);
            else
                res += String.fromCharCode(text.charCodeAt(index) - step);
        }
    }

    return res;
};

export default changeText;