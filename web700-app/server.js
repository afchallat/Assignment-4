/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Aiswarya Francie Challat  Student ID:134229210  Date:6th August 2022
*  Online (Heroku) Link: https://immense-peak-03742.herokuapp.com
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const res = require("express/lib/response");
var path = require("path");
var app = express();
var collegeData = require('./modules/collegeData')
var bodyParser = require('body-parser')

var exphbs = require("express-handlebars");

app.use(bodyParser.json() );     
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname+ '/public'));
app.use(express.urlencoded({extended:true}));

app.engine(".hbs",exphbs.engine({extname: ".hbs",defaultLayout: 'main',helpers: {
    navLink: function(url, options){
        return '<li' +
            ((url == app.locals.activeRoute) ? 'class="nav-item active"' : 'class="nav-item') +
            '><a class="nav-link" href="' + url + '">' +options.fn(this) + '</a></li>';
    },
    equal:function(lvalue,rvalue,options){
        if (argument.length < 3)
            throw new Error("Handlers Helper equal needs parameters");
        if (lvalue != rvalue){
            return options.inverse(this);
        }else {
            return options.fn(this);
        }    
    }
}}));

app.set('view engine', 'hbs');

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" +(isNAN(route.split('/')[1]) ? route.replace(/\/(?)!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.get("/students", (req, res) => {
    if(Object.keys(req.query).length==0){
        collegeData.getAllstudents().then(success=>{
           if(success,length>0)
           {
            console.log(success)
            res.render('students',{students:success});
           }
           else{
            res.render('students',{message:"No results"});
           }
        }).catch(error=>{
            res.render('students', {message: "No results"});
        });
    }       
    else{
        collegeData.getStudentsByCourse(req.query.course).then(success=>{
            if(success.length>0){
                res.render('students',{students:success});
            }
            else{
                res.render('students', {message: "No results"});
            }
        }).catch(error=>{
            res.render('students',{message:"No results"})
        });
    
    }
    
});
   

app.get("/courses",(req, res) => {
    collegeData.getCourses().then(success=>{
        if(success.length>0){
            res.render("courses",{courses: success});
         }
         else{
            res.render("courses", {message: "No results"});
         }        
    }).catch(error=>{
        res.render("courses", {message: "No results"});
    })
});

app.get("/student/:studentNum",(req, res) => {
    let viewData = {};
    collegeData.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data; 
        } else {
            viewData.student = null; 
        }
        console.log(data)
    }).catch(() => {
        viewData.student = null; 
    }).then(collegeData.getCourses)
    .then((data) => {
        viewData.courses = data; 
        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.courses = []; 
        if (viewData.student == null) { 
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); 
        }
    });
});

app.get("/course/:id", function(req, res){
    collegeData.getCourseById(req.params.id).then(data=>{
        console.log(data)
        if(data)
        {
        res.render("course", {course: data}); 
        }
        else{
            res.status(404).send("Course Not Found")
        }
    }).catch(error=>{
        res.status(404).send("Course Not Found")
    })
})

app.get("/", function(req, res) {
    res.render('home');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

app.get("/students/add", (req, res) => {
    collegeData.getCourses(req.body).then(success=>{
        res.render("addStudent", {courses: success});
    }).catch(error=>{
        res.render("addStudent", {courses: []}); 
    })
});

app.post("/students/add", (req,res) => {
    collegeData.addStudent(req.body).then(success=>{
        res.redirect("/students")
    }).catch(error=>{
        res.status(500).send("Unable to Add Student")
    })
  });

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body).then(success=>{
        res.redirect("/students")
    }).catch(error=>{
        res.status(500).send("Unable to Update Student / Student Not Found")
    })
});

app.get("/courses/add", (req, res) => {
    res.render('addCourse');
});

app.post("/courses/add", (req,res) => {
    collegeData.addCourse(req.body).then(success=>{
        res.redirect("/courses")
    }).catch(error=>{
        res.status(500).send("Unable to Add Course")
    })
  });

app.post("/course/update", (req, res) => {
    collegeData.updateCourse(req.body).then(success=>{
        res.redirect("/courses")
    }).catch(error=>{
        res.status(500).send("Unable to Update Course / Course Not Found")
    })
});

app.get("/course/delete/:id", (req, res) => {
    collegeData.deleteCourseById(req.params.id).then(success=>{
            console.log(success)
            res.redirect("/courses")
        
    }).catch(error=>{
        res.status(500).send("Unable to Remove Course / Course Not Found")
    })
});

app.get("/student/delete/:studentNum", (req, res) => {
    collegeData.deleteStudentByNum(req.params.studentNum).then(success=>{
            res.redirect("/students")
    }).catch(error=>{
        res.status(500).send("Unable to Remove Student / Student Not Found")
    })
});


collegeData.initialize().then(success=>{
    app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)})}).catch(error=>{
        console.log('Failed'+error)
    });

