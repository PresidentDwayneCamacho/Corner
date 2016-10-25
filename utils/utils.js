
// test if string is email address and returns prefix of address

function regexFactor(email){
    var re = new RegExp('^[a-zA-Z]+@cpp.edu$');
    if(!re.test(email)){
        return null;
    }
    return email.split('@')[0];
}

function isPrime(value){
    for(var i = 2; i < value; i++) {
        if(value % i==0) {
            return false;
        }
    }
    return true;
}

module.exports = {
    regexFactor,
    isPrime
}