import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from 'react-router-dom';

import { 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  ChevronUp,

} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext';


export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [activeDemo, setActiveDemo] = useState(0)
  const { user}=useAuth();
  const navigate= useNavigate();



  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/auth')
    }
  }

  

  //  useEffect(() => {
  //   if (!loading && user) {
  //     // User is signed in → Redirect to dashboard
  //     navigate('/dashboard')
  //   }
  // }, [user, loading, navigate])

  const features = [
    {
      icon: Target,
      title: 'Smart Habit Tracking',
      description: 'Create and track daily or weekly habits with intelligent progress monitoring and streak counting.'
    },
    {
      icon: Users,
      title: 'Social Accountability',
      description: 'Follow friends, share progress, and stay motivated through community support and friendly competition.'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Visualize your progress with detailed charts, completion rates, and personalized insights.'
    },
    {
      icon: CheckCircle,
      title: 'Goal Achievement',
      description: 'Set meaningful goals and celebrate milestones with our comprehensive achievement system.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fitness Enthusiast',
      content: 'HabitFlow transformed my daily routine. The social features keep me accountable and motivated!',
      avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Mike Chen',
      role: 'Productivity Coach',
      content: 'The analytics dashboard provides incredible insights into my habit patterns. Highly recommended!',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Emily Davis',
      role: 'Student',
      content: 'Following friends and seeing their progress creates such a positive, supportive environment.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ]

  const faqs = [
    {
      question: 'How does the social accountability feature work?',
      answer: 'You can follow friends and family members to see their habit progress. When someone you follow completes a habit, you\'ll get a notification to celebrate their success and stay motivated for your own goals.'
    },
    {
      question: 'Can I track multiple types of habits?',
      answer: 'Absolutely! HabitFlow supports daily, weekly, and custom frequency habits. Whether it\'s exercise, reading, meditation, or any personal goal, you can track it all in one place.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes, we take privacy seriously. Your personal habit data is encrypted and never shared without your explicit consent. You control who can see your progress through our privacy settings.'
    },
    {
      question: 'Can I use HabitFlow offline?',
      answer: 'HabitFlow works offline for basic tracking. When you\'re back online, your data automatically syncs across all your devices.'
    },
    {
      question: 'What analytics do you provide?',
      answer: 'We provide completion rates, streak tracking, weekly/monthly summaries, habit correlations, and personalized insights to help you understand your progress patterns.'
    }
  ]

  const demoItems = [
    {
      title: 'Track Daily Progress',
      description: 'Mark habits complete and watch your streaks grow',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=500&h=300'
    },
    {
      title: 'Follow Friends',
      description: 'Stay motivated with social accountability',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=300'
    },
    {
      title: 'View Analytics',
      description: 'Understand your patterns with detailed insights',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&h=300'
    }
  ]


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                HabitFlow
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
      <ScrollLink to="features" smooth={true} duration={500} className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
        Features
      </ScrollLink>

      <ScrollLink to="testimonials" smooth={true} duration={500} className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
        Testimonials
      </ScrollLink>

      <ScrollLink
        to="hero"
        smooth={true}
        duration={500}
        className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
        onClick={() => setIsMenuOpen(false)}
      >
        About
      </ScrollLink>

       <button
      onClick={handleClick}
      className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
    >
      Get Started
    </button>
    </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {/* Mobile Navigation */}
{isMenuOpen && (
  <div className="md:hidden bg-white border-t border-gray-200">
    <div className="px-2 pt-2 pb-3 space-y-1">
      <ScrollLink
        to="features"
        smooth={true}
        duration={500}
        className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
        onClick={() => setIsMenuOpen(false)}
      >
        Features
      </ScrollLink>

      <ScrollLink
        to="testimonials"
        smooth={true}
        duration={500}
        className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
        onClick={() => setIsMenuOpen(false)}
      >
        Testimonials
      </ScrollLink>

      <ScrollLink
        to="hero"
        smooth={true}
        duration={500}
        className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
        onClick={() => setIsMenuOpen(false)}
      >
        About
      </ScrollLink>

      <Link
        to="/auth"
        className="block px-3 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg text-center"
        onClick={() => setIsMenuOpen(false)}
      >
        Get Started
      </Link>
    </div>
  </div>
)}

        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Better Habits,
              <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {' '}Together
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your life with HabitFlow - the social habit tracker that combines personal growth 
              with community accountability. Track progress, follow friends, and achieve your goals together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleClick}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Image/Animation */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-6 w-6 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-900">Daily Exercise</span>
                  </div>
                  <div className="text-sm text-purple-700">7 day streak 🔥</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-6 w-6 text-cyan-600 mr-2" />
                    <span className="font-semibold text-cyan-900">Read 30 Minutes</span>
                  </div>
                  <div className="text-sm text-cyan-700">12 day streak 🔥</div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    <span className="font-semibold text-green-900">Meditation</span>
                  </div>
                  <div className="text-sm text-green-700">5 day streak 🔥</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}

      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See HabitFlow in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience how easy it is to track habits and stay motivated with our interactive demo
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex border-b border-gray-200">
                {demoItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDemo(index)}
                    className={`flex-1 px-6 py-4 text-left transition-colors ${
                      activeDemo === index 
                        ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm opacity-75">{item.description}</div>
                  </button>
                ))}
              </div>
              
              <div className="p-8">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={demoItems[activeDemo].image}
                    alt={demoItems[activeDemo].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you build lasting habits and achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about HabitFlow
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 animate-in slide-in-from-top duration-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say about their HabitFlow journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of users who are already building better habits with HabitFlow
          </p>
          <button
            onClick={handleClick}
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">HabitFlow</span>
            </div>
            <div className="text-gray-400">
              © 2024 HabitFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}