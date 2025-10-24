import { useState } from 'react'
import config from '../config'

interface StudentData {
  gender: string
  region: string
  highest_education: string
  imd_band: string
  age_band: string
  num_of_prev_attempts: number
  studied_credits: number
  disability: string
  avg_score: number
  num_assessments: number
}

interface PredictionResult {
  success: boolean
  prediction: string
  confidence: number
  probabilities: Record<string, number>
  error?: string
}

const StudentPredictionForm = () => {
  const [formData, setFormData] = useState<StudentData>({
    gender: '',
    region: '',
    highest_education: '',
    imd_band: '',
    age_band: '',
    num_of_prev_attempts: 0,
    studied_credits: 60,
    disability: 'N',
    avg_score: 0,
    num_assessments: 0
  })

  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('num_') || name === 'studied_credits' || name === 'avg_score'
        ? Number(value)
        : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`${config.API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error({ error })
      setResult({
        success: false,
        prediction: '',
        confidence: 0,
        probabilities: {},
        error: 'Gagal terhubung ke server. Pastikan API server berjalan di port 5000.'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadExampleData = () => {
    // Always generate random data for more variety
    generateRandomSampleData()
  }

  const generateRandomSampleData = () => {
    const genders = ['M', 'F']
    const regions = [
      'East Anglian Region', 'London Region', 'North Region', 'South Region',
      'Scotland', 'Wales', 'Ireland', 'North Western Region', 'South East Region',
      'West Midlands Region', 'South West Region', 'Yorkshire Region', 'East Midlands Region'
    ]
    const educations = [
      'No Formal quals', 'Lower Than A Level', 'A Level or Equivalent',
      'HE Qualification', 'Post Graduate Qualification'
    ]
    const imdBands = [
      '0-10%', '10-20%', '20-30%', '30-40%', '40-50%',
      '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'
    ]
    const ageBands = ['0-35', '35-55', '55<=']
    const disabilities = ['N', 'Y']
    const creditOptions = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]

    // Generate more realistic combinations
    const selectedGender = genders[Math.floor(Math.random() * genders.length)]
    const selectedAge = ageBands[Math.floor(Math.random() * ageBands.length)]
    const selectedEducation = educations[Math.floor(Math.random() * educations.length)]
    
    // Generate correlated data for more realism
    let avgScore, numAssessments, prevAttempts
    
    // Higher education tends to have better scores
    if (selectedEducation === 'Post Graduate Qualification' || selectedEducation === 'HE Qualification') {
      avgScore = Math.floor(Math.random() * 40) + 60 // 60-100
      numAssessments = Math.floor(Math.random() * 8) + 8 // 8-15
      prevAttempts = Math.floor(Math.random() * 2) // 0-1
    } else if (selectedEducation === 'A Level or Equivalent') {
      avgScore = Math.floor(Math.random() * 50) + 50 // 50-100
      numAssessments = Math.floor(Math.random() * 10) + 5 // 5-14
      prevAttempts = Math.floor(Math.random() * 3) // 0-2
    } else {
      avgScore = Math.floor(Math.random() * 70) + 30 // 30-100
      numAssessments = Math.floor(Math.random() * 12) + 3 // 3-14
      prevAttempts = Math.floor(Math.random() * 4) // 0-3
    }

    setFormData({
      gender: selectedGender,
      region: regions[Math.floor(Math.random() * regions.length)],
      highest_education: selectedEducation,
      imd_band: imdBands[Math.floor(Math.random() * imdBands.length)],
      age_band: selectedAge,
      num_of_prev_attempts: prevAttempts,
      studied_credits: creditOptions[Math.floor(Math.random() * creditOptions.length)],
      disability: disabilities[Math.floor(Math.random() * disabilities.length)],
      avg_score: Math.round(avgScore * 10) / 10, // Round to 1 decimal
      num_assessments: numAssessments
    })
  }

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'Pass': return 'bg-emerald-500'
      case 'Distinction': return 'bg-blue-500'
      case 'Fail': return 'bg-red-500'
      case 'Withdrawn': return 'bg-amber-500'
      default: return 'bg-gray-500'
    }
  }

  const formatPercentage = (value: number) => (value * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🎓 Student Performance Prediction
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Aplikasi machine learning untuk memprediksi hasil belajar siswa berdasarkan data demografi,
            pendidikan, dan performa akademik. Gunakan form di bawah untuk input data siswa dan dapatkan prediksi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">📊 Input Data Siswa</h2>
                <button
                  type="button"
                  onClick={loadExampleData}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  🎲 Load Data Acak
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                    👤 Informasi Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-slate-800 mb-2">
                        Jenis Kelamin
                        <span className="text-slate-600 text-xs block font-normal">Pilih jenis kelamin siswa</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="M">Laki-laki (M)</option>
                        <option value="F">Perempuan (F)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="age_band" className="block text-sm font-medium text-slate-800 mb-2">
                        Rentang Usia
                        <span className="text-slate-600 text-xs block font-normal">Kelompok usia siswa</span>
                      </label>
                      <select
                        id="age_band"
                        name="age_band"
                        value={formData.age_band}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      >
                        <option value="">Pilih rentang usia</option>
                        <option value="0-35">0-35 tahun (Muda)</option>
                        <option value="35-55">35-55 tahun (Dewasa)</option>
                        <option value="55<=">55+ tahun (Senior)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-slate-800 mb-2">
                        Wilayah
                        <span className="text-slate-600 text-xs block font-normal">Wilayah geografis tempat tinggal</span>
                      </label>
                      <select
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      >
                        <option value="">Pilih wilayah</option>
                        <option value="East Anglian Region">East Anglian Region</option>
                        <option value="London Region">London Region</option>
                        <option value="North Region">North Region</option>
                        <option value="South Region">South Region</option>
                        <option value="Scotland">Scotland</option>
                        <option value="Wales">Wales</option>
                        <option value="Ireland">Ireland</option>
                        <option value="North Western Region">North Western Region</option>
                        <option value="South East Region">South East Region</option>
                        <option value="West Midlands Region">West Midlands Region</option>
                        <option value="South West Region">South West Region</option>
                        <option value="Yorkshire Region">Yorkshire Region</option>
                        <option value="East Midlands Region">East Midlands Region</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="disability" className="block text-sm font-medium text-slate-800 mb-2">
                        Status Disabilitas
                        <span className="text-slate-600 text-xs block font-normal">Apakah siswa memiliki disabilitas</span>
                      </label>
                      <select
                        id="disability"
                        name="disability"
                        value={formData.disability}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      >
                        <option value="N">Tidak (N)</option>
                        <option value="Y">Ya (Y)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Education Information */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                    🎓 Informasi Pendidikan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="highest_education" className="block text-sm font-medium text-slate-800 mb-2">
                        Pendidikan Tertinggi
                        <span className="text-slate-600 text-xs block font-normal">Level pendidikan yang pernah diselesaikan</span>
                      </label>
                      <select
                        id="highest_education"
                        name="highest_education"
                        value={formData.highest_education}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      >
                        <option value="">Pilih pendidikan tertinggi</option>
                        <option value="No Formal quals">No Formal quals (Tidak ada kualifikasi formal)</option>
                        <option value="Lower Than A Level">Lower Than A Level (Di bawah A Level)</option>
                        <option value="A Level or Equivalent">A Level or Equivalent (Setara SMA)</option>
                        <option value="HE Qualification">HE Qualification (Kualifikasi Pendidikan Tinggi)</option>
                        <option value="Post Graduate Qualification">Post Graduate Qualification (S2/S3)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="imd_band" className="block text-sm font-medium text-slate-800 mb-2">
                        IMD Band (Kondisi Sosial Ekonomi)
                        <span className="text-slate-600 text-xs block font-normal">Index of Multiple Deprivation - indikator kemiskinan</span>
                      </label>
                      <select
                        id="imd_band"
                        name="imd_band"
                        value={formData.imd_band}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      >
                        <option value="">Pilih IMD band</option>
                        <option value="0-10%">0-10% (Sangat Miskin)</option>
                        <option value="10-20%">10-20% (Miskin)</option>
                        <option value="20-30%">20-30%</option>
                        <option value="30-40%">30-40%</option>
                        <option value="40-50%">40-50% (Menengah)</option>
                        <option value="50-60%">50-60%</option>
                        <option value="60-70%">60-70%</option>
                        <option value="70-80%">70-80%</option>
                        <option value="80-90%">80-90% (Baik)</option>
                        <option value="90-100%">90-100% (Sangat Baik)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="num_of_prev_attempts" className="block text-sm font-medium text-slate-800 mb-2">
                        Jumlah Percobaan Sebelumnya
                        <span className="text-slate-600 text-xs block font-normal">Berapa kali siswa mengulang kursus ini</span>
                      </label>
                      <input
                        type="number"
                        id="num_of_prev_attempts"
                        name="num_of_prev_attempts"
                        value={formData.num_of_prev_attempts}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="studied_credits" className="block text-sm font-medium text-slate-800 mb-2">
                        Jumlah Kredit
                        <span className="text-slate-600 text-xs block font-normal">Total kredit yang sedang diambil (30-360)</span>
                      </label>
                      <input
                        type="number"
                        id="studied_credits"
                        name="studied_credits"
                        value={formData.studied_credits}
                        onChange={handleInputChange}
                        min="30"
                        max="360"
                        step="30"
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Performance */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                    📊 Performa Akademik
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="avg_score" className="block text-sm font-medium text-slate-800 mb-2">
                        Rata-rata Skor Assessment
                        <span className="text-slate-600 text-xs block font-normal">Nilai rata-rata dari semua tes (0-100)</span>
                      </label>
                      <input
                        type="number"
                        id="avg_score"
                        name="avg_score"
                        value={formData.avg_score}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.1"
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="num_assessments" className="block text-sm font-medium text-slate-800 mb-2">
                        Jumlah Assessment
                        <span className="text-slate-600 text-xs block font-normal">Total tes/tugas yang sudah dikerjakan</span>
                      </label>
                      <input
                        type="number"
                        id="num_assessments"
                        name="num_assessments"
                        value={formData.num_assessments}
                        onChange={handleInputChange}
                        min="0"
                        max="20"
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? '🔄 Memprediksi...' : '🚀 Prediksi Hasil Belajar'}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {result ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
                {result.success ? (
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-800 mb-6">📈 Hasil Prediksi</h3>

                    <div className="text-center mb-6">
                      <div className={`inline-block px-6 py-3 rounded-xl text-white text-xl font-bold ${getPredictionColor(result.prediction)}`}>
                        {result.prediction}
                      </div>
                      <div className="mt-2 text-slate-600">
                        Confidence: <span className="font-semibold text-slate-800">{formatPercentage(result.confidence)}%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-800">Probabilitas untuk Setiap Hasil:</h4>
                      {Object.entries(result.probabilities).map(([className, probability]) => (
                        <div key={className} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-700">{className}</span>
                            <span className="text-slate-600">{formatPercentage(probability)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${getPredictionColor(className)}`}
                              style={{ width: `${probability * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">📝 Penjelasan:</h4>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        {result.prediction === 'Pass' && 'Siswa diprediksi akan lulus dengan baik. Pertahankan performa akademik dan motivasi belajar.'}
                        {result.prediction === 'Distinction' && 'Siswa diprediksi akan lulus dengan predikat terbaik! Performa sangat memuaskan.'}
                        {result.prediction === 'Fail' && 'Siswa berisiko tidak lulus. Perlu dukungan tambahan, bimbingan ekstra, dan evaluasi metode belajar.'}
                        {result.prediction === 'Withdrawn' && 'Siswa berisiko mengundurkan diri. Perlu perhatian khusus, konseling, dan dukungan motivasi.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-red-600 mb-4">❌ Error</h3>
                    <p className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">{result.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">ℹ️ Cara Penggunaan</h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <div>
                    <p className="font-medium text-slate-800">1. Isi semua field yang tersedia</p>
                    <p>Masukkan data siswa sesuai dengan kategori yang diminta</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">2. Klik "Load Data Acak"</p>
                    <p>Untuk mengisi form dengan data acak yang berbeda setiap kali</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">3. Klik "Prediksi Hasil"</p>
                    <p>Sistem akan memproses dan menampilkan prediksi di sini</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-medium text-slate-800 mb-2">Kemungkinan Hasil:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-emerald-500 rounded-full shrink-0"></span>
                      <span className="text-slate-700"><strong>Pass:</strong> Lulus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-blue-500 rounded-full shrink-0"></span>
                      <span className="text-slate-700"><strong>Distinction:</strong> Lulus dengan predikat terbaik</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-red-500 rounded-full shrink-0"></span>
                      <span className="text-slate-700"><strong>Fail:</strong> Tidak lulus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-amber-500 rounded-full shrink-0"></span>
                      <span className="text-slate-700"><strong>Withdrawn:</strong> Mengundurkan diri</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentPredictionForm