import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv, { config } from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import mlRoutes from "./routes/ml.js";
import OpenAI from 'openai'; 
import paymentRoutes from './routes/payment.js';

// data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./data/index.js";

import path from "path";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


/* ROUTES */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);
app.get("/api/test", (req, res) => {
  res.json({ message: "API works!" });
});
app.use("/api/ml", mlRoutes);
app.use("/ml-output", express.static(path.join(path.resolve(), "ml/output")));
app.get('/api/test-openai', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say this is a test" }],
    });
    res.json({ success: true, reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});
app.use('/api/payment', paymentRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    //AffiliateStat.insertMany(dataAffiliateStat);
    //OverallStat.insertMany(dataOverallStat);
    //Product.insertMany(dataProduct);
    //ProductStat.insertMany(dataProductStat);
    //Transaction.insertMany(dataTransaction);
    //User.insertMany(dataUser);
  })
  .catch((error) => console.log(`${error} did not connect`));
