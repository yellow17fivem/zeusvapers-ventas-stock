import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect(
  "mongodb+srv://lautaroberamendi1:S9V9r2okRaWHwlqh@zeusvapers.ollixyr.mongodb.net/?appName=ZeusVapers",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const ventaSchema = new mongoose.Schema({
  tipo: String,
  sabor: String,
  cantidad: Number,
  descuento: Number,
  pago: String,
  envio: Number,
  total: Number,
  fecha: { type: Date, default: Date.now }
});

const stockSchema = new mongoose.Schema({
  tipo: String,
  sabor: String,
  cantidad: Number
});

const Venta = mongoose.model("Venta", ventaSchema);
const Stock = mongoose.model("Stock", stockSchema);

// Endpoints
app.get("/ventas", async (req, res) => {
  const ventas = await Venta.find();
  res.json(ventas);
});

app.post("/ventas", async (req, res) => {
  const venta = new Venta(req.body);
  await venta.save();
  res.json({ success: true });
});

app.get("/stock", async (req, res) => {
  const stock = await Stock.find();
  res.json(stock);
});

app.post("/stock", async (req, res) => {
  const { tipo, sabor, cantidad } = req.body;
  let s = await Stock.findOne({ tipo, sabor });
  if(s){
    s.cantidad = cantidad;
    await s.save();
  } else {
    s = new Stock({ tipo, sabor, cantidad });
    await s.save();
  }
  res.json({ success: true });
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));