import { IntegrationData } from "./src/testdata/integrationtestdata.js";
import { app } from "./src/app.js";

IntegrationData()
  .then(() => {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    console.error(
      "Server crashed during setup, please restart the server"
    );
  });
