'use strict';
const queryPreset = 'SET STATISTICS TIME ON; SET STATISTICS IO ON;';

class SessionTest {
    constructor(test, connectionPool, sqlDriver) {
        this.test = test;
        this.connectionPool = connectionPool;
        this.sql = sqlDriver;
        this.msgs = [];
        this.errs = [];
        this.results =[];

        this.runTest = this.runTest.bind(this);
        this._handleInfoMessage = this._handleInfoMessage.bind(this);
    }

    runTest() {
        const self = this;
        const sql = this.sql;
        const test = this.test;
        const request = new sql.Request(this.connectionPool);

        request.on('info', this._handleInfoMessage);
        request.on('warning', this._handleInfoMessage);
        request.multiple = true;

        return request.query(`${queryPreset} ${test.query}`).then(result => {
            self.results = result;
        })
            .catch(err => this.errs.push(err));
    }

    _handleInfoMessage(msg) {
        // console.log(msg.message);
        this.msgs.push(msg.message);
    }
}

module.exports = SessionTest;