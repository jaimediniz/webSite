// Open Messages Sheet
const messagesSHSheetID = '1tR0PS5Xc_enq_jQFFBPm-8BbjnuBGiwbf9R7XV9SB18';
const messagesSH = SpreadsheetApp.openById(messagesSHSheetID);
const messagesSS = messagesSH.getSheets()[0];

function messagesRoute(jsonData) {
  if (jsonData['endPoint'] === 'createMessage') {
    return createMessage(jsonData);
  }

  if (jsonData['endPoint'] === 'deleteMessage') {
    return deleteMessage(jsonData);
  }

  if (jsonData['endPoint'] === 'getMessages') {
    return getMessages(jsonData);
  }

  return postTextOutput(404, true, 'Route not found!', {
    dev: {
      route: jsonData['endPoint']
    }
  });
}

function createMessage(jsonData) {
  const username = getUsername(jsonData);
  // Get last Row
  var newLastRow = messagesSS.getLastRow() + 1;

  const date = new Date();
  const timestamp = date.toISOString();

  messagesSS.getRange('A' + newLastRow).setValue(newLastRow - 2);
  messagesSS.getRange('B' + newLastRow).setValue(username);
  messagesSS.getRange('C' + newLastRow).setValue(jsonData['message']);
  messagesSS.getRange('D' + newLastRow).setValue(timestamp);
  messagesSS.getRange('E' + newLastRow).setValue(jsonData['isPublic']);

  return postTextOutput(201, false, 'Created!', {
    id: newLastRow - 2,
    message: jsonData['message'],
    createdAt: timestamp,
    isPublic: jsonData['isPublic']
  });
}

function deleteMessage(jsonData) {
  const username = getUsername(jsonData);

  const deleteRow = jsonData['messageId'] + 2;
  const messageUser = messagesSS.getRange(deleteRow, 2).getValue();

  if (!isAdmin(jsonData) && messageUser != username) {
    return postTextOutput(400, false, 'Not Allowed!', {
      dev: {
        isAdmin: isAdmin(jsonData),
        messageUser: messageUser,
        username: username
      }
    });
  }

  messagesSS.getRange(deleteRow, 1, 1, 5).setValues([['', '', '', '', '']]);

  return postTextOutput(200, false, 'Deleted!', { row: deleteRow });
}

function getMessages(jsonData) {
  const username = getUsername(jsonData);
  // Get last Row
  var lastRow = messagesSS.getLastRow();

  // Pagination
  //TODO: Add pagination

  if (isAdmin(jsonData)) {
    // Get all values from C2:C-1
    var allMessages = messagesSS.getRange(2, 1, lastRow - 1, 5).getValues();
    return postTextOutput(200, false, 'Messages!', { messages: allMessages });
  }

  // Get all values from B2:C-1
  var values = messagesSS.getRange(2, 1, lastRow - 1, 5).getValues();

  // Search for username
  var messages = [];
  for (row = 0; row < values.length; ++row) {
    if (values[row][1] === username) {
      messages.push(values[row]);
    }
  }

  return postTextOutput(200, false, 'Messages!', { messages: messages });
}
