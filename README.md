# Better D3 charts with TDD

This repository contains support code for the December talk on the bay area d3 meetup group.

## Contents
Defines an example bar chart, located in ```/src/chart/bar.js``` and its tests, on ```/test/specs/bar.spec.js```.

## Installation

One of the less forgiving and pleasant tasks when trying to setup your own chart library is to set the environment up. The stack I include here contains:

* D3
* Jasmine
* Karma
* Jasmine helpers for Karma
* Jasmine jQuery helpers

This code uses Karma[http://karma-runner.github.io/0.13/index.html] as test runner. To install Karma and start running test you would need to follow this steps:

1- Clone repository with:
```
    git clone git@github.com:Golodhros/d3-meetup.git
```
2- Get into the repository folder and install dependencies with:
```
    npm install
    npm install -g karma-cli
```
3- Run the tests with:
```
    karma start
```

## Creating a new chart

Adding a new chart is a bunch of work, but we hope the current code and documentation will help you in the process.

- Create a file for the tests in ```test/specs/chartName.spec.js```
- Create a file for your chart in ```src/chart/chartName.js```
- Using the bar chart tests as a jumpstart, add one test to your new test file and make it fail running ```karma start```
- Write the code that makes that test pass
- Keep adding tests and code, refactoring in the meantime
- When finished, you can require your chart module and use it


## Creating distribution files

You can create the package for your charts using grunt:
```
grunt build
```

This task will create a concatenated and minified version of all the charts found on ```/src/chart``` and will place it on ```dist/```

