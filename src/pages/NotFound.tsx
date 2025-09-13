import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'
import SEOHead from '../components/SEOHead'

const NotFound: React.FC = () => {
  return (
    <>
      <SEOHead
        title="404 - Page Not Found | Shriyash Sharma"
        description="The page you're looking for doesn't exist. Let's get you back on track."
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-accent-900 dark:to-accent-800">
        <div className="container-custom">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              {/* 404 Number */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h1 className="text-8xl md:text-9xl font-bold gradient-text">
                  404
                </h1>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6 mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white">
                  Oops! Page Not Found
                </h2>
                <p className="text-lg text-accent-600 dark:text-accent-400 leading-relaxed">
                  The page you're looking for doesn't exist or has been moved. 
                  Don't worry, let's get you back on track!
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Link
                  to="/"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </Link>
                
                <button
                  onClick={() => window.history.back()}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Go Back</span>
                </button>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="card max-w-md mx-auto"
              >
                <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/about"
                    className="block text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    About Me
                  </Link>
                  <Link
                    to="/projects"
                    className="block text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    My Projects
                  </Link>
                  <Link
                    to="/experience"
                    className="block text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    Experience
                  </Link>
                  <Link
                    to="/contact"
                    className="block text-accent-600 dark:text-accent-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </div>
              </motion.div>

              {/* Fun Element */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-12"
              >
                <div className="inline-flex items-center space-x-2 text-accent-500 dark:text-accent-500">
                  <Search className="h-5 w-5" />
                  <span className="text-sm">
                    Maybe try searching for what you need?
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
