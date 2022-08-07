const Sequelize = require('sequelize');
var sequelize = new Sequelize('d9jni5988dpaqi', 'sufoqrbfilwajz', '2c7031bee167f125f425fdee84725b0a9e1cf2020f7fe54b4878e99ccd455405', {
    host: 'ec2-52-205-61-230.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query:{raw: true}
});

var Student = sequelize.define('Student',{
    studentNum:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    firstName:Sequelize.STRING,
    lastName:Sequelize.STRING,
    email:Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity:Sequelize.STRING,
    addressProvince:Sequelize.STRING,
    TA:Sequelize.BOOLEAN,
    status:Sequelize.STRING
});

var Course = sequelize.define('Course', {
courseId:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true
},
courseCode:Sequelize.STRING,
CourseDescription:Sequelize.STRING
});

Course.hasMany(Student,{foreignKey: 'course'});

module.exports.getStudentsByCourse = function(course)
{
    return new Promise(function(resolve, reject){
        Student.findAll({
            where:{
                course: course
            }

        }).then(function(data){
            resolve(data)
        }).catch(function(error){
            console.log("something went wrong!");
            reject("No results found.")
        });
    });

}

module.exports.getStudentByNum = function(num)
{
    return new Promise(function(resolve, reject){
        Student.findAll({
            where: {
                studentNum: num
            }
        }).then(function(data){
            resolve(data[0])
        }).catch(function(error){
            console.log("something went wrong!");
            reject("No results found.")    
        });
    });
}

module.exports.initialize = function(){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            console.log("Success!")
            resolve("Operation resolved successfully")
        }).catch(function(error){
            console.log("something went wrong!");
            reject("Unable to sync the student database")
        });
    })
}    



module.exports.getAllstudents = function(){
    return new Promise(function(resolve, reject){
        Student.findAll({
        }).then(function(data){
            console.log(data);
            resolve(data)
        }).catch(function(error){
            console.log("something went wrong!");
            reject("No results found.")
        });   
    });
}

module.exports.getCourseById = function(id){
    return new Promise(function(resolve,reject){
        Course.findAll({
            where:{
                courseId:id
            }
        }).then(function(data){
            resolve(data[0])
        }).catch(function(error){
            console.log("something went wrong!");
            reject("No results found.")
        });
    });
}

module.exports.getCourses = function()
{
    return new Promise(function(resolve,reject){
    Course.findAll({
    }).then(function(data){
        resolve(data)
    }).catch(function(error){
        console.log("something went wrong!")
        reject("No results found.")
    });
});
}

module.exports.addStudent = function(studentData)
{
    return new Promise(function(resolve, reject){
    studentData.TA = (studentData.TA) ? true:false;
    for(const ele in studentData){
        if(studentData[ele]==""){
            studentData[ele]=null
        }
    }
    Student.create({
        firstName:studentData.firstName,
        lastName:studentData.lastName,
        email:studentData.email,
        addressStreet:studentData.addressStreet,
        addressCity:studentData.addressCity,
        addressProvince:studentData.addressProvince,
        TA:studentData.TA,
        status:studentData.status,
        course:studentData.course
    }).then(function(student){
        console.log("success!")
        resolve("Operation resolved successfully")
    }).catch(function(error){
        console.log("something went wrong!");
        reject("Unable to create student")
    });
})
}
module.exports.updateStudent=function(studentData)
{
    return new Promise(function (resolve, reject){
    studentData.TA = (studentData.TA) ? true:false;
    for(const ele in studentData){
        if(studentData[ele]==""){
            studentData[ele]=null
        }
    }
    Student.update({
        firstName:studentData.firstName,
        lastName:studentData.lastName,
        email:studentData.email,
        addressStreet:studentData.addressStreet,
        addressCity:studentData.addressCity,
        addressProvince:studentData.addressProvince,
        TA:studentData.TA,
        status:studentData.status,
        course:studentData.course},
        {
        where: {studentNum: studentData.studentNum}
    }).then(function(){resolve ("successfully updated user!");
}).catch(function (error){
    console.log("something went wrong!");
    reject("unable to update the student");
})
})    
}

    module.exports.addCourse = function(courseData)
    {
        return new Promise(function(resolve,reject){
        for(const ele in courseData){
            if(courseData[ele]==""){
                courseData[ele]=null
            }
        }
        Course.create({
            courseCode:courseData.courseCode,
            CourseDescription:courseData.CourseDescription
        }).then(function(course){
            console.log("success!")
            resolve("Operation resolved successfully!")
        }).catch(function (error){ 
            console.log("error!")
            resolve("Operation went wrong!")
        });

    })
}

module.exports.updateCourse = function(courseData)
{
    return new Promise(function(resolve, reject){
    for(const ele in courseData){
        if(courseData[ele]==""){
            courseData[ele]=null
        }
    }
    Course.update({
        courseCode:courseData.courseCode,
        CourseDescription:courseData.CourseDescription
    }, {
        where:{courseId: courseData.courseId }
    }).then(function () { resolve("successfully updated user");
    }).catch(function (error){
        console.log("something went wrong!");
        reject("Unable to update the course");
    })
    })    
}

module.exports.deleteCourseById = function(id)
{
    return new Promise(function(resolve, reject){
        Course.destroy({
            where: { courseId: id }
        }).then(function (error) {
            console.log("something went wrong!");
            reject("unable to destroy the course");
        })
    })
}

module.exports.deleteStudentByNum = function(studentNum)
{
    return new Promise(function(resolve, reject){
    console.log(studentNum)
    Student.destroy({
        where: { studentNum: studentNum }
    }).then(function () { resolve("destroyed");
}).catch(function (error){
    console.log("somehing went wrong!");
})
    })
}