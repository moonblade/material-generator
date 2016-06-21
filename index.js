#!/usr/bin/env node

var gen = require('commander');
var mkdirp = require('mkdirp');
var getter = require('./getter');
var createFile = require('create-file');
gen.arguments('<folderName>')
    .option('-a, --appname <appname>', 'The name of the app (default : <folderName>)')
    .option('-f, --factory <factory>', 'The name of the factory')
    .option('-s, --start <start>', 'The first controller')
    .action(function(folderName) {
        if (!gen.appname)
            gen.appname = folderName;
        if (!gen.start)
            gen.start = "default";
        mkdirp(folderName, function(err) {
            if (err) {
                console.error(err);
                process.exit(1);
            } else {
                console.log("Created folder " + folderName)
                process.chdir(folderName);
                getter.getBower(folderName, function(bowerString) {
                    // console.log(bowerString)
                    createFile('bower.json', bowerString, function(err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        console.log("Created " + folderName + "/bower.json");
                    });
                })
                createFile('.gitignore', 'bower_components/\n', function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    console.log("Created " + folderName + "/.gitignore")
                });
                createFile('index.html', getter.getIndexHtml(gen.appname, gen.start, gen.factory), function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    console.log("Created " + folderName + "/index.html")
                });

                mkdirp('modules/' + gen.start, function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    createFile('modules/'+gen.start+'/'+gen.start+'.html', '', function(err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        console.log("Created " + folderName + "/modules/"+gen.start+".html")
                    });
                    createFile('modules/'+gen.start+'/'+gen.start+'Controller.js', getter.getController(gen.appname, gen.start, gen.factory), function(err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        console.log("Created " + folderName + "/modules/"+gen.start+"Controller.js")
                    });
                });
                mkdirp('scripts', function(err) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    createFile('scripts/app.js', getter.getAppJs(gen.appname, gen.start), function(err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        console.log("Created " + folderName + "/scripts/app.js")
                    });
                    if (gen.factory) {
                        createFile('scripts/app.factory.js', getter.getFactoryJs(gen.appname, gen.factory), function(err) {
                            if (err) {
                                console.error(err);
                                process.exit(1);
                            }
                            console.log("Created " + folderName + "/scripts/app.factory.js")
                        });
                    }
                });

            }
        })
    })
    .parse(process.argv);
