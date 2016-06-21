var exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, function(error, stdout, stderr) {
        callback(stdout);
    });
};

function getAuthor(callback) {
    execute("git config --global user.name", function(name) {
        execute("git config --global user.email", function(email) {
            callback({
                name: name.replace("\n", ""),
                email: email.replace("\n", "")
            });
        });
    });
}
var getter = {
    getBower: function(appName, callback) {
        bowerString = '{\n' +
            '   "name" : "' + appName + '",\n' + 
            '   "homepage": "",\n';
        getAuthor(function(author) {
            if (author) {
                bowerString += '   "authors" : [\n' +
                    '      "' + author.name + (author.email ? ' <' + author.email + '>"' : '"') + '\n' +
                    '   ],\n';
            }
            bowerString += '   "description": "",\n' +
                '   "main": "",\n' +
                '   "moduleType": [],\n' +
                '   "license": "MIT",\n';
            bowerString += '   "ignore": [\n' +
                '      "**/.*",\n' +
                '      "node_modules",\n' +
                '      "bower_components",\n' +
                '      "test",\n' +
                '      "tests"\n' +
                '   ],\n';
            bowerString += '   "dependencies": {\n' +
                '      "angular" : "latest",\n' +
                '      "angular-material" : "latest",\n' +
                '      "angular-ui-router" : "latest\"n' +
                '   }\n';
            bowerString += '}';
            callback(bowerString)
        })
    },
    getIndexHtml: function(appName, start, factory) {
        return '<html lang="en" ng-app="' + appName + '">\n' +
            '\n' +
            '<head>\n' +
            '       <link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css">\n' +
            '</head>\n' +
            '\n' +
            '<body ng-cloak>\n' +
            '\n' +
            '<ui-view></ui-view>\n' +
            '\n' +
            '<script src="bower_components/angular/angular.min.js"></script>\n' +
            '<script src="bower_components/angular-animate/angular-animate.min.js"></script>\n' +
            '<script src="bower_components/angular-aria/angular-aria.min.js"></script>\n' +
            '<script src="bower_components/angular-messages/angular-messages.min.js"></script>\n' +
            '<script src="bower_components/angular-material/angular-material.min.js"></script>\n' +
            '<script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>\n' +
            '\n' +
            '<script src="scripts/app.js"></script>\n' +
            (factory ? '<script src="scripts/app.factory.js"></script>\n' : '\n') +
            '<script src="modules/'+start+'/' + start + 'Controller.js"></script>\n' +
            '</body>\n'
        '</html>\n';
    },
    getAppJs: function(appName, start) {
        return 'angular.module("' + appName + '", ["ngMaterial", "ui.router"])\n' +
            '    .config(function($stateProvider, $urlRouterProvider) {\n' +
            '        $urlRouterProvider.otherwise("/' + start + '");\n' +
            '        $stateProvider\n' +
            '            .state("' + start + '", {\n' +
            '                url: "/' + start + '",\n' +
            '                templateUrl: "modules/' + start + '/' + start + '.html",\n' +
            '                controller: "' + start + 'Controller"\n' +
            '            });\n' +
            '    });\n';
    },
    getController: function(appName, start, factory) {
        return 'angular.module("' + appName + '")\n' +
            '.controller("' + start + 'Controller", ["$scope"' + (factory ? ', "' + factory + '", ' : '') + 'function($scope' + (factory ? ', ' + factory : '') + ') {\n' +
            '}]);\n';
    },
    getFactoryJs: function(appName, factory) {
        return 'angular.module("' + appName + '")\n' +
            '    .factory("' + factory + '", function() {\n' +
            '        var factory = {};\n' +
            '        return factory;\n' +
            '    });\n';
    }
}
module.exports = getter
