# The Macky Merch API
This is a RESTful API for managing inventory of _Macky Merch_, LSCS' official merchandise.

## Tech Stack
- **Language**: Typescript
- **Environment**: Node.js
- **Server**: Express
- **Database**: MongoDB
- **ODM**: Mongoose
- **Testing**: Vite, Supertest

## Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB running locally on default port `27017` or a MongoDB Atlas URI

### 1. Clone the repository and navigate into the project directory:
```bash
gh repo clone givemeanameidk/macky-merch-api
cd macky-merch-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory and configure your port and connection string:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/macky-merch-api
```

### 4. Run in development mode
Start the development server with automatic reloading using ```tsx```:
```bash
npm run dev
```

### 5. Run automated tests
Unit and integration tests are powered by Vitest and Supertest. The test suite mocks database interactions to verify HTTP status codes, payload structures, and validation errors.

Execute the test suite with:
```bash
npm run test
```

## Architectural Explanation
I chose this folder structure following the standard model-view-controller (MVC) architecture. MongoDB was chosen as for the database mainly because of the challenge's low complexity (only one model schema), and secondly due to familiarity.

## Challenges Faced
My main hurdle here was the many knowledge checks involved due to not having more experience in working with backend technologies. Many instances occured where I wanted to write code to do a certain task, but I simply did not know the syntax or function call required to do so.

I overcame this problem through extensive research using Google, reading through StackOverflow and developer documentation, and some assistance from Generative AI ([Google Gemini](https://gemini.google.com/)).