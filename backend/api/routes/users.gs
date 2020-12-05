// Open Auth Sheet
const authSheetID = '1-G36PBaCAKaEgt6BgQAxdnXiyI4SZkOtmPhE7nhTeM4';
const authSH = SpreadsheetApp.openById(authSheetID);
const authSS = authSH.getSheets()[0];

function register(jsonData) {
  // Get last Row
  var lastRow = authSS.getLastRow();

  // Get all values from C2:D-1
  var values = authSS.getRange(2, 2, lastRow - 1, 1).getValues();

  // Search for username
  var notFound = true;
  for (row = 0; row < values.length; ++row) {
    if (values[row][0] === jsonData['username']) {
      notFound = false;
      break;
    }
  }

  if (!notFound) {
    return postTextOutput(400, true, 'Username already in use!', {
      dev: {
        notFound: notFound,
        lastRow: lastRow + 1,
        realPassword: jsonData['username'],
        password: jsonData['password'],
        hashPassword: hashPassword(jsonData['password'])
      }
    });
  }

  const token = createFullToken();
  authSS.getRange(lastRow + 1, 1).setValue(lastRow - 1);
  authSS.getRange(lastRow + 1, 2).setValue(jsonData['username']);
  authSS.getRange(lastRow + 1, 3).setValue(hashPassword(jsonData['password']));
  authSS.getRange(lastRow + 1, 4).setValue(token);
  authSS.getRange(lastRow + 1, 5).setValue('0');

  return postTextOutput(201, false, 'Created!', {
    token: token,
    tokenRow: lastRow + 1
  });
}

function login(jsonData) {
  // Get last Row
  var lastRow = authSS.getLastRow();

  // Get all values from C2:D-1
  var values = authSS.getRange(2, 2, lastRow - 1, 2).getValues();

  // Search for username
  var notFound = true;
  for (row = 0; row < values.length; ++row) {
    if (values[row][0] === jsonData['username']) {
      notFound = false;
      break;
    }
  }

  //TODO: Remove hashPassword after hash is implemented in frontend
  if (notFound || values[row][1] != hashPassword(jsonData['password'])) {
    return postTextOutput(404, true, 'Invalid password or username!', {
      dev: {
        notFound: notFound,
        realPassword: values[row][1],
        password: jsonData['password'],
        hashPassword: hashPassword(jsonData['password'])
      }
    });
  }

  const token = createFullToken();
  authSS.getRange(row + 2, 4).setValue(token);

  return postTextOutput(200, false, 'Success!', {
    token: token,
    tokenRow: row + 2,
    isAdmin: isAdmin({ tokenRow: row + 2 })
  });
}

function logoff(jsonData) {
  authSS.getRange(jsonData['tokenRow'], 4).setValue('');
  return postTextOutput(200, false, 'Token was revoked!', {
    dev: {
      jsonData: jsonData
    }
  });
}

var halfToken = function () {
  return Math.random().toString(36).substr(2);
};

var createFullToken = function () {
  return halfToken() + halfToken();
};

var hashPassword = function (password) {
  var hash = 0;
  if (password.length == 0) {
    return hash;
  }
  for (var i = 0; i < password.length; i++) {
    var char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};

var getUsername = function (jsonData) {
  return authSS.getRange(jsonData['tokenRow'], 2).getValue();
};

function isUserValid(jsonData) {
  const realToken = authSS.getRange(jsonData['tokenRow'], 4).getValue();
  if (realToken != jsonData['token']) {
    return false;
  }

  return true;
}

function isAdmin(jsonData) {
  const admin = authSS.getRange(jsonData['tokenRow'], 5).getValue();
  if (admin != '1') {
    return false;
  }

  return true;
}
