import React, { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { useMonadBeat } from '../hooks/useMonadBeat';
import MonadBeatABI from '../abi/MonadBeat.json';

export default function Profile() {
    const { isArtist, artistProfile, registerArtist, address, isConnected, CONTRACT_ADDRESS } = useMonadBeat();
    const publicClient = usePublicClient();
    const [isRegistering, setIsRegistering] = useState(false);
    const [artistName, setArtistName] = useState("");
    const [activities, setActivities] = useState([]);
    const [isLoadingActivity, setIsLoadingActivity] = useState(false);

    useEffect(() => {
        if (!isConnected || !address || !publicClient) return;

        const fetchActivity = async () => {
            setIsLoadingActivity(true);
            try {
                // Fetch Voted events where voter is our address
                const voteLogs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESS,
                    event: MonadBeatABI.abi.find(x => x.name === 'Voted' || x.name === 'VoteChanged'),
                    args: { voter: address },
                    fromBlock: 0n,
                    toBlock: 'latest'
                });

                // Fetch TrackMinted events where artist is our address
                const mintLogs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESS,
                    event: MonadBeatABI.abi.find(x => x.name === 'TrackMinted'),
                    args: { artist: address },
                    fromBlock: 0n,
                    toBlock: 'latest'
                });

                const allActivities = [
                    ...voteLogs.map(log => ({
                        type: 'vote',
                        trackId: log.args.trackId,
                        isUpvote: log.args.isUpvote ?? log.args.newIsUpvote,
                        timestamp: 'On-chain', // In real app we'd fetch block timestamp
                        id: `vote-${log.transactionHash}-${log.logIndex}`
                    })),
                    ...mintLogs.map(log => ({
                        type: 'mint',
                        trackId: log.args.trackId,
                        title: log.args.title,
                        timestamp: 'On-chain',
                        id: `mint-${log.transactionHash}-${log.logIndex}`
                    }))
                ].reverse(); // Newest first (logs are chronological)

                setActivities(allActivities);
            } catch (error) {
                console.error("Error fetching activity:", error);
            } finally {
                setIsLoadingActivity(false);
            }
        };

        fetchActivity();
    }, [address, isConnected, publicClient, CONTRACT_ADDRESS]);

    const handleRegister = async () => {
        if (!artistName) return;
        setIsRegistering(true);
        try {
            await registerArtist(artistName);
            // In a real app we'd wait for receipt and refetch but simplified here
        } catch (error) {
            console.error(error);
        } finally {
            setIsRegistering(false);
        }
    };

    if (isConnected && !isArtist) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="max-w-md w-full bg-[#1a2630] p-8 rounded-3xl border border-[#283239] text-center">
                    <span className="material-symbols-outlined text-6xl text-primary mb-4">artist</span>
                    <h2 className="text-2xl font-bold mb-2">Become a Monad Artist</h2>
                    <p className="text-[#9dadb9] mb-8">Register your profile to start uploading tracks and earning reputation.</p>

                    <input
                        type="text"
                        placeholder="Artist Name"
                        className="w-full bg-[#111518] border border-[#283239] p-3 rounded-xl mb-4 text-white focus:border-primary outline-none"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                    />

                    <button
                        onClick={handleRegister}
                        disabled={isRegistering || !artistName}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        {isRegistering ? 'Registering...' : 'Register Profile'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="relative h-64 w-full">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTJMUVxZbFOZiKg4_SMoJTr0RNIBL58CEtN3MKfvFVpq1fgXnPcctYCxMqRuNJv1rmon9MYIYqKP2ddESe_ri8tyI37I--dBQVG4MOP9fJdEtTLvEPpb3XO8B_V67DD9Gzg2gf07I-I0meA0hPPQpyYuaXjaXuu5dHpeD_a1VMrRjGcCuDLPSbHe40_xtRvOvd8YpIEsenLayHn6fgUslhkrecIpk0x7sr006WgFeICmqZfgI-qDPc-5mNeW9RrAdzEMaB1KUAI0E')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row items-end gap-6">
                    <div className="relative group">
                        <div className="size-32 rounded-3xl bg-cover bg-center border-4 border-background-dark shadow-2xl relative z-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGtga_Ea_VqPMdPvz8zXBFVbuC5-rNS44phFFzx5ckOJgME-ILhifYl6ZlkmezzHQ6CTS11oECDCh_9_KMsIKoz4Fveu503AnjD9uT_iKQhzskhTw1JTjz0L3FeuajLJRW-dIpU2eeSS5ouIZgbx9pXsDwVZRjVZoS9I2oHeJA8wt7sHnDTvKP8eMzKgnRqMpwcR1xU75YJ0jvboRhlsiQ1-tliiHc3qFvTY12ifb3aADr9WTOO7MlvX4NbVS9NaRfOyRabL5cseU')" }}></div>
                        <div className="absolute -bottom-2 -right-2 z-20 size-8 rounded-full bg-primary flex items-center justify-center border-2 border-background-dark">
                            <span className="material-symbols-outlined text-[16px] text-white filled">verified</span>
                        </div>
                    </div>
                    <div className="flex-1 mb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-4xl font-black tracking-tight">{artistProfile ? artistProfile[0] : "Monad Artist"}</h2>

                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-widest">Top Curator</span>
                        </div>
                        <p className="text-[#9dadb9] max-w-lg">Synthesizing the future of sound on Monad. Web3 music enthusiast & early discovery specialist. 🎧</p>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <button className="px-6 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all flex items-center gap-2">
                            <span>Follow</span>
                        </button>
                        <button className="size-11 rounded-xl bg-[#1a2630] border border-[#283239] hover:border-primary/50 flex items-center justify-center transition-all">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="px-8 py-6 border-b border-[#283239]/30 flex items-center gap-12 bg-[#111518]/30">
                <div className="flex flex-col">
                    <span className="text-2xl font-black">12.4k</span>
                    <span className="text-xs font-bold text-[#9dadb9] uppercase tracking-widest">Followers</span>
                </div>
                <div className="flex flex-col border-l border-[#283239]/50 pl-12">
                    <span className="text-2xl font-black">842</span>
                    <span className="text-xs font-bold text-[#9dadb9] uppercase tracking-widest">Following</span>
                </div>
                <div className="flex flex-col border-l border-[#283239]/50 pl-12">
                    <span className="text-2xl font-black">{artistProfile ? artistProfile[2].toString() : "0"}</span>
                    <span className="text-xs font-bold text-[#9dadb9] uppercase tracking-widest">Tracks</span>
                </div>
                <div className="flex flex-col border-l border-[#283239]/50 pl-12">
                    <span className="text-2xl font-black text-primary">0</span>
                    <span className="text-xs font-bold text-[#9dadb9] uppercase tracking-widest">Reputation</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 max-w-[1600px] mx-auto">
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            Activity Feed
                        </h3>
                        <div className="flex bg-[#1a2630] p-1 rounded-lg border border-[#283239]">
                            <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#283239] text-white">All</button>
                            <button className="px-4 py-1.5 rounded-md text-xs font-bold text-[#9dadb9] hover:text-white transition-colors">Upvotes</button>
                            <button className="px-4 py-1.5 rounded-md text-xs font-bold text-[#9dadb9] hover:text-white transition-colors">Comments</button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {isLoadingActivity ? (
                            <div className="text-[#9dadb9] animate-pulse">Fetching on-chain history...</div>
                        ) : activities.length === 0 ? (
                            <div className="text-[#9dadb9] py-10 text-center bg-[#1a2630]/30 rounded-2xl border border-dashed border-[#283239]">
                                No activity found yet. Start interacting with the feed!
                            </div>
                        ) : activities.map((activity) => (
                            <div key={activity.id} className="relative flex gap-4 activity-line">
                                <style>{`.activity-line::before { content: ''; position: absolute; left: 19px; top: 40px; bottom: 0; width: 2px; background: #283239; }`}</style>
                                <div className={`size-10 rounded-full ${activity.type === 'vote' ? (activity.isUpvote ? 'bg-upvote/20 border-upvote/30' : 'bg-downvote/20 border-downvote/30') : 'bg-primary/20 border-primary/30'} flex items-center justify-center shrink-0 z-10 border`}>
                                    <span className="material-symbols-outlined text-[20px] filled">
                                        {activity.type === 'vote' ? (activity.isUpvote ? 'keyboard_arrow_up' : 'keyboard_arrow_down') : 'add_circle'}
                                    </span>
                                </div>
                                <div className="flex-1 bg-[#1a2630]/50 border border-[#283239] rounded-2xl p-4 hover:border-primary/30 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-medium">
                                            {activity.type === 'vote'
                                                ? <>{activity.isUpvote ? 'Upvoted' : 'Downvoted'} Track <span className="text-white font-bold">#{activity.trackId.toString()}</span></>
                                                : <>Minted Track <span className="text-white font-bold">{activity.title}</span></>
                                            }
                                        </p>
                                        <span className="text-[10px] text-[#9dadb9] font-bold uppercase">{activity.timestamp}</span>
                                    </div>
                                    <div className="flex items-center gap-4 bg-background-dark/50 rounded-xl p-3 border border-[#283239]/50">
                                        <div className="size-12 rounded-lg bg-[#283239] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[#9dadb9]">music_note</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{activity.type === 'mint' ? activity.title : `Track #${activity.trackId.toString()}`}</p>
                                            <p className="text-xs text-[#9dadb9]">On-chain Activity</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Curated Collections</h3>
                            <button className="text-xs font-bold text-primary hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] border border-[#283239] cursor-pointer">
                                <img alt="playlist" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX_WepNicmHb7N7hT4QrzQMYdyfKnTKgS8CeDFKan61gCsBNj0FjbLkXHhVk7J7Pdp83HrdJHfpw83RHYHQKZ-SbpvzCss77rjSJbHW4ASEPlBIW_CWtlYk8LRvlbf2Xp4x5aqIV-EdE5kVBnQtoxdQ6tzbVmw_eqJOtwPRo7LbDef0J7UF7eDV41MfxOyR0xgMbBOYf34Wo6_pqve5_3vc-MKOcew6ykvBhYNTTGcqz4Ni0FAEkmhdXVbUtGhcj5H-SIuLF4HYpc" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <p className="font-bold text-lg">Cyberpunk Vibes</p>
                                    <p className="text-xs text-[#9dadb9] font-bold uppercase">42 Tracks • 1.2k Saves</p>
                                </div>
                                <div className="absolute top-4 right-4 size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white filled">play_arrow</span>
                                </div>
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] border border-[#283239] cursor-pointer">
                                <img alt="playlist" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaovaHtIZiIk_vOFXW5BbbgfB3EdqDOHNEQZhh0lbvkuATavQYs-yd-WJH_BrwTcf60-20KTpAcKKnjU6iuYQMgsx2GHBU2LYzEi28quONwSnD-KCxFkwkCCTnm1TbO2qopQ7-_qI1O6NEyOXeEWdgO_wl76wbZhcIkgbGOqVt17OyNaxuLvt-A3CjcFbrPhLL2vSXXZREv42-97_aoBKzmLamSXSA5W0JCah48_5q_TJPgUIPVgpIlIEYuLGB-uLdQpDhj-hAYyI" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <p className="font-bold text-lg">Etherial Dreams</p>
                                    <p className="text-xs text-[#9dadb9] font-bold uppercase">18 Tracks • 856 Saves</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-transparent rounded-2xl p-6 border border-primary/20">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Curation Rewards</h4>
                        </div>
                        <p className="text-xs text-[#9dadb9] leading-relaxed mb-4">Alex has earned 4,500 $MON by being among the first to upvote tracks that eventually trended.</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[75%]"></div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] font-bold text-[#9dadb9]">LVL 4 CURATOR</span>
                            <span className="text-[10px] font-bold text-primary">750/1000 XP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
