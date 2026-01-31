import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function usePlayer() {
    return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
    const audioRef = useRef(new Audio());
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Initial dummy track to show UI working before upload
    const defaultTrack = {
        title: "Midnight City",
        artist: "M83",
        artwork: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTJMUVxZbFOZiKg4_SMoJTr0RNIBL58CEtN3MKfvFVpq1fgXnPcctYCxMqRuNJv1rmon9MYIYqKP2ddESe_ri8tyI37I--dBQVG4MOP9fJdEtTLvEPpb3XO8B_V67DD9Gzg2gf07I-I0meA0hPPQpyYuaXjaXuu5dHpeD_a1VMrRjGcCuDLPSbHe40_xtRvOvd8YpIEsenLayHn6fgUslhkrecIpk0x7sr006WgFeICmqZfgI-qDPc-5mNeW9RrAdzEMaB1KUAI0E",
        fileUrl: null // No audio for default dummy
    };

    useEffect(() => {
        // Initialize with default track info but no audio
        if (!currentTrack) {
            setCurrentTrack(defaultTrack);
        }

        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            setProgress(isNaN(progressPercent) ? 0 : progressPercent);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentTrack]);

    const togglePlay = () => {
        if (!currentTrack || !currentTrack.fileUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const uploadTrack = (file, metadata) => {
        const fileUrl = URL.createObjectURL(file);
        const newTrack = {
            ...metadata,
            fileUrl,
            // If user didn't provide artwork, use a placeholder or keep existing strategy
            artwork: metadata.artwork || defaultTrack.artwork
        };

        // Stop current
        audioRef.current.pause();
        setIsPlaying(false);

        // Set new source
        audioRef.current.src = fileUrl;
        audioRef.current.load();

        setCurrentTrack(newTrack);

        // Auto play
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Playback failed", e));
    };

    const seek = (percent) => {
        if (!audioRef.current.duration) return;
        const time = (percent / 100) * audioRef.current.duration;
        audioRef.current.currentTime = time;
        setProgress(percent);
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const value = {
        currentTrack,
        isPlaying,
        progress,
        currentTime,
        duration,
        togglePlay,
        uploadTrack,
        seek,
        formatTime
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
}
