
import express from "express";
import CrawlController from "../app/controllers/CrawlController";

const router = express.Router();
const crawlController = new CrawlController();

// :slug
router.use("/auto", crawlController.autoCrawl)
router.use("/status/:slug", crawlController.status);
router.use("/:slug", crawlController.show);
router.use("/", crawlController.index);



// export default router as crawlRouter;
export default router;
