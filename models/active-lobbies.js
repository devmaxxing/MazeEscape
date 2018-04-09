let passwordList = {}

let addToList = (name, password) => {
    if (!(name in passwordList)) {
        passwordList[name] = password;
    }
    console.log(passwordList);
}

let removeFromList = (name) => {
    if (name in passwordList) {
        delete passwordList[name];
    }
}

let hasPassword = (name) => {
    let hasPass = false;
    if (name in passwordList) {
        if (passwordList[name] != '') {
            hasPass = true;
        }
    }
    return hasPass;
}

let checkPassword = (name, password) => {
    return (password == passwordList[name]);
}

let inList = (name) => {
    return (name in passwordList);
}

module.exports = {
    addToList: addToList,
    removeFromList: removeFromList,
    hasPassword: hasPassword,
    checkPassword: checkPassword,
    inList: inList
};