# 🧠 Emotion-Aware AI Therapist: MindBridge

> **A GenAI-Powered Next.js Web App with Real-Time Avatar Interaction, Facial Emotion Detection, and Therapeutic Conversations**

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT4-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)

## 🎯 Project Overview

**MindBridge** is an innovative AI-powered therapy application that combines cutting-edge technologies to provide empathetic, personalized mental health support. The system uses real-time facial emotion detection, GPT-4 powered conversations, and lifelike avatar interactions to create an immersive therapeutic experience.

### ✨ Key Features

- 🎭 **Real-Time Emotion Detection** - Advanced facial emotion recognition using OpenCV and MediaPipe
- 🤖 **AI-Powered Therapy Sessions** - GPT-4 generated empathetic responses based on detected emotions
- 🗣️ **Text-to-Speech Integration** - Natural voice synthesis using ElevenLabs API
- 👤 **Talking Avatar Interface** - Lifelike avatar responses using D-ID technology
- 📹 **WebRTC Video Calling** - Real-time video communication with emotion overlay
- 📊 **Session Analytics** - Emotion tracking and therapy progress monitoring
- 🔐 **Secure Data Management** - MongoDB-based session storage with privacy protection

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   AI Backend    │    │  ML Backend     │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (FastAPI)     │
│                 │    │                 │    │                 │
│ • Video UI      │    │ • OpenAI GPT-4  │    │ • Emotion       │
│ • WebRTC        │    │ • ElevenLabs    │    │   Detection     │
│ • Avatar        │    │ • D-ID Avatar   │    │ • OpenCV        │
│ • Real-time     │    │ • MongoDB       │    │ • MediaPipe     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Video**: react-webcam, WebRTC
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Animations**: Framer Motion

### AI Backend
- **Framework**: FastAPI (Python)
- **AI Models**: OpenAI GPT-4
- **Text-to-Speech**: ElevenLabs API
- **Avatar Generation**: D-ID API
- **Database**: MongoDB with Motor (async)
- **Authentication**: JWT with python-jose
- **HTTP Client**: httpx, aiohttp
- **Audio Processing**: librosa, soundfile
- **Background Tasks**: Celery + Redis

### ML Backend
- **Framework**: FastAPI (Python)
- **Computer Vision**: OpenCV, MediaPipe
- **Machine Learning**: TensorFlow, PyTorch, scikit-learn
- **Image Processing**: Pillow, NumPy
- **Data Analysis**: pandas, scipy
- **Visualization**: matplotlib, seaborn

### Infrastructure
- **Database**: MongoDB
- **Caching**: Redis
- **Development**: Docker support
- **Monitoring**: Prometheus metrics
- **Environment**: Python 3.9+, Node.js 18+

## 🚀 Quick Start (Automated Setup)

### 🎯 **Fastest Way to Get Started**

**Prerequisites:**
- **Node.js** 18.0+ 
- **Python** 3.9+
- **MongoDB** 4.4+

**1. Clone and Setup:**
```bash
git clone https://github.com/AnshulParkar/Emotion-Aware-AI-Therapist.git
cd Emotion-Aware-AI-Therapist

# Run automated setup (installs all dependencies)
./setup.sh
```

**2. Configure API Keys:**
Edit `ai-backend/.env` with your API keys:
```bash
# Get API keys from:
# - OpenAI: https://platform.openai.com/
# - ElevenLabs: https://elevenlabs.io/
# - D-ID: https://www.d-id.com/

nano ai-backend/.env
```

**3. Start All Services:**
```bash
# Starts ML Backend (8002) + AI Backend (8001) + Frontend (3000)
./start-dev.sh
```

**4. Access Application:**
- 🌐 **Frontend**: http://localhost:3000
- 🤖 **AI API Docs**: http://localhost:8001/docs  
- 🔍 **ML API Docs**: http://localhost:8002/docs

### 🛑 **Stop Services:**
```bash
# Press Ctrl+C in the terminal running start-dev.sh
# Or kill all processes:
pkill -f "uvicorn.*800[12]" && pkill -f "next.*3000"
```

---

## 📖 Manual Setup (Alternative)

If you prefer manual setup or need to troubleshoot:

### Prerequisites

- **Node.js** 18.0 or higher
- **Python** 3.9 or higher
- **MongoDB** 4.4 or higher
- **Redis** 6.0 or higher (optional, for caching)

### API Keys Required

