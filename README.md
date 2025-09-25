# City Samadhan Chatbot

A modern, dark-themed chatbot interface designed to assist users with civic issue reporting and tracking. The chatbot provides information about various municipal services, issue reporting procedures, and department-specific guidance.

## Features

- 🌙 Modern dark-themed UI
- 💬 Interactive chat interface
- 🔄 Real-time responses
- 📱 Responsive design
- 🗣️ Multi-language support (English and Hindi)
- 🏢 Detailed department-specific information
- 📋 Comprehensive issue tracking guidance

## Departments Covered

The chatbot provides detailed information about the following municipal departments:

1. **Waste Management**
   - Waste segregation
   - Infrastructure issues
   - Environmental concerns
   - E-waste management

2. **Roads and Potholes**
   - Road quality issues
   - Construction problems
   - Traffic-related concerns
   - Safety hazards

3. **Streetlights**
   - Lighting maintenance
   - Coverage issues
   - Safety concerns
   - Equipment problems

4. **Water Supply**
   - Distribution issues
   - Quality concerns
   - Pipeline problems
   - Infrastructure maintenance

5. **Sewage and Drainage**
   - Drainage system issues
   - Infrastructure maintenance
   - Environmental concerns
   - Flood prevention

6. **Public Parks**
   - Maintenance issues
   - Safety concerns
   - Facility management
   - Recreational spaces

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (version 14.0.0 or higher)
- npm (version 6.0.0 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/himanshi-0070/city-samadhan-chatbot.git
   cd city-samadhan-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
chatbot/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ChatInterface.tsx
│   ├── data/
│   │   └── responses.ts
│   ├── theme/
│   │   └── darkTheme.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Usage Examples

The chatbot can answer questions about:

1. **General Usage**
   ```
   "How do I use this app?"
   "How can I report an issue?"
   ```

2. **Department Specific**
   ```
   "What issues does waste management handle?"
   "What kinds of road problems can I report?"
   ```

3. **Issue Tracking**
   ```
   "How can I track my complaint?"
   "Where can I see my reported issues?"
   ```

4. **Location Based**
   ```
   "How do I find nearby issues?"
   "How does voting work?"
   ```

## Tech Stack

- React
- TypeScript
- Material-UI (MUI)
- Emotion (for styled components)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please email support@citysamadhan.com or raise an issue in the repository.

## Acknowledgments

- Material-UI for the component library
- React team for the awesome framework
- All contributors who participate in this project
