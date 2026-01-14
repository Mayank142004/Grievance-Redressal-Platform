
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-royal-gradient flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 tracking-tight">
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            Jan Sunwai Rajasthan
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-10 text-gray-700 font-light leading-relaxed">
          A transparent, AI-powered bridge between <span className="font-semibold text-orange-700">Citizens</span> and <span className="font-semibold text-orange-700">Governance</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/submit" className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 transition-all text-lg">
            Submit Grievance
          </Link>
          <Link to="/track" className="px-8 py-4 bg-white text-orange-700 font-bold rounded-xl shadow-md border-2 border-orange-100 hover:border-orange-300 transform hover:-translate-y-1 transition-all text-lg">
            Track Status
          </Link>
        </div>
      </motion.div>

      {/* Feature Cards Teaser */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 z-10 w-full max-w-5xl">
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-bold text-gray-800 text-xl mb-2">Fast Resolution</h3>
          <p className="text-gray-600">AI-driven routing ensures your voice reaches the right officer instantly.</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">📍</div>
          <h3 className="font-bold text-gray-800 text-xl mb-2">Geo-Tagged</h3>
          <p className="text-gray-600">Automatic location detection for precise action on ground issues.</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="font-bold text-gray-800 text-xl mb-2">Secure & Private</h3>
          <p className="text-gray-600">Your identity is protected while keeping the process transparent.</p>
        </div>
      </div>
    </div>
  )
}

export default Home;