const config = require('./config')();

if (config.environment.isProd()) {
    console.log('It is production!');
}
console.log('%o', config);
console.log('%s', config.ws.gateway.buildUrl('/dynpath/{someId}', n => n));
console.log('%s', config.ws.gateway.sayHello({ name: 'webJose', emotion: 'happy' }));
console.log('%s', config.ws.gateway.ldap.users.getUser(n => 'webJose'));
console.log('%s', config.ws.gateway.ldap.users.getUserGroups(n => 'webJose'));
console.log('%s', config.ws.mifes.mifeA.manifest());
console.log('%s', config.ws.mifes.mifeB.manifest());
console.log('Finished.');
