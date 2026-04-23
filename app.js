import Groq from "groq-sdk";
import dotenv from "dotenv";

import { tavily } from "@tavily/core";
dotenv.config();

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
   messages:Messages,
    
    
model: "llama-3.3-70b-versatile",
    // Sample request body with tool definitions and messages

 tools: [
  {
    type: "function",
    function: {
      name: "topic_searching",
      description: "Search latest information from web",
      parameters: {
        type: "object",
        properties: {
          querey: {
            type: "string"
          }
        },
        required: ["querey"]
      }
    }
  }
]
  

 
  });
 
}
async function  askquestion(userPrompt){
 
    
      Messages.push({ role: "user", content: userPrompt });
   const response = await getGroqChatCompletion();
  
  const message = response.choices[0].message;
  


   
    if (message.tool_calls) {
       Messages.push(message)
for(const toolCall of message.tool_calls){

   const args = JSON.parse(toolCall.function.arguments);

    const result =await topic_searching(args.querey);
    Messages.push({
      role:"tool",
      tool_call_id: toolCall.id,   
      content:result.join("\n")
    })
}

   
const finalResponse = await getGroqChatCompletion();
const finalMessage = finalResponse.choices[0].message;
console.log("AI:", finalMessage.content);
Messages.push(finalMessage);
return finalMessage.content;
   
  } else {
    console.log("AI:", message.content);
    Messages.push(message);
    return message.content;
  }
   

  
 

  
}






const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
let Messages=  [
   {
        role:"system",
        content:"You are an assistant who answer questions"
      },
      
     
    ]
async function topic_searching(querey){
 console.log("ai")
 
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const response = await tvly.search(querey);
const final=response.results.map(result=>result.content);

return final;

}

export async function main(userPrompt) {
 
 const result= await askquestion(userPrompt);
 return result;
}


