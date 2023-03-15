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
            path.join(this.cwd, "/**/*.js"),
            path.join(this.cwd, "/**/*.css"),
            path.join(this.cwd, "/**/*.json"),
            path.join(this.cwd, "/**/*.yaml"),
            path.join(this.cwd, "/**/*.php"),
            path.join(this.cwd, "/public/**/*.html")
        ];
        this.ignoredPaths = "**/node_modules/*";
        this.ignoredPaths = "**/.gitignore*"

        this.reload();
        this.startWatching();
        this.listeningEvents();
    }

    reload = () => {
        if (this.nodeServer) this.nodeServer.kill('SIGTERM');
        this.nodeServer = spawn('node', [this.fileName], { stdio: [process.stdin, process.stdout, process.stderr] });
        // Inject a script tag into the HTML file to trigger a page refresh
        const script = `
            <script>
                setTimeout(function() {
                 location.reload();
                 }, 1000);
             </script>
            `;

        const fs = require('fs');
        const htmlFilePath = path.join(this.cwd, 'public', 'index.html');
        let html = fs.readFileSync(htmlFilePath, 'utf8');
        html = html.replace('</body>', `${script}\n</body>`);
        fs.writeFileSync(htmlFilePath, html);
    }

    startWatching = () => {
        const io = require('socket.io')(8081);

        io.on('connection', (socket) => {
            console.log(chalk.yellow('=+=+=+=+=+= DeezNodes =+=+=+=+=+='));
            console.log(chalk.green('Client connected'));
        });
        io.on('error', (err) => {
            console.log(chalk.red('=+=+=+=+=+= DeezNodes =+=+=+=+=+='));
            console.log(chalk.yellow(`Socket.io error: ${err}`));
        });
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
            const cliInput = chunk.toString().trim();

            switch (cliInput) {
                case 'rs\n':
                case 'restart\n':
                    console.log(chalk.yellow('=+=+=+=+=+= DeezNodes =+=+=+=+=+='));
                    console.log(chalk.green('Restarted server! :D'));
                    this.reload();
                    break;

                case 'ver\n':
                case 'version\n':
                    console.log(chalk.yellow('=+=+=+=+=+= DeezNodes =+=+=+=+=+='));
                    console.log(chalk.green('Version: 1.0.0 :D'));
                    break;

                case 'help\n':
                    console.log(chalk.yellow('=+=+=+=+=+= Help =+=+=+=+=+='));
                    console.log(chalk.green('version (ver): log version'));
                    console.log(chalk.green('restart (rs): restart server'));
                    break;
            }
        }); a

    }
}

new deezNodes();