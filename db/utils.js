exports.formatTimestamps = collection => {
  return collection.map(item => {
    const { created_at: timestamp, ...restOfObject } = item;
    return { created_at: new Date(timestamp), ...restOfObject };
  });
};

exports.createRef = (collection, key, value) => {
  return collection.reduce((refObject, item) => {
    refObject[item[key]] = item[value];
    return refObject;
  }, {});
};

exports.formatComments = (collection, refObject) => {
  return collection.map(item => {
    const { belongs_to, ...restOfObject } = item;
    return { article_id: refObject[belongs_to], ...restOfObject };
  });
};

exports.renameKeys = (collection, keyToChange, keyAfterChange) => {
  return collection.map(item => {
    const { [keyToChange]: value, ...restOfObject } = item;
    return { [keyAfterChange]: value, ...restOfObject };
  });
};
