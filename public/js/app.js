   // A SW can control files within its scope which is why it is made in the root directory.
   // Navigator is an object in JS that represents the browser & everything about it, like what it supports.
   // Below code checks if a SW exists in our project.
   // SW only works in a secure HTTPS connection. Localhost is an exception (because of development).
   if('serviceWorker' in navigator){

    // Below is an asynchronous task that returns a promise.
    navigator.serviceWorker.register('/sw.js')

    // Below is a callback function that executes when a promise is resolved.
    .then((reg) => console.log('Service worker registered.', reg))

    // Below is an exception in case the promise is rejected.
    .catch((err) => console.log('Service worker not registered.', err))
}