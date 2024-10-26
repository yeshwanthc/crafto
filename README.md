# Quote Creation App

This is a Next.js application that allows users to create and view quotes with optional image uploads.

## Features

1. User Authentication
   - Login with username and OTP
   - Token-based authentication for protected routes

2. Quote List Page
   - Displays a paginated list of quotes
   - Each quote shows:
     - Image (if available)
     - Quote text overlaid on the image
     - Username of the quote creator
     - Creation timestamp
   - Floating action button to create new quotes
   - Infinite scroll pagination

3. Quote Creation Page
   - Text input for the quote
   - Image upload functionality
   - Preview of the uploaded image
   - Submit button to create the quote

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yeshwanthc/crafto.git
   ```

2. Navigate to the project directory:
   ```
   cd crafto
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory and add any necessary environment variables.

## Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

The application uses the following API endpoints:

1. Login:
   ```
   POST https://assignment.stage.crafto.app/login
   ```

2. Upload Image:
   ```
   POST https://crafto.app/crafto/v1.0/media/assignment/upload
   ```

3. Create Quote:
   ```
   POST https://assignment.stage.crafto.app/postQuote
   ```

4. Get Quotes:
   ```
   GET https://assignment.stage.crafto.app/getQuotes
   ```



