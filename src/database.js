const { Client, Entity, Schema, Repository } = require('redis-om');

const client = new Client();

async function connect() {
    if (!client.isOpen()) {
        await client.open('redis://localhost:6379');
    }
}

connect();

class Student extends Entity { }

const schema = new Schema(Student, {
    firstName: { type: 'string'},
    lastName: { type: 'string'},
    email: { type: 'string'},
    points: { type: 'number'},
    gpa: { type: 'number'}
})

const studentRepository = client.fetchRepository(schema)

async function createStudent(data) {
    await connect();

    const student = studentRepository.createEntity()
    student.firstName = data.firstName;
    student.lastName = data.lastName;
    student.email = data.email;
    student.points = parseInt(data.points);
    student.gpa = parseInt(data.gpa);
    const id = await studentRepository.save(student);

    return id;
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
}

async function deleteStudent(id) {
    await connect()

    await studentRepository.remove(id)
}

module.exports = { getStudent, createStudent, deleteStudent }