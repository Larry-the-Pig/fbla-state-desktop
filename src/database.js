const { Client, Entity, Schema, Repository } = require('redis-om');

const client = new Client();

async function connect() {
    if (!client.isOpen()) {
        await client.open('redis://localhost:6379');
        await studentRepository.createIndex();
        await eventRepository.createIndex();
    }
}

connect();

class Student extends Entity { }
class Event extends Entity { }

const studentSchema = new Schema(Student, {
    firstName: { type: 'string'},
    lastName: { type: 'string'},
    email: { type: 'string'},
    points: { type: 'number', sortable: true },
    gpa: { type: 'number'}
})

const eventSchema = new Schema(Event, {
    title: { type: 'text', weight: 2 },
    description: { type: 'text', weight: 1 },
    date: { type: 'date' }
})

const studentRepository = client.fetchRepository(studentSchema)
const eventRepository = client.fetchRepository(eventSchema);

Student.create = async function(data) {
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

Student.edit = async function(id, data) {
    await connect();

    const student = await studentRepository.fetch(id);

    student.firstName = data.firstName;
    student.lastName = data.lastName;
    student.email = data.email;
    student.points = data.points;
    student.gpa = data.gpa;
    
    return await studentRepository.save(student);
}

Student.get = async function(id) {
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

Student.delete = async function(id) {
    await connect()

    await studentRepository.remove(id)
}

Student.search = async function(query) {
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

Student.leaderboard = async function() {
    await connect();

    const results = await studentRepository.search().sortDescending('points').return.all()

    return results;
}

Event.create = async function(data) {
    await connect();

    const event = eventRepository.createEntity()
    event.title = data.title;
    event.description = data.description;
    event.date = data.date;
    const id = await eventRepository.save(event);

    return id;
}

Event.get = async function(id) {
    await connect();

    const event = await eventRepository.fetch(id);

    return {
        title: event.title,
        description: event.description,
        date: event.date
    }
    //return student;
}

Event.search = async function(query) {
    await connect();

    //eventRepository.search().return()
    const results = await eventRepository.search()
        .where('title')
        .matches(query)
        .or('description')
        .matches(query)
        .return.all();
    //console.log(results[0].entityFields.title._value)
    return results
}

module.exports = { 
    Student,
    Event
}
