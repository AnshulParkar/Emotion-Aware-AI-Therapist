#!/bin/bash

# Development startup script for Emotion-Aware AI Therapist
# This script starts all three services in development mode

echo "🚀 Starting Emotion-Aware AI Therapist Development Environment..."
echo "================================================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if setup was run
if [ ! -d "ml-backend/venv" ] || [ ! -d "ai-backend/venv" ] || [ ! -d "client/node_modules" ]; then
    print_error "Dependencies not installed. Please run ./setup.sh first!"
    exit 1
fi

# Kill any existing processes on these ports
print_status "Cleaning up any existing processes..."
pkill -f "uvicorn.*8001" 2>/dev/null || true
pkill -f "uvicorn.*8002" 2>/dev/null || true
pkill -f "next.*3000" 2>/dev/null || true
sleep 2

# Check if MongoDB is running
print_status "Checking MongoDB connection..."
if ! mongosh --eval "db.runCommand('ping')" --quiet >/dev/null 2>&1; then
    print_warning "MongoDB not accessible. Make sure MongoDB is running:"
    print_warning "  sudo systemctl start mongod  # Linux"
    print_warning "  brew services start mongodb  # macOS"
fi

# Start ML Backend (Emotion Detection)
print_status "Starting ML Backend (Emotion Detection) on port 8002..."
cd ml-backend
if [ ! -f "venv/bin/activate" ]; then
    print_error "ML Backend virtual environment not found!"
    exit 1
fi
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8002 --reload &
ML_BACKEND_PID=$!
deactivate
cd ..
sleep 3

# Check if ML Backend started successfully
if curl -s http://localhost:8002/health >/dev/null 2>&1; then
    print_success "ML Backend started successfully"
else
    print_warning "ML Backend might be starting up..."
fi

# Start AI Backend (Therapy Services)
print_status "Starting AI Backend (Therapy Services) on port 8001..."
cd ai-backend

# Check for required environment variables
if [ ! -f ".env" ]; then
    print_warning ".env file not found in ai-backend/"
    print_warning "Creating basic .env file - please add your API keys!"
    cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
DID_API_KEY=your_did_api_key_here
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=ai_therapist
SECRET_KEY=$(openssl rand -base64 32 2>/dev/null || echo "fallback-secret-key-$(date +%s)")
PORT=8001
EOF
fi

source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8001 --reload &
AI_BACKEND_PID=$!
deactivate
cd ..
sleep 3

# Check if AI Backend started successfully
if curl -s http://localhost:8001/health >/dev/null 2>&1; then
    print_success "AI Backend started successfully"
else
    print_warning "AI Backend might be starting up..."
fi

# Start Frontend (Next.js)
print_status "Starting Frontend (Next.js) on port 3000..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..
sleep 5

# Check if Frontend started successfully
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend started successfully"
else
    print_warning "Frontend might be starting up..."
fi

echo ""
print_success "🎉 All services started successfully!"
echo "===================================="
echo ""
echo "🌐 Application URLs:"
echo "   Frontend:        http://localhost:3000"
echo "   AI Backend API:  http://localhost:8001/docs"
echo "   ML Backend API:  http://localhost:8002/docs"
echo ""
echo "📊 Service Status:"
echo "   ML Backend PID:  $ML_BACKEND_PID"
echo "   AI Backend PID:  $AI_BACKEND_PID"
echo "   Frontend PID:    $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Check individual terminal outputs for detailed logs"
echo ""
echo "🛑 To stop all services, press Ctrl+C"
echo ""

# Function to cleanup processes on exit
cleanup() {
    echo ""
    print_status "Shutting down services..."
    kill $ML_BACKEND_PID 2>/dev/null || true
    kill $AI_BACKEND_PID 2>/dev/null || true  
    kill $FRONTEND_PID 2>/dev/null || true
    
    # Extra cleanup for any remaining processes
    pkill -f "uvicorn.*8001" 2>/dev/null || true
    pkill -f "uvicorn.*8002" 2>/dev/null || true
    pkill -f "next.*3000" 2>/dev/null || true
    
    print_success "All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Show real-time status
print_status "Services are running. Monitoring..."

# Keep script running and show periodic status
while true; do
    sleep 30
    if ! kill -0 $ML_BACKEND_PID 2>/dev/null; then
        print_error "ML Backend stopped unexpectedly!"
    fi
    if ! kill -0 $AI_BACKEND_PID 2>/dev/null; then
        print_error "AI Backend stopped unexpectedly!"
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend stopped unexpectedly!"
    fi
done
