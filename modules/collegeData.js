const fs = require('fs');
const {getAllstudents } = require('../modules/collegeData.js');

class Data{
    constructor(students,courses){
        this.students = students;
        this.courses = courses;
    }

}

var dataCollection = null;
var studentDataFromFile = null;
var courseDataFromFile = null;

module.exports.getStudentsByCourse = function(course)
{
    return new Promise(function(resolve, reject){
        var sObject={}
        for(i=0;i<dataCollection.students.length;i++){
            if(dataCollection.students[i].course==course)
            {
                sObject.push(dataCollection.students[i]);
            }
        }
        if(sObject.length==0){
            reject("No results returned")
        }
        else{
            resolve(sObject)
        }
    });

}

module.exports.getStudentByNum = function(num)
{
    return new Promise(function(resolve, reject){
        var stuDetails={}
        for (i=0;i<dataCollection.students.length;i++){
            if(dataCollection.students[i].studentNum==num)
            {
                stuDetails = dataCollection.students[i]
            }
        } 
        if(stuDetails!=0){
            resolve(stuDetails)

        } 
        else{
            reject("No results returned")
        }
    });
}

module.exports.initialize = function(){

return new Promise(function(resolve,reject){
    const students = new Promise(function(resolve,reject){
    fs.readFile('./data/students.json', 'utf8', function(err, dataFromFile){
        if (err){
            reject("unable to read students.json")
            return;
        }

        studentDataFromFile = JSON.parse(dataFromFile);
        console.log(studentDataFromFile);
        resolve("Operation success")
    });    
});
    const courses = new Promise(function(resolve,reject){
        fs.readFile('./data/courses.json','utf8', function(err, dataFromFile){
        if (err){
            reject("unable to read students.json")
            return;
        }
        courseDataFromFile = JSON.parse(dataFromFile);
        console.log(courseDataFromFile);
        resolve("Opertaion Success")
});
});
students.then(student=>{
    courses.then(course=>{
        dataCollection = new Data(studentDataFromFile, courseDataFromFile);
        resolve('Successfully completed')
    }).catch(error=>{reject(error)})
}).catch(error=>{reject(error)})
});
}

module.exports.getAllstudents = function()
{
    return new Promise(function(resolve, reject){
        if(dataCollection.students.length==0)
        {
            reject("no results returned")
        }
        else{
            resolve(dataCollection.students)
        }
    });
}

module.exports.getTAs =function()
{
    var student = []
    return new Promise(function(resolve, reject){
        for(var i=0;i<dataCollection.students.length;i++){
            if(dataCollection.students[i].TA)
            {
                student.push(dataCollection.students[i].TA)
            }
        }
        if(student.length == 0){
            reject("no results returned")
        }
        else{
            resolve(student)
        }
    });
}

module.exports.getCourses = function()
{
    return new Promise(function(resolve,reject){
        if(dataCollection.courses.length==0)
        {
            reject("no results returned")
        }
        else{
            resolve(dataCollection.courses)
        }
    });
}
module.exports.addStudent = function(studentData)
    {
    return new Promise(function(resolve, reject){
        if(!studentData.TA)
            {
                studentData.TA=false
            }
            else
            {
               studentData.TA=true
            }
               studentData.studentNum=dataCollection.students.length + 1
               studentData.course=Number(studentData.course)
               dataCollection.students.push(studentData)
               resolve(dataCollection.students)
        }); 
    }
