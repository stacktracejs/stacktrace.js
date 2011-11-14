function createException() {
  return ((function(x) {
    try {
      x.undef();
    } catch (ex) {
      return ex;
    }
  })(null));
}

function printProp(prop, value) {
  if (typeof value === "string") {
    value = '"' + value.replace(/\"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, '\\n" +\n    "') + '"';
  }
  return prop + ': ' + value;
}

function getExceptionProps(ex) {
  var prop, props = [], obj = {
    message: true,
    stack: true,
    stacktrace: true,
    'arguments': true
  };
  // find enumerable properties
  for (prop in ex) {
    obj[prop] = true;
  }

  for (prop in obj) {
    var value = ex[prop];
    if (typeof value !== "undefined") {
      props.push(printProp(prop, value));
    }
  }
  return props;
}
