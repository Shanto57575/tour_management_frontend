import React, { useEffect, useState } from "react";
import {
  MapPin,
  ArrowRight,
  Star,
  Play,
  Users,
  Globe,
  Award,
} from "lucide-react";

// Enhanced star component for ratings
const StarIcon = ({ className }: { className?: string }) => (
  <Star className={`text-yellow-400 fill-yellow-400 ${className}`} />
);

// Floating animation component
const FloatingCard = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

// Animated counter component
const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = 0;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-br from-white via-purple-50/30 to-blue-50/20 dark:from-black dark:via-purple-950/20 dark:to-blue-950/10 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] opacity-60"></div>

      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/40 dark:bg-purple-800/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/40 dark:bg-blue-800/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-200/30 dark:bg-pink-800/15 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Enhanced Text Content */}
          <div
            className={`text-center md:text-left transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700 mb-6">
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                #1 Travel Management Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Your Journey Begins with{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400">
                  TrekOn
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-60"></div>
              </span>
            </h1>

            <p className="mt-8 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Discover breathtaking destinations and create unforgettable
              memories. TrekOn simplifies your tour management with
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {" "}
                AI-powered
              </span>{" "}
              planning, so you can focus on the adventure.
            </p>

            {/* Enhanced Stats */}
            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md mx-auto md:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter end={10} suffix="K+" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Happy Travelers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter end={200} suffix="+" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Destinations
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Satisfaction
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#get-started"
                className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-black transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Start Your Adventure
                <ArrowRight className="ml-2 -mr-1 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="#learn-more"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-lg font-semibold rounded-xl text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/70 hover:border-purple-300 dark:hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-black transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </a>
            </div>

            {/* Enhanced Social Proof */}
            <div className="mt-12 flex items-center justify-center md:justify-start gap-6">
              <div className="flex -space-x-3 overflow-hidden">
                {[
                  "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                  "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                ].map((src, index) => (
                  <img
                    key={index}
                    className="inline-block h-12 w-12 rounded-full ring-3 ring-white dark:ring-gray-800 hover:scale-110 transition-transform duration-300 cursor-pointer"
                    src={src}
                    alt={`Happy traveler ${index + 1}`}
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 mr-0.5" />
                  ))}
                  <span className="ml-2 font-bold text-gray-900 dark:text-white">
                    4.9
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Loved by <span className="font-bold">10,000+</span> travelers
                  worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Enhanced Image with Floating Cards */}
          <div
            className={`relative group transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Main Image Container */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm rounded-3xl p-1">
                <img
                  src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Happy travelers on a tour"
                  className="relative rounded-2xl shadow-2xl w-full h-full object-cover ring-1 ring-gray-900/10 dark:ring-white/10 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Floating Info Cards */}
            <FloatingCard delay={0} className="absolute -bottom-8 -left-8 z-20">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      200+ Destinations
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Explore amazing places
                    </p>
                  </div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={2} className="absolute -top-6 -right-6 z-20">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      Live Tours
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      24 active now
                    </p>
                  </div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={4} className="absolute top-1/2 -right-4 z-20">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      Global Reach
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      50+ countries
                    </p>
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-ping"></div>
            <div
              className="absolute bottom-12 right-12 w-6 h-6 bg-pink-400 rounded-full opacity-60 animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/3 left-8 w-4 h-4 bg-blue-400 rounded-full opacity-70 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
