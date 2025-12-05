import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeOMR = async (
  studentSheet: File,
  answerKey: File
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const studentImagePart = await fileToGenerativePart(studentSheet);
  const keyImagePart = await fileToGenerativePart(answerKey);

  const prompt = `
    You are an expert Optical Mark Recognition (OMR) system. 
    I have provided two images:
    1. The first image is a Student's OMR Sheet (the one to be graded).
    2. The second image is the Correct Answer Key (or a filled OMR sheet representing the key).

    Your task:
    1. Analyze the Student's OMR Sheet to determine the marked answer for each question.
    2. Analyze the Answer Key to determine the correct answer for each question.
    3. Compare the student's answers against the correct answers.
    4. Calculate the score using the following strict rules:
       - Correct Answer: +1 mark
       - Wrong Answer: -0.25 marks
       - Unattempted: 0 marks
    
    Return the result strictly as a JSON object adhering to the schema.
    If a student marks multiple options for a single question, treat it as a Wrong Answer unless the instructions on the sheet say otherwise (default to Wrong/Invalid).
    If a question is not visible or clear, skip it but try to process as many as possible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          studentImagePart,
          keyImagePart,
          { text: prompt }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalQuestions: { type: Type.NUMBER, description: "Total number of questions identified" },
            attempted: { type: Type.NUMBER, description: "Total questions attempted by student" },
            correct: { type: Type.NUMBER, description: "Count of correct answers" },
            wrong: { type: Type.NUMBER, description: "Count of wrong answers" },
            unattempted: { type: Type.NUMBER, description: "Count of unattempted questions" },
            totalScore: { type: Type.NUMBER, description: "Final calculated score" },
            details: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionNumber: { type: Type.NUMBER },
                  studentAnswer: { type: Type.STRING, description: "The option marked by student (e.g. 'A', 'B'). Empty if unattempted." },
                  correctAnswer: { type: Type.STRING, description: "The correct option from answer key" },
                  status: { type: Type.STRING, enum: ["CORRECT", "WRONG", "UNATTEMPTED"] }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Error analyzing OMR:", error);
    throw error;
  }
};