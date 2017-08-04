'use strict';
(function(){
// DEPENDENCIES =================================== 
	var express = require("express");
	var bodyParser = require("body-parser");
	var exphbs = require("express-handlebars");
	var path = require("path");
	var methodOverride = require("method-override");
	require('dotenv').config();
	// var db = require('./models');
    var multer  = require('multer');
// CONFIG =========================================
	var app = express();
	var port = process.env.PORT || 3000;
	
	app.disable("x-powered-by");
	
	// Set Static Directory
	app.use(express.static(path.join(__dirname, "public")));
	
	// Set Handlebars
	app.engine("handlebars", exphbs({ defaultLayout: "main" })); 
	app.set("view engine", "handlebars");
	
	// Set Body Parser
	app.use(bodyParser.json());
	// app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.text());
	app.use(bodyParser.json({ type: 'application/vnd.api+json'}));	
  	app.use(bodyParser.urlencoded({extended: false,limit: '50mb'}));
	
	// Override with POST having ?_method=
	app.use(methodOverride("_method")); 

	// logs each url that is requested, then passes it on.
	app.use(function(req, res, next) {
		console.log("url : " + req.url);
		next();
	});

// ROUTES =========================================
	// api has to be before routes or else everything would
	// would hit routes (including api routes)
	var api = require('./controllers/api_controller.js');
	app.use('/', api); 
	
	var routes = require("./controllers/model_controller.js");
	app.use("/", routes);

	var faceRoutes = require("./controllers/face_controller.js");
	app.use("/", faceRoutes);

// ERRORS =========================================
  app.use(function(req, res) {
    res.type("text/html");
    res.status(404);
    res.render("404");
  });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render("500");
  });



// START SERVER ===================================
// db.sequelize.sync({force: true}) .then(function(){
  app.listen(port, function() {
    console.log(`-------------------------------------------------------
                                          ready @ ${port}`);
  });
// })
//==================================================	
})();