const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url)
}

module.exports = connectDB

/*
Removed the deprecated options useNewUrlParser and useUnifiedTopology
as they have no effect since Node.js Driver version 4.0.0.
node --trace-deprecation app.js
(node:31112) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver versio
n 4.0.0 and will be removed in the next major version
(Use `node --trace-warnings ...` to show where the warning was created)
(node:31112) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver 
version 4.0.0 and will be removed in the next major version
*/


