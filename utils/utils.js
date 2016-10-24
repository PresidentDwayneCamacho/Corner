
// test if string is email address and returns prefix of address

function regexFactor(email){
    var re = new RegExp('^[a-zA-Z]+@cpp.edu$');
    if(!re.test(email)){
        return null;
    }
    return email.split('@')[0];
}
module.exports = regexFactor;

