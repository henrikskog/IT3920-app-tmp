import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
