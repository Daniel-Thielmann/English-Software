const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");

const app = express();
app.use(express.json());
app.use(cors());

// Adiciona a rota do ranking
app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
