const { createHash } = require('crypto');
const { Student } = require('./database')

async function createAccount(email, password, firstName, lastName, gpa) {
    const hash = createHash('sha256').update(password).digest('hex');
    
    const otherEmail = await Student.searchEmail(email);

    if(otherEmail != null) {
        return "Account Already Exists";
    }

    await Student.create({
        email: email,
        firstName: firstName,
        lastName: lastName,
        gpa: gpa,
        password: hash
    })

    return "Success!";
}

async function login(email, password) {
    console.log(password)
    console.log(email)
    const hash = createHash('sha256').update(password).digest('hex');
    console.log(hash);

    const student = await Student.searchEmail(email);

    if (student == null) {
        return "Account does not exist.";
    }

    //const student = await Student.get(id);

    if(student.password == hash) {
        return "Success!"
    }
    else {
        return "Incorrect Password";
    }
}

module.exports = { createAccount, login }