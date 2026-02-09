# Project Overview

The `vpw-data` project is a Node.js Express API designed to serve as a data service for the Virtual Pinball Workshop (VPW) Discord Bot. Its primary purpose is to manage project data, facilitating version tracking and project locking mechanisms for the bot. The API interacts with a MongoDB database to store and retrieve project information.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **dotenv**: For loading environment variables.
- **Pino**: Fast, low-overhead logger, with `pino-http` for HTTP request logging.

## Architecture

The application follows a standard Node.js API architecture:

- **Entry Point**: `src/index.js` initializes the Express application, sets up middleware, and manages the database connection lifecycle.
- **Routing**: API routes are defined in `src/routers/api.v1.js` under the `/api/v1` base path, directly interacting with the MongoDB database instance.
- **Database Connection Management**: `src/utils/mongo.js` provides functions (`initDb`, `getDb`, `closeDb`) for robust MongoDB connection management, including exponential backoff for retries.
- **Logging**: Utilizes Pino for efficient logging of application events and HTTP requests.

## Building and Running

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB Atlas account and connection string (or a local MongoDB instance)
- Environment variables (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `PORT`) configured.

### Local Development

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**: Create a `.env` file in the root directory with the following variables:

   ```bash
   PORT=3080
   DB_NAME=<your_db_name>
   DB_USER=<your_db_user>
   DB_PASSWORD=<your_db_password>
   ```

3. **Run the Application**:

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:3080` (or your specified PORT).

### Docker

A `Dockerfile` is present, indicating the application can be containerized.

1. **Build the Docker image**:

   ```bash
   docker build -t vpw-data .
   ```

2. **Run the Docker container**:

   ```bash
   docker run -p 3080:3080 --env-file ./.env vpw-data
   ```

   (Ensure your `.env` file is properly configured)

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

- **`GET /api/v1/`**
  - **Description**: Checks if the service is running.
  - **Response**: "VPW Data Service is up and running..."

- **`GET /api/v1/projects`**
  - **Description**: Retrieves the latest project actions for all projects, grouped by `channelName`.
  - **Parameters**: projectName (query parameter) regex matches against `channelName`
  - **Response**: An array of the latest project documents for each unique project.

- **`POST /api/v1/projects`**
  - **Description**: Inserts a new project action (check-in/check-out).
  - **Request Body**: JSON object containing project details, including `actionType` (`"checkin"` or `"checkout"`), `userId`, `link`, `version`, and `comments` (for check-in).
  - **Response**: A string indicating the action performed.

- **`GET /api/v1/projects/:channelId`**
  - **Description**: Retrieves all project actions for a specific Discord channel.
  - **Parameters**: `channelId` (URL parameter)
  - **Response**: An array of project documents.

- **`DELETE /api/v1/projects/:channelId`**
  - **Description**: Reverts (deletes) the last project action for a specific Discord channel and `actionId`.
  - **Parameters**: `channelId` (URL parameter), `userId` (query parameter), `actionId` (query parameter - corresponding to `_id` of the action to be deleted).
  - **Response**: A string confirming the reversion.

## Development Conventions

- **ES Modules**: The project uses ES module syntax (`import`/`export`).
- **Logging**: Pino is used for structured logging.
- **Database Initialization**: The application now includes a robust database initialization with exponential backoff for connection retries, handled by `initDb` in `src/utils/mongo.js`.
- **Error Handling**: Database connection errors are handled with retries during initialization. Graceful shutdown procedures are implemented for `SIGTERM` and `SIGINT` signals.
- **Configuration**: Environment variables are managed via `dotenv`.

## Testing

No explicit testing framework or scripts were found in `package.json`.
