const validateReqbody = (validationSchema) => {
  return async (req, res, next) => {
    try {
      const validData = await validationSchema.validate(req.body);
      req.body = validData;
      next();
    } catch (error) {
      return res.status(401).send({ message: error.message });
    }
  };
};
export default validateReqbody;
