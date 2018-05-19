const runDat = require('../index');

describe('Running dat', function () {
    let baseConfig;

    before(function () {
        baseConfig = {
            iterations: 5,
            connectionSettings: 'Server=.;Database=SampleDB;Trusted_Connection=yes',
            tests: [{
                query: 'SELECT TOP 100 * FROM dbo.Users'
            }]
        };
    });

    describe('Invalid configuration', function () {
        it('Fails with error');

        describe('Invalid connection string', function () {
            it('Fails with connection error');
        });
    });

    describe('Valid configuration', function () {
        describe('No iteration provided', function () {
            it('Uses default iterations', async function() {
                let config = Object.assign({}, baseConfig);
                delete config.iterations;

                let session = await runDat(config);

                // TODO: validate session
            });
        });

        it('Executes successfully');
    });
});