const routerErrorHandler = (func) => async (req, res, next) => {
  try {
    return await func(req, res, next);
  } catch (error) {
    next(error);
  }
};
module.exports = routerErrorHandler;
