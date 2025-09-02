#!/bin/bash

# Emotion-Aware AI Therapist - Setup Script
# This script sets up the entire development environment

set -e  # Exit on any error

echo "🚀 Setting up Emotion-Aware AI Therapist Development Environment..."
echo "=================================================================="

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

# Check prerequisites
print_status "Checking prerequisites..."

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python $PYTHON_VERSION found"
else
    print_error "Python 3 is required but not installed"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION found"
else
    print_error "Node.js is required but not installed"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm $NPM_VERSION found"
else
    print_error "npm is required but not installed"
    exit 1
fi

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null || pgrep mongod > /dev/null 2>&1; then
    print_success "MongoDB detected"
else
    print_warning "MongoDB not detected - you may need to start it manually"
fi

print_status "Setting up ML Backend (Emotion Detection)..."
cd ml-backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment for ML Backend..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
print_status "Installing ML Backend dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Install system dependencies for OpenCV
print_status "Installing system dependencies for computer vision..."
if command -v apt-get &> /dev/null; then
    sudo apt-get update -qq
    sudo apt-get install -y libgl1-mesa-glx libglib2.0-0 libgtk-3-dev libgstreamer1.0-0
elif command -v yum &> /dev/null; then
    sudo yum install -y mesa-libGL gtk3-devel
elif command -v brew &> /dev/null; then
    brew install opencv
fi

deactivate
cd ..

print_status "Setting up AI Backend (Therapy Services)..."
cd ai-backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment for AI Backend..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
print_status "Installing AI Backend dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
mkdir -p temp logs

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found in ai-backend/"
    print_status "Creating .env template..."
    cp .env.example .env
    print_warning "Please update .env with your API keys before running the application"
fi

deactivate
cd ..

print_status "Setting up Frontend (Next.js Client)..."
cd client

# Install Node.js dependencies
print_status "Installing frontend dependencies..."
npm install

# Check if .env.local file exists
if [ ! -f ".env.local" ]; then
    print_status "Creating frontend environment file..."
    cat > .env.local << EOF
NEXT_PUBLIC_AI_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_ML_BACKEND_URL=http://localhost:8002
EOF
fi

cd ..

# Create startup script if it doesn't exist
if [ ! -f "start-dev.sh" ] || [ ! -s "start-dev.sh" ]; then
    print_status "Creating development startup script..."
    cat > start-dev.sh << 'EOF'
#!/bin/bash

# Development startup script for Emotion-Aware AI Therapist
# This script starts all three services in development mode

echo "🚀 Starting Emotion-Aware AI Therapist Development Environment..."
echo "================================================================"

# Kill any existing processes on these ports
echo "Cleaning up any existing processes..."
pkill -f "uvicorn.*8001" 2>/dev/null || true
pkill -f "uvicorn.*8002" 2>/dev/null || true
pkill -f "next.*3000" 2>/dev/null || true

# Start ML Backend
echo "Starting ML Backend (Port 8002)..."
cd ml-backend
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8002 --reload &
ML_BACKEND_PID=$!
deactivate
cd ..

# Wait a moment for ML backend to start
sleep 3

# Start AI Backend
echo "Starting AI Backend (Port 8001)..."
cd ai-backend
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8001 --reload &
AI_BACKEND_PID=$!
deactivate
cd ..

# Wait a moment for AI backend to start
sleep 3

# Start Frontend
echo "Starting Frontend (Port 3000)..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 All services started successfully!"
echo "=================================="
echo "Frontend: http://localhost:3000"
echo "AI Backend API: http://localhost:8001/docs"
echo "ML Backend API: http://localhost:8002/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $ML_BACKEND_PID 2>/dev/null || true
    kill $AI_BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
EOF
    chmod +x start-dev.sh
fi

# Make scripts executable
chmod +x setup.sh
chmod +x start-dev.sh

print_success "Setup completed successfully!"
echo ""
echo "🎉 Installation Complete!"
echo "========================="
echo ""
echo "Next steps:"
echo "1. Configure your API keys in ai-backend/.env:"
echo "   - OPENAI_API_KEY (required for GPT-4)"
echo "   - ELEVENLABS_API_KEY (required for TTS)"
echo "   - DID_API_KEY (required for avatars)"
echo ""
echo "2. Start MongoDB (if not running):"
echo "   - sudo systemctl start mongod  # On Linux"
echo "   - brew services start mongodb  # On macOS"
echo ""
echo "3. Start the development environment:"
echo "   ./start-dev.sh"
echo ""
echo "🚀 Your AI Therapist is ready to run!"
