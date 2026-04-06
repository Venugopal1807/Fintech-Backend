import { config } from "./config/env";
import app from "./app";

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT} [${config.NODE_ENV}]`);
});
