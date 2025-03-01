# Project Summary

The project is an advanced photo editing application focusing on background removal. It allows users to upload images and seamlessly remove backgrounds, making it particularly useful for e-commerce, graphic design, and any scenario requiring quick photo edits. The user-friendly interface enhances productivity by allowing users to compare the original images with background-removed versions side by side, streamlining their workflow and improving the overall editing experience.

# Project Module Description

## Functional Modules

1. **Image Uploader**: Allows users to upload images for background removal.
2. **Image Processing**: Handles the background removal logic, processing uploaded images to extract subjects from backgrounds.
3. **Image Preview**: Displays both the original and processed images for easy comparison.
4. **Control Panel**: Provides options and controls for users to manipulate the editing process (e.g., adjusting settings, undoing actions).
5. **Language Selector**: Allows users to choose their preferred language for the interface.
6. **Auth Context**: Manages user authentication and session information.
7. **Quota Context**: Monitors user quotas for image processing tasks.

# Directory Tree

```bash
/data/chats/i245t/workspace
+-- README.md
+-- ai_tshirt_background_removal_class_diagram.mermaid
+-- ai_tshirt_background_removal_sequence_diagram.mermaid
+-- ai_tshirt_background_removal_system_design.md
+-- background_removal_feature_prd.md
+-- background_removal_website_class_diagram.mermaid
+-- background_removal_website_prd.md
+-- background_removal_website_sequence_diagram.mermaid
+-- background_removal_website_system_design.md
+-- eslint.config.js
+-- index.html
+-- package-lock.json
+-- package.json
+-- postcss.config.js
+-- react_template
|   +-- README.md
|   +-- eslint.config.js
|   +-- index.html
|   +-- package.json
|   +-- postcss.config.js
|   +-- src
|   |   +-- App.jsx
|   |   +-- components
|   |   |   +-- BackgroundRemover.jsx
|   |   |   +-- ControlPanel.jsx
|   |   |   +-- ImagePreview.jsx
|   |   |   +-- LanguageSelector.jsx
|   |   +-- hooks
|   |   |   +-- useBackgroundRemoval.js
|   |   +-- index.css
|   |   +-- main.jsx
|   |   +-- services
|   |   |   +-- ImageProcessor.js
|   |   +-- utils
|   |       +-- LanguageContext.jsx
|   |       +-- imageUtils.js
|   |       +-- translations
|   |           +-- en.js
|   |           +-- zh.js
|   +-- tailwind.config.js
|   +-- template_config.json
|   +-- test-import.js
|   +-- vite.config.js
+-- src
|   +-- App.jsx
|   +-- components
|   |   +-- AdModal.jsx
|   |   +-- AuthModal.jsx
|   |   +-- Footer.jsx
|   |   +-- ImagePreview.jsx
|   |   +-- ImageProcessing.jsx
|   |   +-- ImageUploader.jsx
|   |   +-- NavBar.jsx
|   |   +-- PaymentModal.jsx
|   +-- context
|   |   +-- AuthContext.jsx
|   |   +-- QuotaContext.jsx
|   +-- index.css
|   +-- main.jsx
|   +-- pages
|   |   +-- Dashboard.jsx
|   |   +-- Home.jsx
|   +-- services
|   |   +-- AdService.js
|   |   +-- AuthService.js
|   |   +-- ImageService.js
|   |   +-- PaymentService.js
|   |   +-- QuotaService.js
|   |   +-- StorageService.js
|   +-- utils
|       +-- api.js
+-- tailwind.config.js
+-- template_config.json
+-- uploads
|   +-- 截屏2025-03-01 12.56.19.png
|   +-- 截屏2025-03-01 13.42.16.png
|   +-- 截屏2025-03-01 13.47.21.png
|   +-- 截屏2025-03-01 18.05.08.png
|   +-- 截屏2025-03-01 18.05.12.png
+-- vite.config.js
```

# File Description Inventory

- `README.md`: Overview and guidelines for the project.
- `*.mermaid`: Diagrams illustrating class structures, sequences, and system designs.
- `index.html`: Main HTML structure of the application.
- `package.json`: Lists dependencies and scripts for the project.
- `src/`: Contains the source code for the application, including components, services, and context.
- `uploads/`: Holds uploaded image files for processing.
- `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`: Configuration files for styling and linting.

# Technology Stack

- **Frontend**: React, Vite, TailwindCSS
- **Languages**: Javascript
- **Tools**: ESLint for linting, component-based architecture for maintainability

# Usage

## Installation

1. Install dependencies by running the command to install package dependencies.

## Running the Project

1. Build the project using the appropriate build command.
2. Start the development server to test the application.

## Development Guidelines

- Modify `index.html` and `src/App.jsx` as needed.
- Create new folders or files in `src/` directory as necessary.
- Style components using TailwindCSS utility classes.
- Avoid modifying `src/main.jsx` and `src/index.css`.
- Only modify `vite.config.js` if absolutely necessary.


# INSTRUCTION
- Project Path:`/data/chats/i245t/workspace/react_template`
- You can search for the file path in the 'Directory Tree';
- After modifying the project files, if this project can be previewed, then you need to reinstall dependencies, restart service and preview;
