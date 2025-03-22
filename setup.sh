#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Promotion Tracker Setup...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose
fi

# Check if Docker service is running
if ! systemctl is-active --quiet docker; then
    echo -e "${YELLOW}Starting Docker service...${NC}"
    sudo systemctl start docker
fi

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp .env.example .env
fi

# Start services using docker-compose
echo -e "${GREEN}Starting services with Docker Compose...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Create default admin user
echo -e "${GREEN}Creating default admin user...${NC}"
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
}'

echo -e "${GREEN}\nSetup completed! Access the application at:${NC}"
echo -e "Frontend: http://localhost"
echo -e "Backend API: http://localhost:3000/api"
echo -e "\nDefault admin credentials:"
echo -e "Email: admin@example.com"
echo -e "Password: admin123"
