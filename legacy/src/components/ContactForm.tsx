import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle } from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const ContactForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      // TODO: Replace with actual form submission endpoint (Formspree, Netlify Forms, etc.)
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Form data:', data)
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-12"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-2">
          Message Sent!
        </h3>
        <p className="text-accent-600 dark:text-accent-400 mb-6">
          Thank you for reaching out. I'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="btn-primary"
        >
          Send Another Message
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="card space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-accent-900 dark:text-white mb-2">
          Send me a message
        </h3>
        <p className="text-accent-600 dark:text-accent-400">
          I'm always interested in new opportunities and collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-accent-900 dark:text-white"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Name is required' })}
            className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-accent-900 dark:text-white"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-accent-900 dark:text-white"
        >
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject', { required: 'Subject is required' })}
          className={`input-field ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="What's this about?"
        />
        {errors.subject && (
          <p className="text-red-500 text-sm">{errors.subject.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-accent-900 dark:text-white"
        >
          Message *
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message', { required: 'Message is required' })}
          className={`input-field resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Tell me about your project, opportunity, or just say hello..."
        />
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Message</span>
          </>
        )}
      </button>

      {/* Fallback Email Link */}
      <div className="text-center pt-4 border-t border-accent-200 dark:border-accent-700">
        <p className="text-sm text-accent-600 dark:text-accent-400 mb-2">
          Prefer email? Send me a message directly:
        </p>
        <a
          href="mailto:shriyash@shriyashsharma.com"
          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
        >
          <Mail className="h-4 w-4" />
          <span>shriyash@shriyashsharma.com</span>
        </a>
      </div>
    </motion.form>
  )
}

export default ContactForm
