import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Subtitles,
  RotateCcw,
  RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  src: string;
  subtitles?: {
    src: string;
    label: string;
    lang: string;
  }[];
  poster?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, subtitles, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const handleSubtitleToggle = (lang: string | null) => {
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = tracks[i].language === lang ? 'showing' : 'hidden';
      }
      setActiveSubtitle(lang);
      setShowSubtitleMenu(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative group bg-black rounded-xl overflow-hidden shadow-2xl aspect-video max-w-4xl mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      id="video-container"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      >
        {subtitles?.map((sub) => (
          <track 
            key={sub.lang}
            kind="subtitles"
            src={sub.src}
            srcLang={sub.lang}
            label={sub.label}
          />
        ))}
      </video>

      {/* Overlay Play/Pause indicator */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-full">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12"
            id="controls-overlay"
          >
            {/* Progress Bar */}
            <div className="relative group/progress mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:h-2 transition-all"
                style={{
                  background: `linear-gradient(to right, #10b981 ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className="text-white hover:text-emerald-400 transition-colors p-1"
                  id="play-pause-btn"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>

                <div className="flex items-center gap-2">
                  <button onClick={() => skip(-10)} className="text-white/80 hover:text-white transition-colors">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button onClick={() => skip(10)} className="text-white/80 hover:text-white transition-colors">
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 group/volume">
                  <button onClick={toggleMute} className="text-white hover:text-emerald-400 transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                    className={`text-white hover:text-emerald-400 transition-colors p-1 ${activeSubtitle ? 'text-emerald-400' : ''}`}
                    id="subtitle-btn"
                  >
                    <Subtitles className="w-6 h-6" />
                  </button>
                  
                  <AnimatePresence>
                    {showSubtitleMenu && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute bottom-full right-0 mb-2 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-lg p-2 min-w-[120px] shadow-xl"
                      >
                        <button 
                          onClick={() => handleSubtitleToggle(null)}
                          className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${!activeSubtitle ? 'bg-emerald-500 text-white' : 'text-zinc-400 hover:bg-white/5'}`}
                        >
                          Off
                        </button>
                        {subtitles?.map((sub) => (
                          <button 
                            key={sub.lang}
                            onClick={() => handleSubtitleToggle(sub.lang)}
                            className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${activeSubtitle === sub.lang ? 'bg-emerald-500 text-white' : 'text-zinc-400 hover:bg-white/5'}`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={toggleFullscreen}
                  className="text-white hover:text-emerald-400 transition-colors p-1"
                  id="fullscreen-btn"
                >
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
