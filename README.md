# Ishub: International Student Hub

Ishub is an AI-powered web application designed to simplify the complex process of applying to universities abroad for international students. It provides a seamless, guided experience from discovering the right institutions to generating a personalized, step-by-step application plan and offering assistance on each task.

## ✨ Key Features

- **Personalized Profile Creation**: Users start by creating a detailed profile, including their academic background, country of origin, budget, and study preferences.
- **AI-Powered University Recommendations**: Leverages the Google Gemini API with Google Search grounding to provide a curated list of 5-10 universities that perfectly match the user's profile and aspirations.
- **Interactive University Selection**: Users can review the recommendations, visit university websites directly from the app, and select their preferred institutions.
- **Detailed Application Plan Generation**: Creates a comprehensive, staged to-do list for the entire application journey—from document preparation and university applications to post-acceptance and visa procedures.
- **AI-Powered Task Assistance**: Get detailed, AI-generated guidance for any task on your application plan. Simply click "Get Help" on a to-do item to receive a step-by-step guide tailored to your profile.
- **Downloadable PDF Plan**: Users can download their personalized application plan as a professionally formatted PDF to keep track of their progress offline.
- **Text-to-Speech Accessibility**: An integrated "Read Aloud" feature uses Gemini's TTS capabilities to read the entire application plan, enhancing accessibility.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI & Services**:
  - **Google Gemini API**:
    - `gemini-2.5-flash`: For fast, search-grounded university recommendations.
    - `gemini-2.5-pro`: For generating the complex, structured application plan and providing detailed task assistance.
    - `gemini-2.5-flash-preview-tts`: For the text-to-speech functionality.
- **Libraries**:
  - `jspdf` & `html2canvas`: For client-side PDF generation.

## 📂 Project Structure

The project is organized into a clean and maintainable structure:

```
.
├── index.html            # Main HTML entry point
├── index.tsx             # React application root
├── App.tsx               # Main component, handles state and workflow
├── types.ts              # Centralized TypeScript type definitions
├── services/
│   └── geminiService.ts  # All logic for interacting with the Google Gemini API
└── components/
    ├── UserProfileForm.tsx   # Step 1: User data entry form
    ├── UniversityList.tsx    # Step 2: Displays recommended universities for selection
    ├── ApplicationPlan.tsx   # Step 3: Renders the final application plan
    ├── TaskAssistance.tsx    # Step 4: Shows AI-powered help for a specific task
    ├── Header.tsx            # Application header
    ├── Footer.tsx            # Application footer
    ├── LoadingSpinner.tsx    # Loading indicator component
    └── icons.tsx             # SVG icon components
```

## ⚙️ How It Works

The application follows a simple four-step workflow:

1.  **Build Your Profile**: The user fills in the `UserProfileForm` with their personal and academic details.
2.  **Get Recommendations**: The profile data is sent to the `getUniversityRecommendations` function. The Gemini model, enhanced with Google Search, analyzes the profile to find the most suitable universities and returns a list.
3.  **Generate Your Plan**: The user selects one or more universities from the list. This selection, along with the user's profile, is sent to the `getApplicationPlan` function. Gemini then generates a detailed, structured JSON object representing the step-by-step application plan.
4.  **Get Task Assistance**: After the plan is generated, the user can click "Get Help" on any task. The `getTaskAssistance` function sends the task details and user profile to Gemini to generate a detailed, actionable guide for completing that specific step.

## 🏁 Getting Started

To run this project locally, follow these steps:

1.  **API Key**: Ensure you have a valid Google Gemini API key. This key must be available as an environment variable named `API_KEY`.

2.  **Serve the Application**: Since this is a client-side application, you need a local web server to serve the files. You can use any simple server, for example, the `serve` package from npm:
    ```bash
    # Install serve globally (if you haven't already)
    npm install -g serve

    # Run the server from the project's root directory
    serve .
    ```

3.  **Open in Browser**: Navigate to the local URL provided by the server (e.g., `http://localhost:3000`) in your web browser to start using the application.