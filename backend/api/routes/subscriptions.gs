// Open Subs Sheet
const subsSheetID = '1oMPmEJNydCA-Y8TQ3IG9KTFpWE8qGweyTjmOxYkENDI';
const subsSH = SpreadsheetApp.openById(subsSheetID);
const subsSS = subsSH.getSheets()[0];

function subscriptionsRoute(jsonData) {
  if (jsonData['endPoint'] === 'getSubscriptions') {
    return getSubscriptions(jsonData);
  }

  if (jsonData['endPoint'] === 'addSubscription') {
    return addSubscriptions(jsonData);
  }

  return postTextOutput(404, true, 'Route not found!', {
    dev: {
      route: jsonData['endPoint']
    }
  });
}

function getSubscriptions(jsonData) {
  if (jsonData['password'] !== 'tandemNICE') {
    return postTextOutput(400, true, 'Access denied!', {
      dev: {
        password: jsonData['password']
      }
    });
  }

  const lastRow = subsSS.getLastRow();
  const allSubscriptions = subsSS.getRange(2, 1, lastRow - 1, 7).getValues();
  return postTextOutput(200, false, 'Subscriptions!', {
    subscriptions: allSubscriptions
  });
}

function addSubscriptions(jsonData) {
  // Get last Row
  var newLastRow = subsSS.getLastRow() + 1;

  subsSS.getRange('A' + newLastRow).setValue(jsonData['name']);
  subsSS.getRange('B' + newLastRow).setValue(jsonData['endpointURL']);
  subsSS.getRange('C' + newLastRow).setValue('null');
  subsSS.getRange('D' + newLastRow).setValue(jsonData['keyP256dh']);
  subsSS.getRange('E' + newLastRow).setValue(jsonData['keyAuth']);
  subsSS.getRange('F' + newLastRow).setValue(jsonData['paused']);
  subsSS.getRange('G' + newLastRow).setValue(jsonData['topics']);

  return postTextOutput(201, false, 'Created!', {
    name: jsonData['name'],
    endpoint: jsonData['endpointURL'],
    expirationTime: 'null',
    keyP256dh: jsonData['keyP256dh'],
    keyAuth: jsonData['keyAuth'],
    paused: jsonData['paused'],
    topics: jsonData['topics']
  });
}
