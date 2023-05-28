#!/usr/bin/env node
const blessed = require('blessed');
const chalk = require('chalk');
const spawn = require('child_process').spawn;
const chokidar = require('chokidar');
const path = require('path');

class DeezNodes {
    constructor() {
        this.screen = blessed.screen({
            smartCSR: true
        });
        this.log = blessed.log({
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: '100%',
            height: '70%',
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: '#f0f0f0'
                }
            },
            label: chalk.cyan('-+-+-+-+-+- DeezNodes -+-+-+-+-+-'),
            scrollable: true,
            scrollbar: {
                ch: ' ',
                inverse: true,
            },
        });
        this.inputBox = blessed.textbox({
            parent: this.screen,
            bottom: 0,
            left: 0,
            height: 3,
            width: '100%',
            height: 'shrink',
            inputOnFocus: true,
            keys: true,
            mouse: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'black'
            }
        });

        this.__init__();
    }

    __init__ = () => {
        this.args = process.argv;
        this.fileName = this.args[2];
        this.cwd = process.cwd();
        this.watchPaths = [
            path.join(this.cwd, '/**/*'),
            '!' + path.join(this.cwd, '/**/node_modules/**'), // Exclude node_modules
            '!' + path.join(this.cwd, '/**/.*'), // Exclude hidden files and directories
        ];
        this.ignoredPaths = '**/node_modules/*';

        this.reload();
        this.startWatching();
        this.listeningEvents();
        this.setupUI();
    }

    reload = () => {
        if (this.nodeServer) this.nodeServer.kill('SIGTERM');
        this.nodeServer = spawn('node', [this.fileName], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

    }

    startWatching = () => {
        chokidar
            .watch(this.watchPaths, {
                ignored: this.ignoredPaths,
                ignoreInitial: true
            })
            .on('all', (event, path) => {
                this.log.log(chalk.green('Restarted! Change detected! :D'));
                this.reload();
            });
    }

    listeningEvents = () => {
        this.log.log(chalk.green('Server Started! Watching Files :D'));
        this.log.log(chalk.green('Type help to list commands!'));
    }

    setupUI = () => {

        this.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            return process.exit(0);
        });

        // Handle screen resize
        this.screen.on('resize', () => {
            this.log.emit('attach');
        });

        this.inputBox.key('enter', () => {
            const command = this.inputBox.getValue().trim();

            // Restart command
            if (command === 'rs' || command === 'restart') {
                this.log.log(chalk.green('Restarted server! :D'));
                this.reload();
            }

            // Version command
            else if (command === 'ver' || command === 'version') {
                this.log.log(chalk.green('Version: 1.0.0 :D'));
            }

            // Help command
            else if (command === 'help') {
                this.log.log(chalk.yellow('=+=+=+=+=+= Help =+=+=+=+=+='));
                this.log.log(chalk.green('ver: log version'));
                this.log.log(chalk.green('rs: restart server'));
                this.log.log(chalk.green('^C, ESC, Q: quit deezNodes'));
            }

            this.inputBox.clearValue();
            this.inputBox.focus();
            this.screen.render();
        });

        this.screen.append(this.log);
        this.screen.append(this.inputBox);
        this.inputBox.focus();
        this.screen.render();
    }
}

new DeezNodes();
