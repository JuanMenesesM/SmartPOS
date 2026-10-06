import express from "express";
import * as OpenAIController from "./openai.controller";

const router = express.Router();

router.get("/test", OpenAIController.testOpenAIController);

export default router;