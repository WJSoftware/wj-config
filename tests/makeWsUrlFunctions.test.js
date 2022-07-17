require('chai').should();
const helpers = require('../src/helpers');
const makeWsUrlFunctions = require('../src/makeWsUrlFunctions');

const propertyInHierarchy = (obj, propertyName, result, resultKey) => {
    if (!result) {
        result = {};
    }
    helpers.forEachProperty(obj, (key, value) => {
        if (helpers.isObject(value)) {
            const newKey = resultKey ? `${resultKey}_${key}` : key;
            propertyInHierarchy(value, propertyName, result, newKey);
        }
    });
    result[resultKey ?? 'Root'] = obj[propertyName] !== undefined;
    return result;
};

describe('makeWsUrlFunctions', () => {
    const incorrectTypeTestFn = (obj, shouldThrow) => {
        // Act.
        const act = () => makeWsUrlFunctions(obj);

        // Assert.
        if (shouldThrow) {
            act.should.throw(Error);
        }
        else {
            act.should.not.throw();
        }
    }
    it('Should not throw an error if given null as object.', () => incorrectTypeTestFn(null, false));
    it('Should not throw an error if given undefined as object.', () => incorrectTypeTestFn(undefined, false));
    it('Should throw an error if given a non-object.', () => incorrectTypeTestFn(123, true));
    const hasBuildUrlTestFn = (config, expectedResult) => {
        // Act.
        makeWsUrlFunctions(config);

        // Assert.
        const pih = propertyInHierarchy(config, 'buildUrl');
        pih.should.deep.equal(expectedResult);
    };
    it('Should identify the first object with rootPath as the root object.', () => hasBuildUrlTestFn({
        ws: {
            gateway: {
                mifeA: {
                    rootPath: '/mifea'
                }
            }
        }
    }, {
        Root: false,
        ws: false,
        ws_gateway: false,
        ws_gateway_mifeA: true
    }));
    it('Should identify the first object with host as the root object.', () => hasBuildUrlTestFn({
        ws: {
            gateway: {
                mifeA: {
                    host: 'localhost'
                }
            }
        }
    }, {
        Root: false,
        ws: false,
        ws_gateway: false,
        ws_gateway_mifeA: true
    }));
    it('Should identify one root object per branch.', () => hasBuildUrlTestFn({
        ws: {
            defaultTimeout: 30,
            gateway: {
                rootPath: '/api/v1',
                login: '/login',
                scheme: 'https',
                catalogue: {
                    rootPath: '/cat',
                    getAll: '',
                    single: '/{catId}'
                }
            },
            gwSockets: {
                rootPath: '/ws',
                scheme: 'wss',
                support: {
                    rootPath: '/support',
                    chat: '/chat?userId={userId}'
                }
            }
        }
    }, {
        Root: false,
        ws: false,
        ws_gateway: true,
        ws_gateway_catalogue: true,
        ws_gwSockets: true,
        ws_gwSockets_support: true
    }));
    it('Should not alter any object in the hierarchy if no root object is found.', () => hasBuildUrlTestFn({
        ws: {
            gateway: {
                timeOut: 40,
                users: {
                    getAll: '',
                    get: '{id}'
                },
                products: {
                    getAll: '',
                    archivedProducts: {
                        getAll: ''
                    }
                }
            }
        }
    }, {
        Root: false,
        ws: false,
        ws_gateway: false,
        ws_gateway_users: false,
        ws_gateway_products: false,
        ws_gateway_products_archivedProducts: false
    }));
    it('Should not convert any properties whose name start with an underscore.', () => {
        // Arrange.
        const config = {
            ws: {
                rootPath: '/api',
                _timeout: 30,
                login: 'login'
            }
        };

        // Act.
        makeWsUrlFunctions(config);

        // Assert.
        config.ws._timeout.should.be.a('number');
    });
    it('Should not convert the reserved properties host, scheme, port and rootPath.', () => {
        // Arrange.
        const config = {
            ws: {
                host: 'localhost',
                scheme: 'https',
                port: 443,
                rootPath: '/api',
            }
        };

        // Act.
        makeWsUrlFunctions(config);

        // Assert.
        config.ws.host.should.be.a('string');
        config.ws.scheme.should.be.a('string');
        config.ws.port.should.be.a('number');
        config.ws.rootPath.should.be.a('string');
    });
    it('Should convert any properties in the root object whose name is not reserved and does not start with underscore.', () => {
        // Arrange.
        const config = {
            ws: {
                rootPath: '/api',
                login: 'login',
                ping: 'pingme',
                status: 'status'
            }
        };

        // Act.
        makeWsUrlFunctions(config);

        // Assert.
        config.ws.login.should.be.a('function');
        config.ws.ping.should.be.a('function');
        config.ws.status.should.be.a('function');
    });
    it('Should convert any properties in child objects of a root object whose name is not reserved and does not start with underscore.', () => {
        // Arrange.
        const config = {
            ws: {
                rootPath: '/api',
                general: {
                    login: 'login',
                    ping: 'pingme',
                    status: 'status'
                }
            }
        };

        // Act.
        makeWsUrlFunctions(config);

        // Assert.
        config.ws.general.login.should.be.a('function');
        config.ws.general.ping.should.be.a('function');
        config.ws.general.status.should.be.a('function');
    });
    describe('buildUrl', () => {
        const urlPartsTestFn = (config, expectedUrl) => {
            // Arrange.
            makeWsUrlFunctions(config);

            // Act.
            const url = config.ws.testUrl();

            // Assert.
            url.should.equal(expectedUrl);
        };
        it('Should build a relative path if no host is provided.', () => urlPartsTestFn({
            ws: {
                rootPath: '/root',
                testUrl: '/test'
            }
        }, '/root/test'));
        it('Should build an absolute URL with the http scheme if a host is provided and no scheme is provided.', () => urlPartsTestFn({
            ws: {
                host: 'localhost',
                testUrl: '/test'
            }
        }, 'http://localhost/test'));
        it('Should build a URL with a port number if a port is provided.', () => urlPartsTestFn({
            ws: {
                host: 'localhost',
                port: 4000,
                testUrl: '/test'
            }
        }, 'http://localhost:4000/test'));
        it('Should build a URL with the provided host, scheme and port.', () => urlPartsTestFn({
            ws: {
                host: 'example.com',
                port: 5000,
                scheme: 'wss',
                testUrl: '/test'
            }
        }, 'wss://example.com:5000/test'));
        it('Should build a URL with all the rootPath values in its hierarchy path.', () => {
            // Arrange.
            const config = {
                ws: {
                    gateway: {
                        rootPath: '/api',
                        security: {
                            rootPath: '/sec',
                            users: {
                                rootPath: '/users',
                                getAll: ''
                            }
                        }
                    }
                }
            };
            makeWsUrlFunctions(config);

            // Act.
            const url = config.ws.gateway.security.users.getAll();

            // Assert.
            url.should.equal('/api/sec/users');
        });
        const routeReplacementTestFn = (routeValues, expectedResult) => {
            // Arrange.
            const config = {
                ws: {
                    gateway: {
                        rootPath: '/api',
                        security: {
                            rootPath: '/sec',
                            users: {
                                rootPath: '/users',
                                get: '/{id}'
                            }
                        }
                    }
                }
            };
            makeWsUrlFunctions(config);

            // Act.
            const url = config.ws.gateway.security.users.get(routeValues);

            // Assert.
            url.should.equal(expectedResult);
        };
        it('Should build a URL with no route replacements if no replacement object, function or array is provided.', () => routeReplacementTestFn(undefined, '/api/sec/users/{id}'));
        it('Should build a URL with replaceable route values replaced if a replacement object is provided.', () => routeReplacementTestFn({ id: 123 }, '/api/sec/users/123'));
        it('Should build a URL with replaceable route values replaced if a replacement function is provided.', () => routeReplacementTestFn(n => 456, '/api/sec/users/456'));
        it('Should build a URL with replaceable route values replaced if a replacement array is provided.', () => routeReplacementTestFn([789], '/api/sec/users/789'));
    });
});
