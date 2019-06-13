const {
  formatTimestamps,
  createRef,
  formatComments,
  renameKeys
} = require('../db/utils/utils');
const { expect } = require('chai');

describe('formatTimestamps()', () => {
  it('returns an empty array if passed an empty collection of articles', () => {
    expect(formatTimestamps([])).to.eql([]);
  });
  it('convert the timestamp to a date if passed an collection with one article', () => {
    const input = [
      {
        created_at: 1542284514171
      }
    ];
    const output = formatTimestamps(input);
    expect(output[0].created_at).to.be.an.instanceof(Date);
  });
  it('converts the timestamp to a date if passed a collection with 2 or more articles', () => {
    const input = [
      {
        created_at: 1542284514171
      },
      {
        created_at: 1500584273256
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        created_at: 1500584273256
      }
    ];
    const output = formatTimestamps(input);
    output.forEach = item => {
      expect(item.created_at).to.be.an.instanceof(Date);
    };
  });
});

describe('createRef()', () => {
  it('returns an empty object if passed an empty collection', () => {
    expect(createRef([])).to.eql({});
  });
  it('creates a reference object if passed a collection with one article', () => {
    const input = [{ key: 1, value: 2 }];
    expect(createRef(input, 'key', 'value')).to.eql({ 1: 2 });
  });
  it('creates a reference object if passed a collection with 2 or more articles', () => {
    const input = [
      { topic: 'topic1', id: 'id1' },
      { topic: 'topic2', id: 'id2' },
      { topic: 'topic3', id: 'id3' }
    ];
    expect(createRef(input, 'topic', 'id')).to.eql({
      topic1: 'id1',
      topic2: 'id2',
      topic3: 'id3'
    });
  });
});

describe('formatComments()', () => {
  it('returns an empty array if passed an empty collection of comments', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('returns formatted comments data if passed a collection with 1 comment and a ref object', () => {
    const input = [{ belongs_to: 'title1', body: 'body1' }];
    const ref = { title1: 1 };
    expect(formatComments(input, ref)).to.eql([
      { article_id: 1, body: 'body1' }
    ]);
  });
  it('returns formatted comments data if passed a collection with 2 or more comments and a ref object', () => {
    const input = [
      { belongs_to: 'title1', body: 'body1' },
      { belongs_to: 'title2', body: 'body2' },
      { belongs_to: 'title3', body: 'body3' }
    ];
    const ref = { title1: 1, title2: 2, title3: 3 };
    const expectedOutput = [
      { article_id: 1, body: 'body1' },
      { article_id: 2, body: 'body2' },
      { article_id: 3, body: 'body3' }
    ];
    expect(formatComments(input, ref)).to.eql(expectedOutput);
  });
});

describe('renameKeys()', () => {
  it('returns an empty array if passed an empty collection', () => {
    expect(renameKeys([])).to.eql([]);
  });
  it('renames selected key in an object if passed a collection with one object', () => {
    expect(
      renameKeys([{ keyToRename: 1, ignoreMe: 2 }], 'keyToRename', 'renamedKey')
    ).to.eql([{ renamedKey: 1, ignoreMe: 2 }]);
  });
  it('renames selected key in an object if passed a collection with 2 or more objects', () => {
    expect(
      renameKeys(
        [
          { keyToRename: 1, ignoreMe: 2 },
          { keyToRename: 3, dontChangeMe: 4 },
          { keyToRename: 5, ignoreMe: 6 }
        ],
        'keyToRename',
        'renamedKey'
      )
    ).to.eql([
      { renamedKey: 1, ignoreMe: 2 },
      { renamedKey: 3, dontChangeMe: 4 },
      { renamedKey: 5, ignoreMe: 6 }
    ]);
  });
});
