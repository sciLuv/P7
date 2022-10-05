//boolean, if string is only whitespace and linebreak it's false
function whiteSpaceVerification(string) {
    return string.replace(/ /g, '').replace(/\r\n|\r|\n/g, '').length > 0;
}

export default whiteSpaceVerification;
