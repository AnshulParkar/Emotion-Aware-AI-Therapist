"""
Alternative startup script to avoid multiprocessing issues on Windows
"""
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    # Import app only when running
    from app import app
    
    uvicorn.run(
        app,
        host="0.0.0.0", 
        port=int(os.getenv("PORT", 8001)),
        reload=False,
        log_level="info"
    )