You'll need API keys from:
- [OpenAI](https://platform.openai.com/) - For GPT-4 conversations
- [ElevenLabs](https://elevenlabs.io/) - For text-to-speech
- [D-ID](https://www.d-id.com/) - For talking avatars

### 1. Clone the Repository

```bash
git clone https://github.com/AnshulParkar/Emotion-Aware-AI-Therapist.git
cd Emotion-Aware-AI-Therapist
```

### 2. Environment Setup

Create `.env` files in each backend directory:

**ai-backend/.env:**
```env
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
DID_API_KEY=your_did_api_key_here
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=ai_therapist
SECRET_KEY=your_secret_key_here
PORT=8001
```

**ml-backend/.env:**
```env
PORT=8002
DEBUG=true
```

**client/.env.local:**
```env
NEXT_PUBLIC_AI_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_ML_BACKEND_URL=http://localhost:8002
```

### 3. Install Dependencies

**Install ML Backend Dependencies:**
```bash
cd ml-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Install AI Backend Dependencies:**
```bash
cd ../ai-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Install Frontend Dependencies:**
```bash
cd ../client
npm install
```

### 4. Start the Services

**Terminal 1 - Start ML Backend (Emotion Detection):**
```bash
cd ml-backend
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8002 --reload
```

**Terminal 2 - Start AI Backend (Therapy AI):**
```bash
cd ai-backend
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 3 - Start Frontend:**
```bash
cd client
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **AI Backend API Docs**: http://localhost:8001/docs
- **ML Backend API Docs**: http://localhost:8002/docs

## 📖 API Documentation

### ML Backend Endpoints (Port 8002)

- `GET /` - Health check
- `POST /detect-emotion` - Analyze facial emotions from image
- `POST /analyze-video` - Process video stream for emotion detection
- `GET /health` - Service health status

### AI Backend Endpoints (Port 8001)

- `GET /` - Health check
- `POST /chat` - Generate therapy response
- `POST /tts` - Convert text to speech
- `POST /avatar` - Generate talking avatar video
- `POST /session` - Create therapy session
- `GET /session/{session_id}` - Get session data

## 🔧 Development

### Automated Scripts

**setup.sh** - One-time setup script that:
- ✅ Checks prerequisites (Python, Node.js, MongoDB)
- ✅ Creates virtual environments for both backends
- ✅ Installs all Python and Node.js dependencies
- ✅ Installs system dependencies for OpenCV
- ✅ Creates environment file templates
- ✅ Makes everything ready to run

**start-dev.sh** - Development server script that:
- ✅ Starts ML Backend on port 8002
- ✅ Starts AI Backend on port 8001  
- ✅ Starts Frontend on port 3000
- ✅ Monitors all services and handles cleanup
- ✅ Shows real-time status and service URLs

### Troubleshooting

**Common Issues:**

1. **Port Already in Use:**
   ```bash
   # Kill processes on specific ports
   sudo lsof -ti:8001 | xargs kill -9
   sudo lsof -ti:8002 | xargs kill -9
   sudo lsof -ti:3000 | xargs kill -9
   ```

2. **MongoDB Connection Error:**
   ```bash
   # Start MongoDB
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```

3. **Python Virtual Environment Issues:**
   ```bash
   # Reset virtual environments
   rm -rf ml-backend/venv ai-backend/venv
   ./setup.sh  # Run setup again
   ```

4. **OpenCV Installation Issues:**
   ```bash
   # Install system dependencies manually
   sudo apt-get install libgl1-mesa-glx libglib2.0-0 libgtk-3-dev
   ```

5. **API Key Errors:**
   - Ensure `.env` file in `ai-backend/` has valid API keys
   - Check API key formats and quotation marks
   - Verify API keys have sufficient credits/permissions

**Check Service Status:**
```bash
# Check if services are running
curl http://localhost:8002/health  # ML Backend
curl http://localhost:8001/health  # AI Backend  
curl http://localhost:3000         # Frontend
```

### Project Structure

```
Emotion-Aware-AI-Therapist/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and hooks
│   └── public/           # Static assets
├── ai-backend/            # AI services backend
│   ├── services/         # AI service modules
│   ├── app.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── ml-backend/            # Machine learning backend
│   ├── models/           # ML model implementations
│   ├── services/         # ML service modules
│   ├── app.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
└── README.md             # This file
```

### Running Tests

**Backend Tests:**
```bash
cd ml-backend
pytest tests/

cd ../ai-backend
pytest tests/
```

**Frontend Tests:**
```bash
cd client
npm test
```

### Docker Support

**Build and run with Docker Compose:**
```bash
docker-compose up --build
```

## 🔒 Security & Privacy

- All therapy sessions are stored securely in MongoDB
- User data is encrypted and anonymized
- API keys are managed through environment variables
- JWT-based authentication for secure sessions
- CORS policies restrict unauthorized access

## 📊 Monitoring & Analytics

- Real-time emotion detection accuracy metrics
- Session duration and engagement tracking
- API response time monitoring
- User interaction analytics (anonymized)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- ElevenLabs for natural TTS
- D-ID for avatar technology
- MediaPipe for face detection
- The open-source community

## 📞 Support

For support, email support@mindbridge-ai.com or join our [Discord community](https://discord.gg/mindbridge).

---

**Made with ❤️ for mental health awareness and AI-powered therapy solutions**Emotion-Aware-AI-Therapist
“MindBridge: Emotion-Aware AI Therapist: A GenAI-Powered Web App with Real-Time Avatar Interaction”
