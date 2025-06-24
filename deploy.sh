#!/bin/bash

# Deploy script for Gearment project
# This script deploys the application using GitLab Container Registry images

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "Docker Compose file $COMPOSE_FILE not found."
        exit 1
    fi
    
    print_status "Prerequisites check passed."
}

# Function to load environment variables
load_env() {
    if [ -f "$ENV_FILE" ]; then
        print_status "Loading environment variables from $ENV_FILE"
        export $(cat $ENV_FILE | grep -v '^#' | xargs)
    else
        print_warning "Environment file $ENV_FILE not found. Using default values."
    fi
}

# Function to login to GitLab Container Registry
login_registry() {
    if [ -z "$CI_REGISTRY_USER" ] || [ -z "$CI_REGISTRY_PASSWORD" ] || [ -z "$CI_REGISTRY" ]; then
        print_error "GitLab Registry credentials not found. Please set CI_REGISTRY_USER, CI_REGISTRY_PASSWORD, and CI_REGISTRY environment variables."
        exit 1
    fi
    
    print_status "Logging in to GitLab Container Registry..."
    echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin "$CI_REGISTRY"
}

# Function to pull latest images
pull_images() {
    print_status "Pulling latest images from GitLab Container Registry..."
    docker-compose -f "$COMPOSE_FILE" pull
}

# Function to deploy application
deploy() {
    print_status "Deploying application..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_status "Application deployed successfully!"
    else
        print_error "Some services failed to start. Check logs with: docker-compose -f $COMPOSE_FILE logs"
        exit 1
    fi
}

# Function to show application status
show_status() {
    print_status "Application status:"
    docker-compose -f "$COMPOSE_FILE" ps
}

# Function to show logs
show_logs() {
    print_status "Showing application logs:"
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# Function to stop application
stop_app() {
    print_status "Stopping application..."
    docker-compose -f "$COMPOSE_FILE" down
    print_status "Application stopped."
}

# Function to clean up old images
cleanup() {
    print_status "Cleaning up old Docker images..."
    docker image prune -f
    print_status "Cleanup completed."
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy     Deploy the application (default)"
    echo "  status     Show application status"
    echo "  logs       Show application logs"
    echo "  stop       Stop the application"
    echo "  cleanup    Clean up old Docker images"
    echo "  help       Show this help message"
    echo ""
    echo "Environment:"
    echo "  Set the following environment variables or create a .env file:"
    echo "  - CI_REGISTRY_USER: GitLab registry username"
    echo "  - CI_REGISTRY_PASSWORD: GitLab registry password"
    echo "  - CI_REGISTRY: GitLab registry URL"
    echo "  - CI_REGISTRY_IMAGE: GitLab registry image path"
    echo "  - DB_PASSWORD: Database password"
    echo "  - JWT_SECRET: JWT secret key"
}

# Main script logic
main() {
    COMMAND=${1:-deploy}
    
    case $COMMAND in
        deploy)
            check_prerequisites
            load_env
            login_registry
            pull_images
            deploy
            show_status
            cleanup
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        stop)
            stop_app
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $COMMAND"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"

# Set environment variables for production
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://gearment-be.minhviet.xyz/api

echo "🚀 Starting deployment..."

# Build and push backend
echo "📦 Building backend..."
cd backend
docker build -t registry.gitlab.com/zengratul/gearment/backend:latest .
docker push registry.gitlab.com/zengratul/gearment/backend:latest
cd ..

# Build and push frontend with environment variables
echo "📦 Building frontend..."
cd frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://gearment-be.minhviet.xyz/api \
  --build-arg NODE_ENV=production \
  -t registry.gitlab.com/zengratul/gearment/frontend:latest .
docker push registry.gitlab.com/zengratul/gearment/frontend:latest
cd ..

# Deploy with docker-compose
echo "🚀 Deploying with docker-compose..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://localhost:6000"
echo "🔧 Backend: http://localhost:6001"
echo "🗄️  Database: localhost:6002" 