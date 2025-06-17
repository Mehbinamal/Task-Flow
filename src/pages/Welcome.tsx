
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Calendar, Timer, BarChart3, RefreshCw, Heart, Moon, ArrowRight, Zap, Users, Shield } from 'lucide-react';

const Welcome = () => {
  const features = [
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Organize and track your daily tasks with ease',
      color: 'bg-blue-500'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Plan your day with intelligent scheduling features',
      color: 'bg-green-500'
    },
    {
      icon: Timer,
      title: 'Focus Timer',
      description: 'Stay focused with Pomodoro technique and time tracking',
      color: 'bg-orange-500'
    },
    {
      icon: RefreshCw,
      title: 'Routine Builder',
      description: 'Create and manage your daily routines',
      color: 'bg-purple-500'
    },
    {
      icon: Heart,
      title: 'Wellness Breaks',
      description: 'Take care of yourself with scheduled wellness activities',
      color: 'bg-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track your productivity with detailed insights',
      color: 'bg-indigo-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Users' },
    { number: '95%', label: 'Productivity Boost' },
    { number: '24/7', label: 'Support' },
    { number: '99.9%', label: 'Uptime' }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Boost Productivity',
      description: 'Increase your daily output by up to 40% with our proven methods'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team and share progress in real-time'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with enterprise-grade security'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
            <Zap className="h-4 w-4 mr-2" />
            Transform Your Productivity Today
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Your all-in-one productivity companion designed to help you stay organized, focused, and balanced. 
            Join thousands who've transformed their daily workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button asChild size="lg" className="text-lg px-8 py-4 hover:scale-105 transition-transform">
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 hover:scale-105 transition-transform">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${feature.color} rounded-xl shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-16 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose TaskFlow?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience the difference with our powerful features
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Ready to Transform Your Productivity?
              </CardTitle>
              <CardDescription className="text-xl text-blue-100">
                Join thousands of users who have already improved their daily workflow with TaskFlow.
                Start your free trial today - no credit card required.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                  <Link to="/signup">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                  <Link to="/login">
                    Watch Demo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
