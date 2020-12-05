function adminRoute(jsonData) {
  //TODO: Make admin route
  return postTextOutput(404, true, 'Route not found!', {
    dev: {
      isAdmin: isAdmin()
    }
  });
}
