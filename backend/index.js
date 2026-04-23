import express from 'express';
import cors from 'cors';   
import { main } from '../app.js';       // ✅ import cors

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware FIRST
app.use(cors());                                  // ✅ enable cors
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/', async (req, res) => {
try {
console.log(req.body);


const result = await main(req.body.message);

return res.status(200).json({
  reply: result
});


} catch (error) {
console.error(error);


return res.status(500).json({
  error: "Something went wrong"
});


}
});


app.get('/', (req, res) => {
  res.status(200).json({ message: 'GET received' });
});

app.listen(PORT, () => {
  console.log("Server is On", PORT);
});