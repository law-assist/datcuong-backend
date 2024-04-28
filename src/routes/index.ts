import { Application, Request, Response } from "express";

import crawlRoute from "./crawl.route";

function route(app: Application) {
    app.use("/crawl", crawlRoute);
    // app.get("/status", crawlRoute);

    app.get("/", (req: Request, res: Response) => {
        res.send("Hello World!");
    });

    app.get("/api", (req: any, res: any) => {
        res.send("Hello World!!");
    });
}
export default route;
