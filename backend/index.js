import express from 'express';
import cors from 'cors';   
import { main } from '../app.js'; 
import  connectdb from './connection.js'
import { v4 as uuidv4 } from "uuid";
import  Message  from "./model/model.js";



   // ✅ import cors

const app = express();
const PORT = process.env.PORT || 3000;
connectdb();

// ✅ Middleware FIRST
app.use(cors());                                  // ✅ enable cors
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/', async (req, res) => {
  console.log(req.body);
try {
const id=req.body.chatId;
const messages=req.body.message;
const NewMessage={chatId:id,
  message:messages,
  sender:"user",
}
await Message.create(NewMessage);



const result = await main(req.body.message);
const Airesponse={
  chatId:req.body.chatId,
  sender:"ai",
  message:result
}
await Message.create(Airesponse)

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


app.get('/messages/:chatId', async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    return res.status(200).json(messages);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log("Server is On", PORT);
});