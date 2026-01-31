import React, { useRef, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { usePlayer } from '../context/PlayerContext';
import { useMonadBeat } from '../hooks/useMonadBeat';

export default function FeedItem({ trackId }) {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        playTrack,
        progress: globalProgress,
        currentTime: globalCurrentTime,
        duration: globalDuration,
        formatTime,
        seek
    } = usePlayer();

    const { getTrackContractConfig, getVotesContractConfig, upvote, downvote } = useMonadBeat();
    const progressBarRef = useRef(null);

    // Fetch Track Data
    const { data: trackData, isLoading: isLoadingTrack } = useReadContract(getTrackContractConfig(trackId));

    // Fetch Votes
    const { data: votesData, refetch: refetchVotes } = useReadContract(getVotesContractConfig(trackId));

    const isCurrentTrack = currentTrack?.id === trackId.toString();
    const progress = isCurrentTrack ? globalProgress : 0;
    const currentTime = isCurrentTrack ? globalCurrentTime : 0;
    const duration = isCurrentTrack ? globalDuration : 0;

    const handlePlayPause = () => {
        if (isCurrentTrack) {
            togglePlay(`https://ipfs.io/ipfs/${trackData[1]}`);
        } else if (trackData) {

            console.log(`https://ipfs.io/ipfs/${trackData[1]}`)
            playTrack({
                id: trackId.toString(),
                title: trackData[2], // title
                artist: trackData[0], // artist address for now, ideally fetch name
                artwork: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTJMUVxZbFOZiKg4_SMoJTr0RNIBL58CEtN3MKfvFVpq1fgXnPcctYCxMqRuNJv1rmon9MYIYqKP2ddESe_ri8tyI37I--dBQVG4MOP9fJdEtTLvEPpb3XO8B_V67DD9Gzg2gf07I-I0meA0hPPQpyYuaXjaXuu5dHpeD_a1VMrRjGcCuDLPSbHe40_xtRvOvd8YpIEsenLayHn6fgUslhkrecIpk0x7sr006WgFeICmqZfgI-qDPc-5mNeW9RrAdzEMaB1KUAI0E", // Mock artwork for now
                src: `https://ipfs.io/ipfs/${trackData[1]}` // Using public IPFS gateway for broader compatibility
            });
        }
    };

    const handleSeek = (e) => {
        if (!isCurrentTrack || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = Math.min(Math.max((x / width) * 100, 0), 100);
        seek(percent);
    };

    const handleUpvote = async () => {
        try {
            await upvote(trackId);
            refetchVotes();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDownvote = async () => {
        try {
            await downvote(trackId);
            refetchVotes();
        } catch (e) {
            console.error(e);
        }
    };

    if (isLoadingTrack || !trackData) {
        return (
            <section className="h-[calc(100vh-80px)] w-full flex items-center justify-center snap-start p-4 lg:p-8">
                <div className="text-white animate-pulse">Loading Track...</div>
            </section>
        );
    }

    // Unpack track data
    // Struct: [artist, ipfsHash, title, peakStart, peakEnd, netScore]
    const [artistAddress, ipfsHash, title] = trackData;

    // Unpack votes data
    const upvotes = votesData ? Number(votesData[0]) : 0;
    const downvotes = votesData ? Number(votesData[1]) : 0;
    const netScore = votesData ? Number(votesData[2]) : 0;

    return (
        <section className="h-[calc(100vh-80px)] w-full flex items-center justify-center snap-start p-4 lg:p-8">
            <div className="relative w-full max-w-[480px] h-full max-h-[750px] bg-[#1a2630] rounded-3xl overflow-hidden shadow-2xl border border-[#283239] flex flex-col">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTJMUVxZbFOZiKg4_SMoJTr0RNIBL58CEtN3MKfvFVpq1fgXnPcctYCxMqRuNJv1rmon9MYIYqKP2ddESe_ri8tyI37I--dBQVG4MOP9fJdEtTLvEPpb3XO8B_V67DD9Gzg2gf07I-I0meA0hPPQpyYuaXjaXuu5dHpeD_a1VMrRjGcCuDLPSbHe40_xtRvOvd8YpIEsenLayHn6fgUslhkrecIpk0x7sr006WgFeICmqZfgI-qDPc-5mNeW9RrAdzEMaB1KUAI0E')` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0f172a] opacity-90"></div>
                </div>

                <div className="relative z-10 p-6 flex justify-between items-start">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                        <span className="text-xs font-bold uppercase tracking-wider">MonadBeat</span>
                    </div>
                </div>

                <div className="relative z-10 mt-auto p-8 pt-20 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/95 to-transparent">
                    <div className="mb-6">
                        <h3 className="text-4xl font-bold leading-tight mb-2 tracking-tight line-clamp-2">{title}</h3>
                        <div className="flex items-center gap-2 text-[#9dadb9]">
                            <span className="text-xl font-medium">{`${artistAddress.substring(0, 6)}...${artistAddress.substring(38)}`}</span>
                            <span className="material-symbols-outlined text-primary text-[18px] filled">check_circle</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 mb-4">
                        <div className="flex items-center gap-8">
                            <button className="text-white/60 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[32px]">skip_previous</span>
                            </button>
                            <button
                                onClick={handlePlayPause}
                                className="size-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(43,157,238,0.5)]"
                            >
                                <span className="material-symbols-outlined filled text-[40px]">
                                    {isCurrentTrack && isPlaying ? 'pause' : 'play_arrow'}
                                </span>
                            </button>
                            <button className="text-white/60 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[32px]">skip_next</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div
                            ref={progressBarRef}
                            onClick={handleSeek}
                            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group/progress"
                        >
                            <div
                                className="h-full bg-primary rounded-full relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-[#9dadb9] font-bold">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6 items-center">
                    <div className="flex flex-col items-center bg-black/40 backdrop-blur-xl rounded-2xl py-3 px-2 border border-white/10">
                        <button onClick={handleUpvote} className="size-10 flex items-center justify-center rounded-lg text-[#9dadb9] hover:text-upvote hover:bg-upvote/10 transition-all">
                            <span className="material-symbols-outlined text-[32px] font-bold">keyboard_arrow_up</span>
                        </button>
                        <span className="text-sm font-bold text-upvote my-1">{netScore}</span>
                        <button onClick={handleDownvote} className="size-10 flex items-center justify-center rounded-lg text-[#9dadb9] hover:text-downvote hover:bg-downvote/10 transition-all">
                            <span className="material-symbols-outlined text-[32px] font-bold">keyboard_arrow_down</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
