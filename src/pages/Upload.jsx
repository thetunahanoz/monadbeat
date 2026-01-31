import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMonadBeat } from '../hooks/useMonadBeat';
import { usePlayer } from '../context/PlayerContext';
import { uploadToPinata } from '../utils/pinata';

export default function Upload() {
    const navigate = useNavigate();
    const { uploadTrack } = usePlayer();
    const { mintTrack, isArtist, isConnected } = useMonadBeat();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");
    const [artwork, setArtwork] = useState(null);
    const [isMinting, setIsMinting] = useState(false);

    const artworkInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Auto-fill title if empty
            if (!title) {
                setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleArtworkSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setArtwork(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleGenreSelect = (selectedGenre) => {
        setGenre(selectedGenre);
    };

    const handleAddCustomGenre = () => {
        const custom = prompt("Enter custom genre:");
        if (custom) {
            setGenre(custom);
        }
    };

    const handlePublish = async () => {
        if (!file || !isConnected) return;
        if (!isArtist) {
            alert("Please register as an artist first (Go to Profile)");
            return;
        }

        setIsMinting(true);
        try {
            // Upload Audio
            console.log("Uploading audio to IPFS...");
            const audioHash = await uploadToPinata(file);
            console.log("Audio uploaded:", audioHash);

            // Upload Artwork (if exists)
            // Note: Currently contract only takes one hash. Ideally we'd upload metadata.json containing both.
            // For this Hackathon MVP, we'll store the AUTHORITATIVE hash as the Audio Hash.
            // A production version would require a Metadata Standard (ERC721 Metadata).

            // Peak start/end (30s default for now)
            const peakStart = 0;
            const peakEnd = 30;

            await mintTrack(audioHash, title, peakStart, peakEnd);
            alert("Track minted successfully!");
            navigate('/');
        } catch (error) {
            console.error("Minting failed:", error);
            alert("Failed to mint track. See console.");
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                <div className="max-w-3xl mx-auto space-y-10">
                    <header>
                        <h2 className="text-3xl font-bold mb-2">Upload Track</h2>
                        <p className="text-[#9dadb9]">Share your latest creation with the MonadBeat community.</p>
                    </header>

                    <section className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <span className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
                            Audio File
                        </h3>
                        <div
                            className="border-2 border-dashed border-[#283239] hover:border-primary/50 transition-colors rounded-2xl bg-[#1a2630]/30 p-12 text-center group cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="audio/mp3,audio/wav,audio/flac"
                                onChange={handleFileSelect}
                            />
                            <div className="size-16 rounded-full bg-[#1a2630] border border-[#283239] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className={`material-symbols-outlined ${file ? 'text-green-400' : 'text-primary'} text-3xl`}>
                                    {file ? 'check' : 'upload_file'}
                                </span>
                            </div>
                            <p className="text-lg font-bold mb-1">{file ? file.name : "Drag and drop audio file"}</p>
                            <p className="text-[#9dadb9] text-sm">MP3, WAV, or FLAC (Max 50MB)</p>
                            <button className="mt-6 px-6 py-2 bg-primary hover:bg-primary/90 rounded-full font-bold text-sm transition-colors">
                                {file ? "Change File" : "Select File"}
                            </button>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <span className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                            Track Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#9dadb9] uppercase tracking-wider">Track Title</label>
                                <input
                                    className="w-full bg-[#1a2630] border-[#283239] rounded-xl focus:ring-primary focus:border-primary text-white p-2"
                                    placeholder="Enter track name"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#9dadb9] uppercase tracking-wider">Artist Name</label>
                                <input
                                    className="w-full bg-[#1a2630] border-[#283239] rounded-xl focus:ring-primary focus:border-primary text-white p-2"
                                    placeholder="Original Artist"
                                    type="text"
                                    value={artist}
                                    onChange={(e) => setArtist(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9dadb9] uppercase tracking-wider">Genre</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {['Electronic', 'Synthwave', 'Lo-Fi', 'Hip Hop', 'Techno'].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => handleGenreSelect(g)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${genre === g ? 'bg-primary text-white border border-primary' : 'bg-[#1a2630] border border-[#283239] text-[#9dadb9] hover:border-primary/50'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                                {genre && !['Electronic', 'Synthwave', 'Lo-Fi', 'Hip Hop', 'Techno'].includes(genre) && (
                                    <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold border border-primary">
                                        {genre}
                                    </button>
                                )}
                                <button
                                    onClick={handleAddCustomGenre}
                                    className="px-4 py-1.5 rounded-full bg-[#1a2630] border border-dashed border-[#283239] text-[#9dadb9] text-xs font-bold hover:text-white flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span> Add Custom
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9dadb9] uppercase tracking-wider">Track Description</label>
                            <textarea
                                className="w-full bg-[#1a2630] border-[#283239] rounded-xl focus:ring-primary focus:border-primary text-white resize-none p-2"
                                placeholder="Tell the story behind this track..."
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <span className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">3</span>
                            Artwork
                        </h3>
                        <div className="flex items-start gap-6">
                            <div
                                className="size-40 shrink-0 rounded-2xl bg-[#1a2630] border border-[#283239] flex flex-col items-center justify-center text-[#9dadb9] relative group overflow-hidden border-dashed cursor-pointer"
                                onClick={() => artworkInputRef.current.click()}
                                style={artwork ? { backgroundImage: `url(${artwork})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                            >
                                <input
                                    type="file"
                                    ref={artworkInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleArtworkSelect}
                                />
                                {!artwork && (
                                    <>
                                        <span className="material-symbols-outlined text-3xl mb-1">image</span>
                                        <span className="text-[10px] font-bold">1:1 Ratio</span>
                                    </>
                                )}
                                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${artwork ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <span className="text-xs font-bold text-white">{artwork ? "Change Cover" : "Upload Cover"}</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 pt-2">
                                <p className="text-sm text-[#9dadb9] leading-relaxed">Please provide a high-quality square image. This will be the main visual representation of your track across the platform.</p>
                                <ul className="text-xs text-[#9dadb9] space-y-2 list-disc pl-4">
                                    <li>Recommended: 1500 x 1500 px</li>
                                    <li>Supported formats: JPG, PNG</li>
                                    <li>Max file size: 5MB</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-[#283239] flex items-center justify-between">
                        <p className="text-xs text-[#9dadb9]">By clicking Upload, you agree to our Terms of Service.</p>
                        <button
                            onClick={handlePublish}
                            disabled={!file}
                            className={`px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(43,157,238,0.3)] transition-all transform hover:-translate-y-0.5 ${!file ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-primary hover:bg-primary/90 text-white'}`}
                        >
                            {isMinting ? "Minting NFT..." : "Mint & Publish Track"}
                        </button>
                    </div>
                </div>
            </div>

            <aside className="hidden xl:flex w-80 flex-col gap-6 p-8 border-l border-[#283239]/30 bg-[#111518]/30 overflow-y-auto">
                <div className="space-y-6">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
                        <h3 className="text-primary font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">lightbulb</span>
                            Guidelines
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold">Original Work Only</p>
                                    <p className="text-xs text-[#9dadb9] mt-1 leading-relaxed">Ensure you own all rights to the uploaded music and components.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold">Quality Matters</p>
                                    <p className="text-xs text-[#9dadb9] mt-1 leading-relaxed">Upload at least 320kbps MP3 or lossless WAV for better user experience.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold">Metadata accuracy</p>
                                    <p className="text-xs text-[#9dadb9] mt-1 leading-relaxed">Clear titles and correct genres help your track reach the right audience.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[#1a2630]/60 backdrop-blur-md rounded-2xl p-5 border border-[#283239]">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Submission Queue</h3>
                        <div className="flex items-center gap-4 text-[#9dadb9]">
                            <span className="material-symbols-outlined">schedule</span>
                            <span className="text-xs font-medium">Est. Review Time: ~12 Hours</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#1a2630] to-transparent rounded-2xl p-6 border border-[#283239]">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Creator Perks</h4>
                        <p className="text-xs text-[#9dadb9] leading-relaxed mb-4">High-quality uploads that trend in the top 10 receive bonus $MON distribution.</p>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase cursor-pointer hover:underline">
                            Learn More <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
