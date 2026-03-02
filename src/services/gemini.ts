import { GoogleGenAI, Type } from "@google/genai";
import { TaskStatus, Task, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const taskSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    status: { type: Type.STRING, description: "Initial status should be TODO" },
    startDate: { type: Type.STRING, description: "ISO 8601 date string for when this task should start" },
    endDate: { type: Type.STRING, description: "ISO 8601 date string for when this task should end" },
    dueDate: { type: Type.STRING, description: "ISO 8601 date string representing the final deadline" },
    details: { 
      type: Type.STRING, 
      description: "A comprehensive guide for the task including description, step-by-step instructions, and links to courses or reference documents." 
    },
    subtasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          status: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          dueDate: { type: Type.STRING },
          details: { type: Type.STRING },
          subtasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                status: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                dueDate: { type: Type.STRING },
                details: { type: Type.STRING }
              },
              required: ["id", "title", "status", "startDate", "endDate", "dueDate", "details"]
            }
          }
        },
        required: ["id", "title", "status", "startDate", "endDate", "dueDate", "details"]
      }
    }
  },
  required: ["id", "title", "status", "startDate", "endDate", "dueDate", "details"]
};

export async function generatePlan(idea: string, startDate: string, endDate: string, language: Language = 'en'): Promise<Task[]> {
  const model = "gemini-3-flash-preview";
  
  const languageInstruction = language === 'vi' 
    ? "IMPORTANT: All task titles and details MUST be written in Vietnamese." 
    : "IMPORTANT: All task titles and details MUST be written in English.";

  const prompt = `Create a detailed project plan for the following idea: "${idea}". 
  The project starts on: ${startDate} and ends on: ${endDate}.
  
  ${languageInstruction}

  Break down the work into a hierarchical list of tasks.
  Maximum depth of hierarchy is 3 levels.
  Each task must have a unique ID and a clear title.
  All tasks should start with status "TODO".
  
  For each task, provide a "details" field that is a comprehensive guide. It MUST include:
  1. A clear description of the goal.
  2. Detailed step-by-step execution steps.
  3. Specific links to online courses (e.g., Coursera, Udemy, YouTube), documentation, or tools that are directly relevant to completing this specific task.
  
  Format the "details" using Markdown for better readability (use bold, lists, and links).
  
  IMPORTANT: Distribute the dates logically. Subtasks must be scheduled within the timeframe of their parent task.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: taskSchema
      }
    }
  });

  try {
    const tasks = JSON.parse(response.text || "[]");
    return tasks;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}
