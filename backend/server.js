const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users"); // 🔹 Importando a rota corrigida

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", userRoutes); // 🔹 Agora a API `/api/create-user` funcionará corretamente

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
