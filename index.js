#!/usr/bin/env node
const chalk = require('chalk');
const spawn = require('child_process').spawn;
const chokidar = require('chokidar');
const path = require('path');

class deezNodes {
    constructor() {
        this.__init__();
    }

    __init__ = () => {
        this.args = process.argv;
        this.fileName = this.args[2];
        this.cwd = process.cwd();
        this.watchPaths = [
            path.join(this.cwd, "/**/*.js")
        ];
        this.ignoredPaths = "**/node_modules/*";

        this.reload();
        this.startWatching();
        this.listeningEvents();
    }

    reload = () => {
        if (this.nodeServer) this.nodeServer.kill('SIGTERM');
        this.nodeServer = spawn('node', [this.fileName], { stdio: [process.stdin, process.stdout, process.stderr] });
    }

    startWatching = () => {
        chokidar.watch(this.watchPaths, {
            ignored: this.ignoredPaths,
            ignoreInitial: true
        }).on('all', (event, path) => {
            console.log(chalk.yellow('=+=+=+=+=+= DeezNodes =+=+=+=+=+='));
            console.log(chalk.green('Restarted! Change detected! :D'));
            this.reload();
        });
    }

    listeningEvents = () => {
        console.log(chalk.yellow('=+=+=+=+=+= DeezNodes =+=+=+=+=+='));
        console.log(chalk.green('Server Started! Watching Files :D'));
        console.log(chalk.green('Type help to list commands!'));
        //restart command
        process.stdin.on("data", (chunk) => {
            let cliInput = chunk.toString();
            switch (cliInput) {
                case 'rs\n':
                    console.log(chalk.yellow('=+=+=+=+=+= DeezNodes =+=+=+=+=+='));
                    console.log(chalk.green('Restarted server! :D'));
                    this.reload();
                    break
            }
        });
        process.stdin.on("data", (chunk) => {
            let cliInput = chunk.toString();
            switch (cliInput) {
                case 'ver\n':
                    console.log(chalk.yellow('=+=+=+=+=+= DeezNodes =+=+=+=+=+='));
                    console.log(chalk.green('Version: 1.0.0 :D'));
                    break
            }
        });
        process.stdin.on("data", (chunk) => {
            let cliInput = chunk.toString();
            switch (cliInput) {
                case 'help\n':
                    console.log(chalk.yellow('=+=+=+=+=+= Help =+=+=+=+=+='));
                    console.log(chalk.green('ver: log version'));
                    console.log(chalk.green('rs: restart server'));
                    break
            }
        });
    }
}

new deezNodes();