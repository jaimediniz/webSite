const privateKey = 'yU9bviYZh5ixqSLNJy6LrXUuJzB3K9jZ';
const publicKey = '7qf4atg8JaQDT0zY1lnI2PUKX9IPwQRj';
const PROD = false;

function doGet(e) {
  if (e.parameter['route'] === 'subscriptions') {
    return subscriptionsRoute(e.parameter);
  }
  return postTextOutput(404, true, 'Invalid Route!', e.parameter);
}

const doPost = (request = {}) => {
  //return postTextOutput(400, true, 'Invalid Request!', {"request":request});
  const { parameter, postData: { contents, type } = {} } = request;
  const { source } = parameter;

  if (typeof request == 'undefined') {
    return postTextOutput(400, true, 'Wrong data type!!!', { type });
  }

  const jsonData = JSON.parse(contents);

  if (jsonData['route'] === '') {
    return postTextOutput(404, true, 'Invalid Route!', {});
  }

  if (jsonData['publicKey'] != publicKey) {
    return postTextOutput(400, true, 'Invalid Request!', {});
  }

  return postRoutes(jsonData);
};
