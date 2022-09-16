const { Schema, Entity, Repository } = require('redis-om');
const client = require('./database')

class Student extends Entity { }

const studentSchema = new Schema(Student, {
    firstName: { type: 'string'},
    lastName: { type: 'string'},
    email: { type: 'string'},
    points: { type: 'number'},
    gpa: { type: 'number'}
})

const studentRepository = client.fetchRepository(studentSchema)

module.exports = studentRepository;