# Gemini-5 Telescope Control System

## Overview
Gemini-5 is a telescope control system that enables astronomers to create, submit, and validate science plans for astronomical observations.

## Prerequisites
- Java 17
- Node.js
- npm
- H2 Database

## Project Structure
```
Gemini5/
├── frontend/          # React frontend application
└── backend/           # Spring Boot backend application
    └── GeminiProject/
```

## Installation & Setup

### Frontend Setup (http://localhost:5173/)
1. Navigate to frontend directory:
   ```bash
   cd Gemini5/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Backend Setup (http://localhost:8080/api/)
1. Configure database paths:
   - Update in `Gemini5/backend/GeminiProject/src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:h2:file:YOUR_PATH/gemini;DB_CLOSE_ON_EXIT=FALSE
     ```
   - Update in `Gemini5/backend/GeminiProject/src/main/java/com/example/demo/OCS.java`:
     ```java
     private static String connectdb = "jdbc:h2:file:YOUR_PATH/ocs";
     ```

2. Run the application:
   - Navigate to `Gemini5/backend/GeminiProject/src/main/java/com/example/demo/DemoApplication.java`
   - Run the main method

## Features
- Science Plan Management
- Science Plan Creation
- Science Plan Submission
- Science Plan Validation
- Data Processing Configuration

## Configuration Limits
Image Processing Parameters:
- Contrast: 0.0 - 5.0
- Exposure: 0.0 - 50.0
- Highlights: 0.0 - 50.0
- Shadows: 0.0 - 50.0
- Whites: 0.0 - 50.0
- Blacks: 0.0 - 50.0
- Brightness: 0.0 - 50.0
- Saturation: 0.0 - 50.0
- Luminance: 0.0 - 50.0
- Hue: 0.0 - 50.0

## Contributors
- 6588051 Benjaphol Kositanon
- 6588075 Sorawit Piriyapanyaporn
- 6588152 Jinnipa Leepong
- 6588164 Thonthan Arunyawas
- 6588178 Nichakul Kongnual
- 6588187 Punyaporn Putthajaksri

## Course Information
ITCS431 Software Design and Development (2024)