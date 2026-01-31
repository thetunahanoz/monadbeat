import React, { useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function Feed() {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        progress,
        currentTime,
        duration,
        formatTime,
        seek
    } = usePlayer();

    const progressBarRef = useRef(null);

    const handleSeek = (e) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = Math.min(Math.max((x / width) * 100, 0), 100);
        seek(percent);
    };

    if (!currentTrack) return null;

    return (
        <>
            <div className="flex-1 overflow-y-scroll snap-y-mandatory custom-scrollbar">
                {/* Track 1 */}
                <section className="h-[calc(100vh-80px)] w-full flex items-center justify-center snap-start p-4 lg:p-8">
                    <div className="relative w-full max-w-[480px] h-full max-h-[750px] bg-[#1a2630] rounded-3xl overflow-hidden shadow-2xl border border-[#283239] flex flex-col">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${currentTrack.artwork}')` }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0f172a] opacity-90"></div>
                        </div>
                        <div className="relative z-10 p-6 flex justify-between items-start">
                            <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Premier</span>
                            </div>
                            <button className="size-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <span className="material-symbols-outlined text-white">more_vert</span>
                            </button>
                        </div>
                        <div className="relative z-10 mt-auto p-8 pt-20 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/95 to-transparent">
                            <div className="mb-6">
                                <h3 className="text-4xl font-bold leading-tight mb-2 tracking-tight line-clamp-2">{currentTrack.title}</h3>
                                <div className="flex items-center gap-2 text-[#9dadb9]">
                                    <span className="text-xl font-medium">{currentTrack.artist}</span>
                                    <span className="material-symbols-outlined text-primary text-[18px] filled">check_circle</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-6 mb-4">
                                <div className="flex items-end justify-center gap-1.5 h-16 w-full opacity-90">
                                    {Array(16).fill(0).map((_, i) => (
                                        <div key={i} className="visualizer-bar"></div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-8">
                                    <button className="text-white/60 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[32px]">skip_previous</span>
                                    </button>
                                    <button
                                        onClick={togglePlay}
                                        className="size-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(43,157,238,0.5)]"
                                    >
                                        <span className="material-symbols-outlined filled text-[40px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
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
                                <button className="size-10 flex items-center justify-center rounded-lg text-[#9dadb9] hover:text-upvote hover:bg-upvote/10 transition-all">
                                    <span className="material-symbols-outlined text-[32px] font-bold">keyboard_arrow_up</span>
                                </button>
                                <span className="text-sm font-bold text-upvote my-1">4.2k</span>
                                <button className="size-10 flex items-center justify-center rounded-lg text-[#9dadb9] hover:text-downvote hover:bg-downvote/10 transition-all">
                                    <span className="material-symbols-outlined text-[32px] font-bold">keyboard_arrow_down</span>
                                </button>
                            </div>
                            <button className="size-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-[24px]">forum</span>
                                <span className="text-[10px] font-bold mt-0.5">124</span>
                            </button>
                            <button className="size-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-[24px]">share</span>
                                <span className="text-[10px] font-bold mt-0.5">Share</span>
                            </button>
                            <button className="size-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-[24px]">playlist_add</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Track 2 */}
                <section className="h-[calc(100vh-80px)] w-full flex items-center justify-center snap-start p-4 lg:p-8">
                    <div className="relative w-full max-w-[480px] h-full max-h-[750px] bg-[#1a2630] rounded-3xl overflow-hidden shadow-2xl border border-[#283239] flex flex-col">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCX_WepNicmHb7N7hT4QrzQMYdyfKnTKgS8CeDFKan61gCsBNj0FjbLkXHhVk7J7Pdp83HrdJHfpw83RHYHQKZ-SbpvzCss77rjSJbHW4ASEPlBIW_CWtlYk8LRvlbf2Xp4x5aqIV-EdE5kVBnQtoxdQ6tzbVmw_eqJOtwPRo7LbDef0J7UF7eDV41MfxOyR0xgMbBOYf34Wo6_pqve5_3vc-MKOcew6ykvBhYNTTGcqz4Ni0FAEkmhdXVbUtGhcj5H-SIuLF4HYpc')" }}>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0f172a] opacity-90"></div>
                        </div>
                        <div className="relative z-10 p-6 flex justify-between items-start">
                            <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                                <span className="material-symbols-outlined text-green-400 text-[16px]">trending_up</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Rising Track</span>
                            </div>
                        </div>
                        <div className="relative z-10 mt-auto p-8 pt-20 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/95 to-transparent">
                            <div className="mb-6">
                                <h3 className="text-4xl font-bold leading-tight mb-2 tracking-tight">Neon Dreams</h3>
                                <div className="flex items-center gap-2 text-[#9dadb9]">
                                    <span className="text-xl font-medium">Cyber Collective</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-6 mb-4">
                                <div className="flex items-end justify-center gap-1.5 h-16 w-full opacity-40">
                                    <div className="w-1 bg-white/20 h-4 rounded-full"></div>
                                    <div className="w-1 bg-white/20 h-6 rounded-full"></div>
                                    <div className="w-1 bg-white/20 h-10 rounded-full"></div>
                                    <div className="w-1 bg-white/20 h-4 rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <button className="text-white/60"><span className="material-symbols-outlined text-[32px]">skip_previous</span></button>
                                    <button className="size-16 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                                        <span className="material-symbols-outlined filled text-[40px]">play_arrow</span>
                                    </button>
                                    <button className="text-white/60"><span className="material-symbols-outlined text-[32px]">skip_next</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <aside className="hidden xl:flex w-80 flex-col gap-6 p-8 border-l border-[#283239]/30 bg-[#111518]/30 overflow-y-auto">
                <div className="bg-[#1a2630]/60 backdrop-blur-md rounded-2xl p-5 border border-[#283239]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-lg">Coming Up</h3>
                        <button className="text-primary text-xs font-bold uppercase hover:underline">Full Queue</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <img alt="Art" className="size-12 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAIiaCVraoteMUlv-sWwNJIH3pULtCbn9OafJUdGwGWB5YxhPTymXF6xXr-EpjycMbwUf1q2K0jkMGmA7U074v4D8wUlSkQiPZU6hkSmWAbXefN8kyMH6aNjb6Gg9jUhh8MNKIi98I8tfj-f7NOz5RCno-BmlrelQLVWl86WUB8_rDIMcgDXlFLenU9IhAVzLUvN11mss40LC8Fxsij0aXlYTz6GKiLJyhGmfcZczh1QxL3WQCzQWU5Ia2JEEED66gRWDibfEXCKA" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">Ether Waves</p>
                                <p className="text-xs text-[#9dadb9]">Digital Soul</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <img alt="Art" className="size-12 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaovaHtIZiIk_vOFXW5BbbgfB3EdqDOHNEQZhh0lbvkuATavQYs-yd-WJH_BrwTcf60-20KTpAcKKnjU6iuYQMgsx2GHBU2LYzEi28quONwSnD-KCxFkwkCCTnm1TbO2qopQ7-_qI1O6NEyOXeEWdgO_wl76wbZhcIkgbGOqVt17OyNaxuLvt-A3CjcFbrPhLL2vSXXZREv42-97_aoBKzmLamSXSA5W0JCah48_5q_TJPgUIPVgpIlIEYuLGB-uLdQpDhj-hAYyI" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">Protocol 7</p>
                                <p className="text-xs text-[#9dadb9]">Node Runners</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-transparent rounded-2xl p-6 border border-primary/20">
                    <h4 className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Curator Rewards</h4>
                    <p className="text-xs text-[#9dadb9] leading-relaxed mb-4">Vote on trending tracks to earn $MON rewards from the discovery pool.</p>
                    <div className="flex -space-x-2">
                        <img alt="u1" className="size-8 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9tbW5Lkxw5IKGeZl8d7ShwnLGyev32R3xKhwHjk5lXjm6n9xBfjwiGZL8Tr70ReqqMmBdfhH3NkJRlulc58z5SL8AAS-RWnrcU6X_th-yQXvdma--of8bBma_adlp2ZRJiesOMLBQYt3i7wOcKP5Xj8CSjnYciBE-MEB8SaVh-DFc__oUAtX9vFp3cI9o8UBvNPkcc1JV7F4LuJNGZuTZO0IQ43zPwX3AMESrfDZSdGdf9fYeNb57rfbqm4XRLJFCB3zK-dWDT_s" />
                        <img alt="u2" className="size-8 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQTminZwf5IYeVXsArMMJS3jYIz2M6cdMd-Dwj9z3p56TYYW9RtzGkp8zbYA5eBrOe91DghIJ5a0yRE7zh9SsK7Il1U_CrVyTs_bjmT6zOOZX--9pdwxLwv9JQrhJJlXvcA7FNNcGqna963RT_WAZ1sOfm6CJM12beIw7chmaTCyGMmDplFeMV9w424HiUS5YzX0J08xaG858Dudh_fEkAXmBMU9iEPVDTuBxvkGScOiTLoAXwLJgF-e9dqp9Sv0FMII6NbYzD7dA" />
                        <div className="size-8 rounded-full border-2 border-background-dark bg-[#283239] flex items-center justify-center text-[10px] font-bold">+12</div>
                    </div>
                </div>
            </aside>
        </>
    );
}
