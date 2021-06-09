function clearSlash(req, res, next) {
  
  let str = req.url;
  req.url = str.replace("//", "/");
  
  const count = (str.match(/\/\//g) || []).length;
  if (count > 0 && count < 50) return clearSlash( req, res, next);

  req.originalUrl = str;
  req._parsedUrl.pathname = str;
  req._parsedUrl.path = str;
  req._parsedUrl.href = str;
  req._parsedUrl._raw = str;

  return next();
}

module.exports = clearSlash;
