Below is an updated and refined README incorporating your requested changes:

---

# SOCIALEYES – Social Media Dashboard Application

An interactive platform that empowers content creators to monitor, analyze, and optimize their YouTube video performance through a dynamic and user-friendly dashboard.

---

## Features

- **Comprehensive Dashboard**: Visualize key metrics such as views, likes, comments, and engagement rates.
- **Performance Analysis**: Compare video performance across different timeframes to identify trends.
- **Scheduled Reports**: Automate periodic reporting to stay updated without manual checks.
- **Dark Mode**: Switch between light and dark themes for comfortable viewing.
- **Multilingual Support**: Access the dashboard in multiple languages to cater to a diverse user base.
- **Multi-Device Login**: Seamless login across various devices.
- **YouTube Data Integration**: Sync real-time analytics by leveraging the YouTube Data API and YouTube Analytics API from Google Cloud.
- **Agile Project Management**: User stories and sprints are tracked using Jira, ensuring an organized and responsive development process.

---

## Screenshots


### 1. Dashboard
<img src="src/assets/1.png" alt="Scheduled Reports" width="100%">

### 2.Login/Signup 
<div style="display: flex; gap: 10px;">
  <img src="src/assets/2.png" alt="Select YouTube Platform" width="48%">
  <img src="src/assets/3.png" alt="Engagement Metrics" width="48%">
</div>

<img src="src/assets/4.png" alt="Scheduled Reports" width="100%">
### 3. Enhanced Flexibilities
<div style="display: flex; gap: 10px;">
  <img src="src/assets/5.png" alt="Select YouTube Platform" width="48%">
  <img src="src/assets/6.png" alt="Engagement Metrics" width="48%">
</div>

*Note: Replace the above image paths with actual screenshots from your project.*

---

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **APIs**: YouTube Data API, YouTube Analytics API (via Google Cloud)
- **Authentication**: OAuth 2.0 (Google/YouTube)
- **Data Visualization**: Chart.js, D3.js
- **Testing**: Jest, React Testing Library
- **CI/CD**: Jenkins
- **Project Management**: Jira for tracking user stories and sprints
- **Version Control**: Git, GitHub

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Pavithraa77/SOCIALEYES.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd SOCIALEYES
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

*Ensure you have Node.js and npm installed on your machine.*

---

## Deployment

To deploy the application, consider using platforms like Vercel, Netlify, or Heroku:

1. **Build the application**:
   ```bash
   npm run build
   ```
2. **Deploy the contents of the `dist` folder to your chosen platform.**

*Refer to the respective platform's documentation for detailed deployment instructions.*

---

## Running Tests

The project utilizes Jest for testing:

- **Run all tests**:
  ```bash
  npm test
  ```
- **Run tests in watch mode**:
  ```bash
  npm test -- --watch
  ```

