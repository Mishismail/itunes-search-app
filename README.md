# iTunes Search App

This is a simple iTunes search app that allows users to search for media content (e.g., music, movies, podcasts) and add their favorite items to a list of favorites.

## How to Use the Search App

1. Enter your search query in the search input field.
2. Select the media type you want to search for from the dropdown list.
3. Click the "Search" button.
4. View the search results, and click the "Add to Favorites" button to add items to your favorites list.
5. Switch to the "Favorites" tab to view and manage your favorite items.

## Installation

To run this app locally, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Mishismail/itunes-search-app.git

2. Navigate to the project directory:

   cd itunes-search-app

3. Install the required dependencies for both the server and the client:

   npm install

4. Start the app:

   npm start

5. Open your web browser and access the app at http://localhost:3000.


# Testing the App

# Prerequisites for Testing:
  Node.js and npm installed on your local machine.

# Frontend Testing with Jest:

1. Install Jest (if not already installed):
   
   ```bash
   npm install --save-dev jest

2. Run Frontend Tests:

   Jest will automatically detect and run the test files with names like App.test.js and Favourites.test.js.

   ```bash
   npm test

3. Review Frontend Test Results:

   Jest will display the test results in the terminal, showing the number of tests run, tests passed, and any test failures. Carefully review the output and address any failed tests by making code adjustments.


# Backend Testing with Mocha:

1. Install Mocha and Chai (if not already installed):
   
   ```bash
   npm install --save-dev mocha
   npm install --save-dev chai

2. Run Backend Tests:
   
   Create a test script for your backend tests, typically in a separate directory (e.g., tests/) within your backend project. This command tells Mocha to run the tests defined in server.test.js.
   
   Then, add the following command to your package.json scripts:
   
   ```bash
   "scripts": {
   "test": "mocha tests/server.test.js"
   }

3. Run Backend Tests:

   To run your backend tests with Mocha, use the following command in your backend project's root directory:
   
   ```bash
   npm test

4. Review Backend Test Results:

   Mocha will display the results in the terminal, showing the number of tests run, tests passed, and any test failures. Carefully review the output and address any failed tests by making code adjustments.


# Security Measures
This app incorporates several security measures to ensure the safety of user data:

Helmet Middleware: The app uses the Helmet middleware to set various security-related HTTP headers, helping to protect against common web vulnerabilities.

CORS: Cross-Origin Resource Sharing (CORS) is configured to control which domains are allowed to make requests to the server, reducing the risk of unauthorized access.

Favorites Management: When adding items to the favorites list, the app checks for duplicate entries to prevent redundancy.

API Key Handling: The app does not require API keys since it uses a publicly accessible iTunes Search API. If you intend to use other APIs, make sure to follow best practices for API key management.

Deployed App
You can access the deployed app here: https://my-itunes-search-app-f22c878270f1.herokuapp.com/

Feel free to explore and enjoy using the iTunes Search App!