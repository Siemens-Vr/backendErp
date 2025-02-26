const dns = require('dns');
const net = require('net');

// Test DNS resolution
console.log('Testing DNS resolution...');
dns.resolve('smtp.gmail.com', (err, addresses) => {
    if (err) {
        console.error('DNS resolution failed:', err);
    } else {
        console.log('DNS addresses:', addresses);
        
        // Try connecting to each IP
        addresses.forEach(ip => {
            const socket = new net.Socket();
            console.log(`Testing connection to ${ip}:587...`);
            
            socket.setTimeout(5000); // 5 second timeout
            
            socket.on('connect', () => {
                console.log(`Successfully connected to ${ip}:587`);
                socket.end();
            });
            
            socket.on('timeout', () => {
                console.log(`Connection to ${ip}:587 timed out`);
                socket.destroy();
            });
            
            socket.on('error', (err) => {
                console.log(`Error connecting to ${ip}:587:`, err.message);
            });
            
            socket.connect(587, ip);
        });
    }
});

// Test common ports to check firewall
const testPorts = [80, 443, 587];
testPorts.forEach(port => {
    const socket = new net.Socket();
    console.log(`Testing connection to smtp.gmail.com:${port}...`);
    
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
        console.log(`Port ${port} is open`);
        socket.end();
    });
    
    socket.on('timeout', () => {
        console.log(`Connection to port ${port} timed out`);
        socket.destroy();
    });
    
    socket.on('error', (err) => {
        console.log(`Error on port ${port}:`, err.message);
    });
    
    socket.connect(port, 'smtp.gmail.com');
});