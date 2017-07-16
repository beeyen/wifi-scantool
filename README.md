# CarePortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Quick Start
#### Setup Local Environment
Install the current version of NodeJS/NPM

   	sudo npm cache clean -f
	sudo npm install -g n
	sudo n stable

Install/Update [Angular CLI](https://github.com/angular/angular-cli)
Note: if you have an older version of angular-cli, you have to uninstall it first

    sudo npm uninstall -g angular-cli
    npm uninstall --save-dev angular-cli
    
Install @angular/cli

    sudo npm uninstall -g @angular/cli
    npm cache clean
    sudo npm install -g @angular/cli@latest
    
Install [Yarn](https://yarnpkg.com/en/)
via Homebrew

    brew install yarn
    
or via MacPorts

    sudo port install yarn
    
#### Install dependencies
Install all project dependencies via yarn from the root directory of the project

	yarn
	or
	yarn install

#### Update Proxy for local development

    cd /etc/apache2/other 
    open .
    
Select and open proxy.conf file, add the following entries:

**ProxyPass /napi/1/care/   https://ui-hnm-dev.test.dlife.att.com/napi/1/care/**

**ProxyPassReverse /napi/1/care/  https://ui-hnm-dev.test.dlife.att.com/napi/1/care/**

Retart apache server

    sudo apachectl restart

#### Build project
Build project and start watcher from the root directory of the project

	ng serve
	
Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.

#### Build project with Hot Module Replacement enabled
Used [this tutorial](https://medium.com/@beeman/tutorial-enable-hrm-in-angular-cli-apps-1b0d13b80130) to add HMR to the project. Running this instead of `yarn start` or `ng serve` will enable development without a page refresh on save.  Saving the state.

	yarn hmr


Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.
#### Dev build without watcher
Build project for development environment

	ng build

#### Production build
Build project for production environment with ahead of time compiling

	ng build --prod --aot

#### Lint

    ng lint
    
#### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## CONVENTIONS

### Git Commit Convention for Release Notes
To add your message to the current build release note, please use following conventions when performing your git commit.

- Feature: feat(login): add login form to allow user to login to the app
- Bug Fix: fix(eservice): fix eservice delimiter to match with server side

For detail information about commit convention, please read this: <https://github.com/ajoslin/conventional-changelog/blob/master/CONVENTIONS.md>

### Style Guide
* Write Angular with [style](https://angular.io/docs/ts/latest/guide/style-guide.html)
* CSS style naming Conventions [BEM](http://getbem.com/naming/)

### Resources
- Wiki: <http://gitlab.test.dlife.att.com/web-team/HNM/wikis/home>

## Setup for Jenkins/CI
* Create a new jenkins job
* Once created go to Configure
* Under source code management:
	* Select Git
	* paste in the Git url to the Repository URL field
	* Select a credentials key
* **Make sure to enable the same key under the Project settings in Gitlab**
* If there are any global npm packages required add them to jenkins NodeJS Plugin:
	* Go to Manage Jenkins
	* Configure System
	* Scroll down to NodeJS section
	* Add packages to list under `Global npm packages to install` using spaces to delimitate
	* Save at the bottom
* Modify the `Execute Shell` Section and CI yourself to sitting on a beach watching your builds to their thing.

### Release Tasks
*** TBD ***
