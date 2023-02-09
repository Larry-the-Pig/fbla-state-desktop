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
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    points: { type: 'number', sortable: true },
    gpa: { type: 'number' },
    gradeLevel: { type: 'number' },
    isAdmin: { type: 'boolean' },
    eventsAttended: { type: 'string[]' },

    username: { type: "string" },
    password: { type: "string" }
})

const eventSchema = new Schema(Event, {
    title: { type: 'text', weight: 2 },
    description: { type: 'text', weight: 1 },
    date: { type: 'date', sortable: true }
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
    student.password = data.password;
    student.eventsAttended = data.eventsAttended;
    student.gradeLevel = data.gradeLevel;
    const id = await studentRepository.save(student);

    return id;
}

Student.edit = async function(id, data) {
    await connect();

    const student = await studentRepository.fetch(id);

    if(student === null) {
        return;
    }

    student.firstName = data.firstName;
    student.lastName = data.lastName;
    student.email = data.email;
    student.gpa = data.gpa;
    student.gradeLevel = data.gradeLevel;
    
    return await studentRepository.save(student);
}

Student.get = async function(id) {
    await connect();

    const student = await studentRepository.fetch(id);

    if(student === null) {
        return;
    }

    return {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        points: student.points,
        gpa: student.gpa,
        eventsAttended: student.eventsAttended,
        password: student.password,
        gradeLevel: student.gradeLevel,
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
    return results;
}

Student.searchEmail = async function(email) {
    await connect();

    const result = await studentRepository.search()
        .where('email')
        .equals(email)
        .return.first();
    
    return result;
}

Student.addEventAttended = async function(eventId, studentId) {
    await connect();

    const student = await studentRepository.fetch(studentId);

    if(student.eventsAttended === null) {
        return;
    }
    
    if (student.eventsAttended.includes(eventId)) {
        return;
    }
    student.eventsAttended.push(eventId);
    student.points++;

    return await studentRepository.save(student);
}

Student.leaderboard = async function() {
    await connect();

    const results = await studentRepository.search().sortDescending('points').return.page(0, 10)

    return results;
}

Student.getReport = async function() {
    await connect();

    const overallWinner = await studentRepository.search().sortDescending('points').return.first();

    const winner9th = await studentRepository.search().where('gradeLevel').equals(9).sortDescending('points').return.first();
    const winner10th = await studentRepository.search().where('gradeLevel').equals(10).sortDescending('points').return.first();
    const winner11th = await studentRepository.search().where('gradeLevel').equals(11).sortDescending('points').return.first();
    const winner12th = await studentRepository.search().where('gradeLevel').equals(12).sortDescending('points').return.first();

    return {
        overallWinner: overallWinner,
        winner9th: winner9th,
        winner10th: winner10th,
        winner11th: winner11th,
        winner12th: winner12th,
    }
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

    const results = await eventRepository.search()
        .where('title')
        .matches(query)
        .or('description')
        .matches(query)
        .return.all();
    return results
}

Event.calendar = async function() {
    await connect();

    const results = await eventRepository.search().sortDescending('date').return.all()

    return results;
}

module.exports = { 
    Student,
    Event
}
