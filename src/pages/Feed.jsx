import React from 'react';
import { useMonadBeat } from '../hooks/useMonadBeat';
import FeedItem from '../components/FeedItem';

export default function Feed() {
    const { useRandomTracks } = useMonadBeat();
    const { data: trackIds, isLoading, error } = useRandomTracks(5); // Fetch 5 random tracks for MVP

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-red-500">
                Error loadig feed: {error.message}
            </div>
        );
    }

    if (!trackIds || trackIds.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-[#9dadb9] flex-col gap-4">
                <span className="material-symbols-outlined text-6xl">queue_music</span>
                <p>No tracks found. Be the first to upload!</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 overflow-y-scroll snap-y-mandatory custom-scrollbar">
                {trackIds.map((id) => (
                    <FeedItem key={id.toString()} trackId={id} />
                ))}
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
