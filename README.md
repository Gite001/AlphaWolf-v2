# AlphaWolf - Your AI-Powered Marketing Wolf

Welcome to AlphaWolf, your all-in-one marketing intelligence suite. This application leverages Google's Gemini AI via Genkit to provide deep analytics, strategic insights, and creative generation.

For a full breakdown of features and philosophy, please see the **"Guide"** section inside the running application.

---

## Getting Started

To run the application on your local machine, follow these steps from the root directory of your project in the Firebase Studio terminal.

**Important:** A Next.js application is a full project, not a simple script. You cannot start it by running a single file (e.g., with an option like "Run active file"). You must use the `npm` commands below to start the development server that handles compiling everything.

1.  **Install dependencies (one-time):**
    The `npm install` command reads the `package.json` file and installs all necessary libraries. You only need to do this step once, or if you add new libraries to the project.
    ```bash
    npm install
    ```

2.  **Run the development server (each time):**
    This command starts the application. You will need to run this every time you want to work on the app. The terminal must remain open while you use it.
    ```bash
    npm run dev
    ```
    The application will then be available at `http://localhost:9003`. Hold `Ctrl` (or `Cmd` on Mac) and click the link to open it in your browser.

---

## Tech Stack

-   **Frontend:** [Next.js](https://nextjs.org/) with React (App Router)
-   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit), Google's official framework.
-   **AI Model:** Google [Gemini](https://deepmind.google.com/technologies/gemini/)
-   **Visualization:** [Recharts](https://recharts.org/)
