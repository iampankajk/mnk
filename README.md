# RuleBuilder Project

## Overview

The **RuleBuilder** project is a React-based application that provides a rule-building interface. It includes modular components for defining and managing rules, UI elements, and utility functions.

## Tech Stack

- **React** (with TypeScript)
- **Vite** (for fast development)
- **Tailwind CSS** (for styling)
- **PostCSS** (for CSS processing)

## Project Structure

```
/src
  ├── assets/                 # Static assets (images, icons, etc.)
  ├── components/             # Main application components
  │   ├── RuleBuilder/        # Core rule-building components
  │   │   ├── RuleBuilder.tsx   # Main rule builder component
  │   │   ├── RuleItem.tsx      # Represents individual rule items
  │   │   ├── RuleSummary.tsx   # Displays a summary of built rules
  │   ├── ui/                 # UI components (buttons, inputs, dialogs, etc.)
  │   ├──Header.tsx           # Header UI of app
  ├── lib/                    # Utility functions
  │   ├── utils.ts             # Common helper functions
  ├── types/                  # TypeScript types
  │   ├── rules.ts             # Type definitions for rules
  ├── App.tsx                  # Main application entry point
  ├── index.tsx                # Renders the React app
  ├── index.css                # Global styles

Configuration files:
  ├── tailwind.config.ts       # Tailwind CSS configuration
  ├── tsconfig.json            # TypeScript configuration
  ├── vite.config.ts           # Vite configuration
  ├── package.json             # Dependencies and scripts
  ├── postcss.config.mjs       # PostCSS configuration
  ├── components.json          # Component metadata
  ├── .gitignore               # Ignored files
  ├── README.md                # Project documentation
```

## Installation

### Prerequisites

Ensure you have **Node.js (v20.18.0)** installed.

### Steps

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open `http://localhost:5173/` (or as specified in the terminal) to view the project.

## Usage

- The main component is `RuleBuilder.tsx`, which handles rule creation.
- The UI folder contains reusable UI components.
- The `types` folder defines TypeScript types for the rule system.
- The project follows a modular component structure for scalability.

## Contributing

1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request.

---

Happy Coding! 🚀
