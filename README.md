# Express Auth API

This project is a Node.js application built with Express.js that provides authentication functionalities including signup, login, and password reset features. It uses MySQL as the database and implements email sending capabilities via SMTP.

## Features

- User signup with fields: firstName, lastName, phoneNumber, and password.
- User login functionality.
- Password reset functionality.
- Password encryption using bcrypt.
- Email notifications for signup and password reset.

## Technologies Used

- Node.js
- Express.js
- MySQL
- bcrypt
- Nodemailer (for SMTP)
- dotenv (for environment variables)

## Project Structure

```
express-auth-api
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── validators
│   └── app.js
├── .env.example
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd express-auth-api
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.

## Usage

To start the application, run:
```
npm start
```

The server will start on the specified port, and you can access the API endpoints as defined in the routes.

## License

This project is licensed under the MIT License.