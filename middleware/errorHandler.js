export const errorHandler = (err, req, res, next) => {
    console.error("❌ ERREUR API :", err);
  
    // Erreur de validation Mongoose
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "error",
        message: "Erreur de validation",
        details: err.errors,
      });
    }
  
    // Erreur clé unique (email déjà utilisé)
    if (err.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Cette valeur doit être unique",
        field: err.keyValue,
      });
    }
  
    // Erreur ID invalide (`CastError`)
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Identifiant invalide",
      });
    }
  
    // Erreurs générales
    res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Erreur interne du serveur",
    });
  };
  