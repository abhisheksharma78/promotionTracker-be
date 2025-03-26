# API Endpoints Documentation

## Authentication
All endpoints except those marked with 🔓 require JWT authentication token in the Authorization header.

### Auth Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login with email and password | 🔓 |
| POST | `/api/auth/logout` | Logout current user | ✓ |

### Users Endpoints
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/users` | List all users | ✓ | ADMIN, HR |
| GET | `/api/users/:id` | Get user details | ✓ | ADMIN, HR, Owner |
| POST | `/api/users` | Create new user | 🔓 | - |
| PATCH | `/api/users/:id` | Update user | ✓ | ADMIN, HR |
| DELETE | `/api/users/:id` | Delete user | ✓ | ADMIN |
| PATCH | `/api/users/admin-setup/:id` | Set admin password | 🔓 | - |
| PATCH | `/api/users/:id/set-password` | Set user password | 🔓 | - |

### Appraisals Endpoints
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/appraisals` | List all appraisals | ✓ | ADMIN, HR, HOD |
| GET | `/api/appraisals/:id` | Get appraisal details | ✓ | ADMIN, HR, HOD, Owner |
| POST | `/api/appraisals` | Create new appraisal | ✓ | All |
| PATCH | `/api/appraisals/:id/status` | Update appraisal status | ✓ | ADMIN, HR, HOD |
| DELETE | `/api/appraisals/:id` | Delete appraisal | ✓ | ADMIN, HR |
| GET | `/api/appraisals/employee/:employeeId` | Get employee's appraisals | ✓ | ADMIN, HR, HOD, Owner |
| GET | `/api/appraisals/manager/:managerId` | Get manager's team appraisals | ✓ | ADMIN, HR, HOD |

### Bonus Endpoints
| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/bonuses` | List all bonuses | ✓ | ADMIN, HR |
| GET | `/api/bonuses/:id` | Get bonus details | ✓ | ADMIN, HR, Owner |
| POST | `/api/bonuses` | Create new bonus | ✓ | ADMIN, HR |
| DELETE | `/api/bonuses/:id` | Delete bonus | ✓ | ADMIN, HR |
| GET | `/api/bonuses/employee/:employeeId` | Get employee's bonuses | ✓ | ADMIN, HR, Owner |
| POST | `/api/bonuses/batch` | Batch update bonuses | ✓ | ADMIN, HR |
| PATCH | `/api/bonuses/:id/paid` | Mark bonus as paid | ✓ | ADMIN, HR |

## Response Formats

### Success Response
```json
{
    "data": {}, // Response data
    "message": "Success message"
}
```

### Error Response
```json
{
    "error": {
        "code": "ERROR_CODE",
        "message": "Error message"
    }
}
```

## Authentication
- All protected endpoints require a JWT token in the Authorization header
- Format: `Authorization: Bearer <token>`
- Token is obtained from the login endpoint

## Role-Based Access
- **USER**: Regular employee access
- **HOD**: Department head access
- **HR**: Human resources access
- **ADMIN**: Full system access
- **CEO**: Executive access

## Notes
- 🔓 Indicates public endpoints that don't require authentication
- Owner refers to the user accessing their own data
- All timestamps are in ISO 8601 format
- Pagination is supported on list endpoints using `?page=1&limit=10`
