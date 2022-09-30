const { Client, Entity, Schema, Repository } = require('redis-om');

const client = new Client();

async function connect() {
    if (!client.isOpen()) {
        await client.open('redis://localhost:6379');
        await studentRepository.createIndex();
    }
}

connect();

class Student extends Entity { }

const schema = new Schema(Student, {
    firstName: { type: 'string'},
    lastName: { type: 'string'},
    email: { type: 'string'},
    points: { type: 'number', sortable: true },
    gpa: { type: 'number'}
})

const studentRepository = client.fetchRepository(schema)

async function createStudent(data) {
    await connect();

    const student = studentRepository.createEntity()
    student.firstName = data.firstName;
    student.lastName = data.lastName;
    student.email = data.email;
    student.points = data.points;
    student.gpa = data.gpa;
    const id = await studentRepository.save(student);

    return id;
}

async function editStudent(id, data) {
    await connect();

    const student = await studentRepository.fetch(id);

    student.firstName = data.firstName;
    student.lastName = data.lastName;
    student.email = data.email;
    student.points = data.points;
    student.gpa = data.gpa;
    
    return await studentRepository.save(student);
}

async function getStudent(id) {
    await connect();

    const student = await studentRepository.fetch(id);

    return {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        points: student.points,
        gpa: student.gpa
    }
    //return student;
}

async function deleteStudent(id) {
    await connect()

    await studentRepository.remove(id)
}

async function searchStudent(query) {
    await connect()

    const results = await studentRepository.search()
        .where('firstName')
        .equals(query)
        .or('lastName')
        .equals(query)
        .return.all();
    //console.log(results)
    return results//.json()
}

async function getLeaderboard() {
    await connect();

    const results = await studentRepository.search().sortDescending('points').return.all()

    return results;
}

module.exports = { 
    getStudent, 
    createStudent, 
    deleteStudent, 
    searchStudent, 
    getLeaderboard, 
    editStudent 
}