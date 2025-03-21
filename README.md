<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Promotion Tracker Backend

A NestJS backend application for managing employee promotions, appraisals, and bonuses.

## System Requirements

1. **Core Requirements**
   - Node.js >= 20.x
   - npm >= 9.x
   - PostgreSQL >= 16.x
   - NestJS CLI: `npm i -g @nestjs/cli`

2. **Development Tools**
   - Git
   - VS Code (recommended) with extensions:
     - ESLint
     - Prettier
     - TypeScript and JavaScript

3. **Database Tools**
   - PostgreSQL client (psql)
   - Database management tool (optional):
     - pgAdmin
     - DBeaver
     - DataGrip

## Installation Methods

### Method 1: Docker Setup (Recommended)

1. Install Docker and Docker Compose
   ```bash
   # For Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install docker.io docker-compose

   # For macOS (using Homebrew)
   brew install docker docker-compose
   ```

2. Clone the repository and start services:
   ```bash
   git clone <repository-url>
   cd promotionTracker-be
   docker-compose up -d
   ```

This will automatically:
- Start PostgreSQL database
- Set up the database with correct user and permissions
- Build and start the backend API
- Build and start the frontend application

### Method 2: Manual Setup

1. **Install Node.js and npm**
   ```bash
   # Using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20
   nvm use 20
   ```

2. **Install PostgreSQL**
   ```bash
   # For Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib

   # For macOS
   brew install postgresql
   brew services start postgresql
   ```

3. **Install NestJS CLI**
   ```bash
   npm install -g @nestjs/cli
   ```

4. **Setup Database**
   ```sql
   CREATE DATABASE promotion_tracker;
   CREATE USER promotion_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE promotion_tracker TO promotion_user;
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

6. **Install Dependencies & Start Server**
   ```bash
   npm install
   npm run start:dev
   ```

## Default Admin Setup

The system is preconfigured with an admin user:
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_HOST | PostgreSQL host | localhost |
| DATABASE_PORT | PostgreSQL port | 5432 |
| DATABASE_USER | Database username | promotion_user |
| DATABASE_PASSWORD | Database password | - |
| DATABASE_NAME | Database name | promotion_tracker |
| JWT_SECRET | Secret for JWT tokens | - |

## Running the Application

### Development Mode
```bash
npm run start:dev
```
The server will start on http://localhost:3000/api

### Production Mode
```bash
npm run build
npm run start:prod
```

## Database Management

### View Tables
```sql
\c promotion_tracker
\dt
```

### View Users Table
```sql
SELECT * FROM users;
```

### Default Users Setup
The system supports the following roles:
- USER: Regular employee
- HOD: Head of Department
- HR: Human Resources
- ADMIN: System Administrator
- CEO: Chief Executive Officer

To create an admin user:
```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{
  "email": "admin@example.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}'
```

To create a test user:
```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{
  "email": "test@example.com",
  "password": "test123",
  "firstName": "Test",
  "lastName": "User",
  "role": "USER"
}'
```

### Update User Password
To update a user's password:
```bash
curl -X PATCH http://localhost:3000/api/users/{userId}/set-password -H "Content-Type: application/json" -d '{
  "password": "new_password"
}'
```

## Role-Based Access Control

The system implements a hierarchical role-based access control system with the following roles:

### Available Roles
1. **USER** (Regular Employee)
   - Can view and create their own appraisals
   - Can view their bonus history
   - Default role for new users

2. **HOD** (Head of Department)
   - All USER permissions
   - Can manage appraisals for their department
   - Can view department performance metrics

3. **HR** (Human Resources)
   - All HOD permissions
   - Can manage bonuses
   - Can view all employee appraisals
   - Can manage employee data

4. **ADMIN** (System Administrator)
   - Full system access
   - Can manage users and roles
   - Can configure system settings
   - Can view all data and reports
   - Default admin credentials:
     - Email: admin@example.com
     - Password: admin123

5. **CEO**
   - Full system access
   - Can view company-wide metrics
   - Access to executive dashboard

### Creating Users with Different Roles

To create a new user with a specific role, use the following API endpoint:

```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "User",
  "lastName": "Name",
  "role": "ROLE_NAME",  // One of: USER, HOD, HR, ADMIN, CEO
  "department": "Department Name",  // Optional
  "position": "Job Position"        // Optional
}'
```

Example commands for different roles:

1. Create a regular user:
```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{
  "email": "employee@example.com",
  "password": "user123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "department": "Engineering",
  "position": "Software Engineer"
}'
```

2. Create an HR manager:
```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{
  "email": "hr@example.com",
  "password": "hr123",
  "firstName": "HR",
  "lastName": "Manager",
  "role": "HR",
  "department": "Human Resources",
  "position": "HR Manager"
}'
```

### Updating User Password
To update a user's password:
```bash
curl -X PATCH http://localhost:3000/api/users/{userId}/set-password -H "Content-Type: application/json" -d '{
  "password": "new_password"
}'
```

### Default Admin User
The system comes with a pre-configured admin user:
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

## API Documentation

### Authentication Endpoints
- POST /api/auth/login - Login with email and password
- POST /api/auth/logout - Logout current user

### Users Endpoints
- GET /api/users - List all users
- GET /api/users/:id - Get user details
- POST /api/users - Create new user
- PATCH /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Appraisals Endpoints
- GET /api/appraisals - List all appraisals
- GET /api/appraisals/:id - Get appraisal details
- POST /api/appraisals - Create new appraisal
- PATCH /api/appraisals/:id/status - Update appraisal status
- DELETE /api/appraisals/:id - Delete appraisal

### Bonus Endpoints
- GET /api/bonuses - List all bonuses
- GET /api/bonuses/:id - Get bonus details
- POST /api/bonuses - Create new bonus
- POST /api/bonuses/batch - Update multiple bonuses
- PATCH /api/bonuses/:id/paid - Mark bonus as paid
- DELETE /api/bonuses/:id - Delete bonus

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
