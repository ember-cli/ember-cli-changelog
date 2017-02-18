'use strict';

const chai = require('chai');
const expect = chai.expect;

const generate = require('../src/generate');

chai.use(require('chai-as-promised'));

describe('generate', function() {
  it('generates a changelog from v2.10.0 to v2.10.1', function() {
    return expect(generate('v2.10.0', 'v2.10.1')).to.eventually.equal(`The following changes are required if you are upgrading from the previous
version:

- Users
  + Upgrade your project's ember-cli version - [docs](https://ember-cli.com/user-guide/#upgrading)
- Addon Developers
  + No changes required
- Core Contributors
  + No changes required

#### Community Contributions

- [#6485](https://github.com/ember-cli/ember-cli/pull/6485) tests/runner: Fix "capture-exit" compatibility [@Turbo87](https://github.com/Turbo87)
- [#6496](https://github.com/ember-cli/ember-cli/pull/6496) [BUGFIX release] Revert the reverted revert. Ember assign not available in all ember try scenarios [@webark](https://github.com/webark)
- [#6531](https://github.com/ember-cli/ember-cli/pull/6531) Update to latest capture-exit, revert work around. [@ember-cli](https://github.com/ember-cli)
- [#6533](https://github.com/ember-cli/ember-cli/pull/6533) blueprints/addon: Fix path to "ember" executable in ".travis.yml" [@Turbo87](https://github.com/Turbo87)
- [#6536](https://github.com/ember-cli/ember-cli/pull/6536) fix phantom use on travis [@kellyselden](https://github.com/kellyselden)
- [#6693](https://github.com/ember-cli/ember-cli/pull/6693) Backport subprocess invocation of npm to v2.10 [@Turbo87](https://github.com/Turbo87)

Thank you to all who took the time to contribute!`);
  });
});
