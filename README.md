# 🎓 Student Performance Prediction

Aplikasi machine learning untuk memprediksi performa siswa menggunakan Flask API backend dan React frontend dengan Tailwind CSS. Aplikasi ini dapat memprediksi apakah siswa akan **Pass**, **Fail**, **Withdrawn**, atau **Distinction** berdasarkan data demografi dan akademik.

## 🏗️ Arsitektur

```
┌─────────────────┐    HTTP     ┌─────────────────┐
│   Frontend      │ ────────→   │    Backend      │
│   (React)       │             │   (Flask API)   │
│   Port: 3000    │             │   Port: 5000    │
└─────────────────┘             └─────────────────┘
        │                               │
        └─── Tailwind CSS              └─── ML Model (Random Forest)
```

## ✨ Features

### 🤖 Machine Learning
- **Random Forest Classifier** dengan akurasi ~65%
- **10 fitur prediksi**: demografis, pendidikan, dan performa akademik
- **4 kategori hasil**: Pass, Fail, Withdrawn, Distinction
- **Real-time prediction** dengan confidence score

### 🎨 Frontend (React + Tailwind)
- **Modern UI/UX** dengan Tailwind CSS
- **Responsive design** untuk desktop dan mobile
- **Real-time form validation**
- **Interactive prediction results** dengan visualisasi
- **Load example data** untuk testing cepat
- **Detailed field explanations** untuk setiap input

### 🔧 Backend (Flask API)
- **RESTful API** dengan CORS support
- **Automatic model training** dari dataset CSV
- **Model persistence** dengan joblib
- **Comprehensive error handling**
- **Health checks** dan monitoring

## 🚀 Quick Start

### Prerequisites
- Docker dan Docker Compose
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd "Data Science Education"
```

### 2. Setup dengan Docker (Recommended)
```bash
# Setup dan jalankan semua services
./docker-setup.sh

# Akses aplikasi
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### 3. Stop Services
```bash
./docker-stop.sh
```

## 🛠️ Development Setup

### Backend Development
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Train model
python model.py

# Start development server
python app.py
```

### Frontend Development
```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

## 📊 API Documentation

### Base URL: `http://localhost:5000`

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/example-input` | Contoh input untuk testing |
| GET | `/model-info` | Informasi model ML |
| POST | `/predict` | **Prediksi hasil siswa** |
| POST | `/train` | Train ulang model |

#### POST `/predict` - Main Prediction Endpoint

**Request Body:**
```json
{
  "gender": "F",
  "region": "London Region",
  "highest_education": "HE Qualification",
  "imd_band": "80-90%",
  "age_band": "0-35",
  "num_of_prev_attempts": 0,
  "studied_credits": 180,
  "disability": "N",
  "avg_score": 85.0,
  "num_assessments": 6
}
```

**Response:**
```json
{
  "success": true,
  "prediction": "Pass",
  "confidence": 0.75,
  "probabilities": {
    "Pass": 0.75,
    "Distinction": 0.15,
    "Fail": 0.05,
    "Withdrawn": 0.05
  },
  "input_data": { ... }
}
```

## 📋 Field Descriptions

### 👤 Personal Information
- **Gender**: Jenis kelamin siswa (M/F)
- **Age Band**: Rentang usia (0-35, 35-55, 55+)
- **Region**: Wilayah geografis tempat tinggal
- **Disability**: Status disabilitas (Y/N)

### 🎓 Education
- **Highest Education**: Level pendidikan tertinggi yang diselesaikan
- **IMD Band**: Index of Multiple Deprivation (indikator sosio-ekonomi 0-100%)
- **Previous Attempts**: Jumlah percobaan sebelumnya mengambil kursus

### 📊 Academic Performance
- **Studied Credits**: Total kredit yang sedang diambil (30-360)
- **Average Score**: Rata-rata nilai assessment (0-100)
- **Number of Assessments**: Jumlah tes/tugas yang sudah dikerjakan

## 🎯 Prediction Categories

| Category | Description | Color |
|----------|-------------|-------|
| **Pass** | Lulus dengan baik | 🟢 Green |
| **Distinction** | Lulus dengan predikat terbaik | 🔵 Blue |
| **Fail** | Tidak lulus, butuh dukungan tambahan | 🔴 Red |
| **Withdrawn** | Berisiko mengundurkan diri | 🟠 Orange |

## 🐳 Docker Commands

### Manual Docker Commands
```bash
# Build dan start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop services
docker-compose down

# Restart specific service
docker-compose restart frontend
docker-compose restart backend
```

### Debugging
```bash
# Enter container shell
docker exec -it student-prediction-api bash
docker exec -it student-prediction-frontend sh

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
```

## 📁 Project Structure

```
├── README.md                   # Documentation
├── docker-compose.yml          # Docker orchestration
├── docker-setup.sh            # Setup script
├── docker-stop.sh             # Stop script
├── .gitignore                 # Git ignore rules
├── .env.production            # Production environment
├── .env.development           # Development environment
│
├── backend/                   # Flask API
│   ├── Dockerfile            # Backend container
│   ├── .dockerignore         # Docker ignore
│   ├── requirements.txt      # Python dependencies
│   ├── app.py               # Flask application
│   ├── model.py             # ML model
│   └── dataset/             # CSV datasets
│       ├── studentInfo.csv
│       ├── studentAssessment.csv
│       ├── courses.csv
│       ├── assessments.csv
│       ├── studentRegistration.csv
│       ├── studentVle.csv
│       └── vle.csv
│
└── frontend/                 # React application
    ├── Dockerfile           # Frontend container
    ├── .dockerignore        # Docker ignore
    ├── package.json         # Node dependencies
    ├── pnpm-lock.yaml       # Lock file
    ├── vite.config.ts       # Vite configuration
    ├── tailwind.config.js   # Tailwind configuration
    ├── postcss.config.js    # PostCSS configuration
    ├── index.html           # HTML entry
    └── src/
        ├── main.tsx         # React entry
        ├── App.tsx          # Main component
        ├── config.ts        # Environment config
        ├── index.css        # Global styles
        └── components/
            └── StudentPredictionForm.tsx  # Main form component
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Services not starting
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose up --build --force-recreate
```

#### 2. Port already in use
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :5000

# Kill the process or change ports in docker-compose.yml
```

#### 3. Model training fails
- Check if dataset files exist in `backend/dataset/`
- Ensure CSV files are properly formatted
- Check Python dependencies are installed

#### 4. Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration in `backend/app.py`
- Ensure API_URL is correct in frontend config

### Performance Tuning

#### Model Improvement
- Adjust Random Forest parameters in `model.py`
- Add more features from dataset
- Implement feature selection
- Try different algorithms (SVM, XGBoost, etc.)

#### Frontend Optimization
- Implement form state management with Context API
- Add loading states and error boundaries
- Optimize bundle size with code splitting
- Add caching for API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Dataset from Open University Learning Analytics Dataset
- Built with React, Flask, scikit-learn, and Tailwind CSS
- Containerized with Docker for easy deployment
