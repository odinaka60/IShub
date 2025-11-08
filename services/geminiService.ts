import { GoogleGenAI, Modality, Type } from "@google/genai";
import { UserProfile, University, ApplicationPlanData, ApplicationTask } from '../types';

// This is a placeholder for the API key.
// In a real-world scenario, this should be handled securely.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // A simple check, though in a real app you might have more robust handling.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const cleanJsonString = (str: string): string => {
  const cleaned = str.replace(/```json\n?|```/g, '').trim();
  return cleaned;
};

export const getUniversityRecommendations = async (profile: UserProfile): Promise<University[]> => {
  const prompt = `
    Based on the following student profile, please recommend 5-10 suitable universities.
    Profile:
    - Full Name: ${profile.fullName}
    - Country of Origin: ${profile.countryOfOrigin}
    - Country of Residence: ${profile.countryOfResidence}
    - Intended Study Countries: ${profile.studyCountries.join(', ')}
    - Preferred Course/Major: ${profile.major}
    - Current Academic Course: ${profile.currentCourse}
    - Academic Level: ${profile.academicLevel}
    - Target Annual Tuition Budget: ${profile.currency} ${profile.budget}
    - Scholarship Interest: ${profile.scholarshipInterest ? 'Yes' : 'No'}

    Please consider the following criteria for your recommendations:
    1. The university must offer the preferred course/major at the correct academic level.
    2. The estimated annual tuition and living costs should align with the student's budget. The provided budget is in ${profile.currency}, please perform currency conversion if necessary to assess financial fit.
    3. Factor in the general visa complexity and feasibility for a student from ${profile.countryOfOrigin} studying in the recommended country.
    4. Prioritize the list with the most suitable option first.
    5. Include the official university website URL in the 'websiteUrl' field.
    6. IMPORTANT: The 'estimatedAnnualCost' field in your JSON response must be in USD, regardless of the input currency.

    Return your response as a valid JSON array of objects. Do not include any text, explanation or markdown formatting outside of the JSON array. Each object must have the following format:
    {
      "id": number,
      "name": "University Name",
      "location": "City, Country",
      "estimatedAnnualCost": number,
      "program": "Specific program name related to the major",
      "websiteUrl": "https://www.university.edu"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const jsonString = cleanJsonString(response.text);
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse university recommendations:", jsonString, error);
    throw new Error("The AI returned an invalid format for university recommendations.");
  }
};

export const getApplicationPlan = async (profile: UserProfile, universities: University[]): Promise<ApplicationPlanData> => {
  const selectedUniversitiesString = universities.map(u => `- ${u.name}, located in ${u.location}, for the program: ${u.program}`).join('\n');
  
  const prompt = `
    A student with the following profile has selected the universities listed below. Please generate a detailed, staged to-do list for their application process.

    Student Profile:
    - Full Name: ${profile.fullName}
    - Country of Origin: ${profile.countryOfOrigin}
    - Academic Level: ${profile.academicLevel}
    - Current Academic Course: ${profile.currentCourse}
    - Preferred Course/Major: ${profile.major}

    Selected Universities:
    ${selectedUniversitiesString}

    The plan should cover everything from initial document gathering for the university applications to the final steps of the visa application process. Organize the plan into logical stages (e.g., "Stage 1: Pre-Application & Document Preparation", "Stage 2: University Applications", "Stage 3: Post-Acceptance & Pre-Departure", "Stage 4: Visa Application").

    For each stage, provide a list of specific, actionable tasks with brief explanations.

    Return your response as a single valid JSON object. Do not include any text, explanation or markdown formatting outside of the JSON object. The object should have the following format:
    {
      "plan": [
        {
          "stageTitle": "Stage 1: Pre-Application & Document Preparation",
          "tasks": [
            {
              "taskName": "Task Name",
              "description": "A brief description of the task."
            }
          ]
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stageTitle: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      taskName: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ["taskName", "description"],
                  }
                }
              },
              required: ["stageTitle", "tasks"],
            }
          }
        },
        required: ["plan"],
      },
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  const jsonString = cleanJsonString(response.text);
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse application plan:", jsonString, error);
    throw new Error("The AI returned an invalid format for the application plan.");
  }
};

export const getTaskAssistance = async (profile: UserProfile, universities: University[], task: ApplicationTask): Promise<string> => {
    const selectedUniversitiesString = universities.map(u => `- ${u.name} in ${u.location}`).join('\n');

    const prompt = `
        A student needs help with a specific task in their university application process. Please provide a detailed, helpful guide for them to complete this task.

        Student Profile:
        - From: ${profile.countryOfOrigin}
        - Applying for: ${profile.academicLevel} level in ${profile.major}
        
        Applying to:
        ${selectedUniversitiesString}

        The specific task they need help with is:
        - Task Name: "${task.taskName}"
        - Task Description: "${task.description}"

        Please provide a comprehensive guide for this task. Your response should include:
        1. A clear explanation of what the task involves.
        2. Actionable, step-by-step instructions.
        3. Best practices or tips for success, tailored to the student's profile (e.g., specific advice for an international student from ${profile.countryOfOrigin}).
        4. If applicable, suggest what kind of information or documents they might need to gather.
        5. Do NOT include any markdown formatting like "##" or "**". Just use plain text with newlines for paragraph breaks.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
    });
    
    return response.text;
};


// Audio Decoding utilities from documentation
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // FIX: Corrected typo from Int116Array to Int16Array
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const getTextToSpeechAudio = async (text: string): Promise<void> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (base64Audio) {
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);

      const audioBuffer = await decodeAudioData(
          decode(base64Audio),
          outputAudioContext,
          24000,
          1,
      );
      const source = outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputNode);
      source.start();
  } else {
    throw new Error("No audio data received from API.");
  }
};