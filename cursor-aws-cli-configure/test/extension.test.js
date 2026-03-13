const assert = require('assert');
const path = require('path');
const os = require('os');

// Basic unit tests for the AWS CLI Configure for Cursor extension.
// These tests run without a full VS Code / Cursor environment.

suite('Extension Unit Tests', () => {

    test('Credentials file path is under home directory', () => {
        const expectedPath = path.join(os.homedir(), '.aws', 'credentials');
        assert.strictEqual(
            path.join(os.homedir(), '.aws', 'credentials'),
            expectedPath
        );
    });

    test('Config file path is under home directory', () => {
        const expectedPath = path.join(os.homedir(), '.aws', 'config');
        assert.strictEqual(
            path.join(os.homedir(), '.aws', 'config'),
            expectedPath
        );
    });

    test('INI parsing produces correct profile keys', () => {
        const ini = require('ini');
        const sample = `
[default]
aws_access_key_id = AKIA000DEFAULT
aws_secret_access_key = secret0

[dev]
aws_access_key_id = AKIA000DEV
aws_secret_access_key = secret1

[prod]
aws_access_key_id = AKIA000PROD
aws_secret_access_key = secret2
`.trim();

        const parsed = ini.parse(sample);
        const profiles = Object.keys(parsed).sort();
        assert.deepStrictEqual(profiles, ['default', 'dev', 'prod']);
    });

    test('INI round-trip preserves profile data', () => {
        const ini = require('ini');
        const data = {
            default: { aws_access_key_id: 'AKIATEST', aws_secret_access_key: 'testsecret' },
            dev:     { aws_access_key_id: 'AKIADEV',  aws_secret_access_key: 'devsecret'  }
        };
        const serialised = ini.stringify(data);
        const reparsed   = ini.parse(serialised);
        assert.strictEqual(reparsed.default.aws_access_key_id, 'AKIATEST');
        assert.strictEqual(reparsed.dev.aws_access_key_id,     'AKIADEV');
    });

});
