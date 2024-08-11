const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-spies'));
const fs = require('fs');
const parser = require('@babel/parser');

describe('02-code-comments.js', function () {
  let consoleSpy;
  const problemPath = __dirname + '/../problems/02-code-comments.js';
  const fileContent = fs.readFileSync(problemPath, 'utf-8');
  const codeCommentsAST = parser.parse(fileContent, {
    sourceType: 'module',
    tokens: true,
  });

  before(() => {
    consoleSpy = chai.spy.on(console, 'log');
    require('../problems/02-code-comments');
  });

  after(() => {
    chai.spy.restore(console);
  });

  it('prints out "Welcome to App Academy!"', function() {
    expect(consoleSpy).to.be.called.with("Welcome to App Academy!");
  });

  it('added a single-line comment', function() {
    const originalLineComments = [
      " 2. This is a single line comment.",
      " console.log('This is will not be printed to the terminal')",
      " Try adding your own single line comments:",
      " Your code here",
    ];

    const newCommentLines = codeCommentsAST.comments.filter(comment =>
      comment.type === 'CommentLine'
        && !originalLineComments.includes(comment.value)
    );

    expect(newCommentLines.length, 'No new single-line comment found')
      .to.be.at.least(1);
  });

  it('added a multi-line comment', function() {
    const originalMultiLineComments = [
      '\n'
        + 'Use your newfound knowledge of comments to execute the prompts in this problem\n'
        + 'file.\n',
      ' 1. This will print \'Welcome to App Academy!\'  ',
      ' Print more messages to the terminal using console.log ',
      ' 3.\n'
        + 'This is a multi-line comment.\n'
        + 'Try adding your own multi-line comments:\n',
    ];
    const newCommentBlocks = codeCommentsAST.comments.filter(comment =>
      comment.type === 'CommentBlock'
        && !originalMultiLineComments.includes(comment.value)
    );

    expect(newCommentBlocks.length, 'No new multi-line comment found')
      .to.be.at.least(1);
  });
});
