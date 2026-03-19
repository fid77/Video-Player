import React from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { Film, Github, PlayCircle } from 'lucide-react';

export default function App() {
  // Sample video and subtitle data
  const videoData = {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    subtitles: [
      {
        src: "https://raw.githubusercontent.com/andreyvit/subtitle-examples/master/vtt/example.vtt",
        label: "English",
        lang: "en"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Film className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tight text-lg">VisiPlayer</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Showcase</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </button>
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            THE ULTIMATE VIDEO EXPERIENCE.
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            A high-performance, customizable React video player built with Tailwind CSS and Framer Motion. 
            Smooth interactions, full control, and elegant design.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="bg-emerald-500 text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-400 transition-all hover:scale-105">
              <PlayCircle className="w-5 h-5" />
              Try Demo
            </button>
            <button className="border border-white/10 px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-all">
              View Source
            </button>
          </div>
        </section>

        {/* Player Section */}
        <section className="mb-24">
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-[3rem] -z-10" />
            <VideoPlayer 
              src={videoData.src}
              poster={videoData.poster}
              subtitles={videoData.subtitles}
            />
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Custom Controls",
              desc: "Fully accessible and stylable controls built from scratch using React state."
            },
            {
              title: "Smooth Animations",
              desc: "Powered by Framer Motion for fluid UI transitions and gesture support."
            },
            {
              title: "Subtitle Support",
              desc: "Native VTT track support with a custom selection menu for multiple languages."
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Film className="w-5 h-5" />
            <span className="font-bold tracking-tight">VisiPlayer</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 VisiPlayer. Built with passion for the web.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
