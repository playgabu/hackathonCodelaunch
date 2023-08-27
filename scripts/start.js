const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');

const initLambdaPort = 4000;
const initAPIPort = 5000;
const regex = /.*(5\d+)\/([a-z]+).*/gi;

function getLambdas(chunk) {
  console.log(chunk);
  return chunk.split("\n").filter(x => regex.test(x)).map(x => x.replace(regex, "$2"));
}

function getServices() {
  const _services = fs.readdirSync('./services');
  const servicesList = _services.map((service, index) => {
    return {
      name: service,
      route: `${service}`, 
      path: `services/${service}`,
      port: `${initAPIPort + index + 1}`,
      lambdaPort: `${initLambdaPort + index + 1}`,
      lambdas: [],
    }
  });
  return servicesList;
}

const services = getServices();
const info = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

services.unshift({ 
  name: info.name || 'serverless', 
  route: '/', path: '.', 
  port: `${initAPIPort}`, 
  lambdaPort: `${initLambdaPort}`,
  lambdas: [],
});

services.forEach(service => {
  const renameChild = spawn(
    "sed",
    ['-i', '-e', `'s/service:.*/service: ${service.name}'/g`, 'serverless.yml'],
    { cwd: service.path, shell: true }
  );

  renameChild.stdout.setEncoding('utf8');
  renameChild.stdout.on('data', chunk => console.log(chunk));
  renameChild.stderr.on('data', chunk => console.log(chunk.toString()));

  const child = spawn(
    "serverless",
    ["offline", "start", "--noPrependStageInUrl", "--httpPort", service.port, "--lambdaPort", service.lambdaPort],
    { cwd: service.path, shell: true }
  );

  child.stdout.setEncoding('utf-8');
  child.stdout.on('data', chunk => service.lambdas.push(...getLambdas(chunk)));
  child.stderr.on('data', chunk => console.log(chunk.toString()));
  child.on('close', code => console.log(`child exited with code ${code}`));
});

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req, res) => {
  const serviceString = req.url.split('/')[1];
  const service = services.find(s => s.lambdas.includes(serviceString));
  
  if (service) {
    proxy.web(req, res, { target: `http://localhost:${service.port}` });
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(`Url path ${req.url} does not match routes defined in services\n`);
  res.end();
});

server.listen(3000, () => {
  console.log('API Listening on port 3000');
});

