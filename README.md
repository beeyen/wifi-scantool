
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Quick Start
#### Setup Local Environment
Install the current version of NodeJS/NPM

  sudo npm cache clean -f
	sudo npm install -g n
	sudo n stable
    
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
