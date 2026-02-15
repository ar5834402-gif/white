import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HeartRain } from "@/components/HeartRain";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <HeartRain />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-rose-600 mb-6 drop-shadow-sm font-handwriting">
            White Day Memories
          </h1>
          <p className="text-xl md:text-2xl text-rose-800/80 font-light max-w-2xl mx-auto font-serif italic">
            "Every moment with you is a gift I cherish forever."
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid gap-6 md:grid-cols-2 max-w-lg mx-auto"
        >
          {/* Couple Login Card */}
          <div className="glass-panel p-8 rounded-3xl transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-rose-900 mb-4 font-serif">Create Your Space</h2>
            <p className="text-rose-700/70 mb-8">
              Build a digital sanctuary of memories, coupons, and songs for your special someone.
            </p>
            <Link href="/login" className="w-full block">
              <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-6 text-lg shadow-lg shadow-rose-200">
                Log In
              </Button>
            </Link>
            <Link href="/register" className="block mt-4 text-sm text-rose-400 hover:text-rose-600 underline">
              Don't have an account? Sign up
            </Link>
          </div>

          {/* Girlfriend View Card */}
          <div className="glass-panel p-8 rounded-3xl transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-rose-900 mb-4 font-serif">View Gift</h2>
            <p className="text-rose-700/70 mb-8">
              Have you been given a special link? Enter here to see your surprise.
            </p>
            <Link href="/find-gift" className="w-full block">
              <Button variant="outline" className="w-full border-2 border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl py-6 text-lg">
                Find My Gift
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
    </div>
  );
}
