const http = require('http');
const url = require('url');
const fs = require('fs');
const robot = require('robotjs');
const os = require('os');

http.createServer(function (request, response) {
    response.writeHead(200)
    fs.createReadStream('./index.html').pipe(response) 
}).listen(9615);

setInterval(() => {
    const m = robot.getMousePos();
    // robot.moveMouse(m.x + Math.random() * 2 - 1/2, m.y + Math.random() * 2 - 1/2);
}, 100)


const interfaces = os.networkInterfaces();
const addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

process.stdout.write('Mouse Control at: ');
console.log(addresses.toString() + ':' + 9615);




const WebSocket = require('ws');

const ws = new WebSocket.Server({ port: 9616 });
ws.on('open', function open() {
    ws.send('something');
});

ws.on('connection', function connection(ws, req) {
    const ip = req.connection.remoteAddress;
    ws.on('message', function incoming(data) {
        if(data==='left'){
            robot.mouseClick(data);
        }else
        if(data==='right'){
            robot.mouseClick(data);
        } else {
            const d = JSON.parse(data);

            if(d.e === 'move'){
                const m = robot.getMousePos();
                robot.moveMouse(m.x - d.x, m.y - d.y);
            }else{
                robot.scrollMouse(-d.x/4, -d.y/4);
            }
        }
    });
});
