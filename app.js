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
          query: {
            type: "string"
          }
        },
        required: ["query"]
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

    const result =await topic_searching(args.query);
    Messages.push({
      role:"tool",
      tool_call_id: toolCall.id,   
      content:result
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
        content:`
        Today's date is: ${new Date().toDateString()}
        You are an assistant who answer questions
        If you know the answer directly then answer it
        If u require real time data then You can use topic_searching
        method to get real time data
        Examples:
        What is the capital of france?
        paris(answer directly)
        what is the weather of paris?
        (use toolcall)`
        
        
        
      },
      
     
    ]
async function topic_searching(query){
 console.log("ai")
 
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const response = await tvly.search(query);
const final=response.results.map(result=>result.content);
return final.join("\n");

}

export async function main(userPrompt) {
 
 const result= await askquestion(userPrompt);
 return result;
}


