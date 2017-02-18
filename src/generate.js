'use strict';

const EOL = require('os').EOL;
const multiline = require('multiline');
const RSVP = require('rsvp');
const GitHubApi = require('github');

let github = new GitHubApi({ version: '3.0.0' });
let compareCommits = RSVP.denodeify(github.repos.compareCommits);

module.exports = function(base, head) {
  return compareCommits({
    owner: 'ember-cli',
    repo: 'ember-cli',
    base,
    head,
  })
    .then(res => res.commits
      .map(commitInfo => commitInfo.commit.message)
      .filter(message => message.indexOf('Merge pull request #') > -1 || message.indexOf('Auto merge of #') > -1)
      .map(message => {
        if (message.indexOf('Auto merge of #') > -1) {
          let numAndAuthor = message.match(/#(\d+) - (.*):/).slice(1, 3);
          let title = message.split('\n\n')[1];

          return {
            number: +numAndAuthor[0],
            author: numAndAuthor[1],
            title,
          };
        } else if (message.indexOf('Merge pull request #') > -1) {
          let numAndAuthor = message.match(/#(\d+) from (.*)\//).slice(1, 3);
          let title = message.split('\n\n')[1];

          return {
            number: +numAndAuthor[0],
            author: numAndAuthor[1],
            title,
          };
        }

      })
      .sort((a, b) => a.number > b.number)
      .map(pr => {
        let link = `[#${pr.number}](https://github.com/ember-cli/ember-cli/pull/${pr.number})`;
        let title = pr.title;
        let author = `[@${pr.author}](https://github.com/${pr.author})`;

        return `- ${link} ${title} ${author}`;

      })
      .join('\n'))
    .then(contributions => generateChangelog(contributions));
};


function generateChangelog(contributions) {
  let header = multiline(() => { /*
The following changes are required if you are upgrading from the previous
version:

- Users
  + Upgrade your project's ember-cli version - [docs](https://ember-cli.com/user-guide/#upgrading)
- Addon Developers
  + No changes required
- Core Contributors
  + No changes required

#### Community Contributions
  */ });

  let footer = 'Thank you to all who took the time to contribute!';

  return header + EOL + EOL + contributions + EOL + EOL + footer;
}
