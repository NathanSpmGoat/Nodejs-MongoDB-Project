import Validator from "validatorjs";

export default function validate(rules) {
  return (req, res, next) => {
    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(422).json({
        message: "Erreur de validation",
        errors: validation.errors.all(),
      });
    }

    next();
  };
}
