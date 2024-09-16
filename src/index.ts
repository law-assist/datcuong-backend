import express, { Express } from "express";
import dotenv from "dotenv";

import route from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

route(app);

// app.get("/api", (req: Request, res: Response) => {
//   res.send("Hello World!!");
// });

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
