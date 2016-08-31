# teamform-seed
## The seed project for the team forming app

### Prerequisites

Install git: [http://git-scm.com/](http://git-scm.com/).
Install node.js and npm: [http://nodejs.org/](http://nodejs.org/).

### Clone the project

Clone repository using `git clone` command as follows:

```
git clone https://github.com/hkpeterpeter/teamform-seed
cd teamform-seed
```

### Install Dependencies
 
As it is used as a course project, key libraries with fixed version (e.g. Angular JS 1.5.7) are included to avoid discreprency. Other dependencies (e.g. karma toolkit, http-server...) will be installed separately:

```
npm install
```

After running this command, a new folder will be created:

* `node_modules` - It contains the npm packages for the tools we need to build and test our web application

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

After that, open a web browse with the following URL: `http://localhost:8080/index.html`.


## Directory Layout

```
LICENSE                 --> The software LICENSE of this open source project. Generated by Github
README.md               --> This README file (default README file for Github)
.gitignore              --> Git configuration file. It can be used to ignore files/directories from Git 
karma.conf.js           --> Configuration file for the Jasmine/Karma unit test framework. 
package.json            --> Configuration file for node.js and npm (Node Package Manager)
app/                    --> all of the source files for the application
  index.html            --> The front-end of the team form web application
  admin.html            --> The admin HTML page
  team.html             --> The team HTML page
  member.html           --> The member HTML page
  lib/                  --> Key libraries with fixed version (e.g. Angular JS 1.5.7) 
  js/                   --> User-defined JavaScript files
     admin.js           --> The JS file for the admin page
     index.js           --> The JS file for the front-end page
     leader.js          --> The JS file for the leader page
     member.js          --> The JS file for the member page
     site.js            --> The JS file containing functions shared by multiple pages
  unit_tests            --> The folder containing the unit test cases (Syntax: Jasmine/Karma)
     test_site.js       --> A sample unit test case (not complete yet, just a demo)
  
```

## Testing

### Running Unit Tests

 We provide a Karma configuration file to run them.

* the configuration is found at `karma.conf.js`
* all unit test cases should be written inside the folder `app/unit_tests`

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. 
In this course, we will mainly focus on the branch/statement coverage. 
The output files will be stored inside the app/coverage folder. 



### Running the App during Development

The seed project is pre-configured with a local development webserver.  It is a `node.js`
tool called `http-server`.  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8080
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.


## Reference

For more information, please checkout:

* Full Firebase 3.0+ API: https://firebase.google.com/docs/reference/
* Full AngularFire 2.0+ API: https://github.com/firebase/angularfire/blob/master/docs/reference.md
* Angular JS: http://angularjs.org/
* git: http://git-scm.com/
* npm: https://www.npmjs.org/
* node: http://nodejs.org
* jasmine: http://jasmine.github.io
* karma: http://karma-runner.github.io
* http-server: https://github.com/nodeapps/http-server

