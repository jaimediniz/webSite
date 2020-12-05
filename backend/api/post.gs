function postTextOutput(code, error, message, data) {
  if (PROD) {
    data.dev = undefined;
  }

  return ContentService.createTextOutput(
    '{"code":' +
      code +
      ',"error":' +
      error +
      ',"message":' +
      '"' +
      message +
      '"' +
      ',"data":' +
      JSON.stringify(data) +
      '}'
  );
}

function isValidRequest(jsonData) {
  if (!jsonData['tokenRow'] || !jsonData['token']) {
    return false;
  }

  return true;
}

const postRoutes = (jsonData) => {
  // Non Auth Routes
  if (jsonData['route'] === 'register') {
    return register(jsonData);
  }

  if (jsonData['route'] === 'login') {
    return login(jsonData);
  }

  // Auth routes
  if (!isValidRequest(jsonData) || !isUserValid(jsonData)) {
    return postTextOutput(400, true, 'Invalid User!', {
      dev: {
        isValidRequest: isValidRequest(jsonData),
        isUserValid: isUserValid(jsonData)
      }
    });
  }

  if (jsonData['route'] === 'logoff') {
    return logoff(jsonData);
  }

  if (jsonData['route'] === 'messages') {
    return messagesRoute(jsonData);
  }

  // Admin Route
  if (!isAdmin()) {
    return postTextOutput(400, true, 'Access denied!', {
      dev: {
        isAdmin: isAdmin()
      }
    });
  }

  return adminRoute(jsonData);
};
