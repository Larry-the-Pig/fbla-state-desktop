const { createHash } = require('crypto');
const { Student } = require('./database')

async function createAccount(email, password, firstName, lastName, gradeLevel, gpa) {
    
    const hash = createHash('sha256').update(password).digest('hex');
    
    const otherEmail = await Student.searchEmail(email);

    if(otherEmail != null) {
        return "Error: Account Already Exists";
    }

    const id = await Student.create({
        email: email,
        firstName: firstName,
        lastName: lastName,
        gpa: gpa,
        password: hash,
        points: 0,
        gradeLevel: gradeLevel,
        eventsAttended: []
    })

    return id;
}

async function login(email, password, cookie) {
    const hash = createHash('sha256').update(password).digest('hex');

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