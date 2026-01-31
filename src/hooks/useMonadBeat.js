import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import MonadBeatABI from '../abi/MonadBeat.json';

// You would typically move this to an environment variable
// For now we'll assume the contract address we deployed earlier
// Need to replace this with the actual deployed address
const CONTRACT_ADDRESS = import.meta.env.VITE_MONADBEAT_ADDRESS || "0x0D94f77a5d89f71dAdB3926E6a530ec6cd70aB34";

export function useMonadBeat() {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // Check if user is registered artist
    const { data: isArtist, refetch: refetchIsArtist } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: MonadBeatABI.abi,
        functionName: 'isArtist',
        args: [address],
        query: {
            enabled: !!address,
        }
    });

    // Get Artist Profile Data
    const { data: artistProfile, refetch: refetchArtistProfile } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: MonadBeatABI.abi,
        functionName: 'artists',
        args: [address],
        query: {
            enabled: !!address && !!isArtist,
        }
    });

    // Register Artist
    const registerArtist = async (name) => {
        try {
            const hash = await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: MonadBeatABI.abi,
                functionName: 'registerArtist',
                args: [name],
            });
            return hash;
        } catch (error) {
            console.error("Error registering artist:", error);
            throw error;
        }
    };

    // Mint Track
    const mintTrack = async (ipfsHash, title, peakStart, peakEnd) => {
        try {
            const hash = await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: MonadBeatABI.abi,
                functionName: 'mintTrack',
                args: [ipfsHash, title, peakStart, peakEnd],
            });
            return hash;
        } catch (error) {
            console.error("Error minting track:", error);
            throw error;
        }
    };

    // Upvote
    const upvote = async (trackId) => {
        try {
            const hash = await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: MonadBeatABI.abi,
                functionName: 'upvote',
                args: [trackId],
            });
            return hash;
        } catch (error) {
            console.error("Error upvoting:", error);
            throw error;
        }
    };

    // Downvote
    const downvote = async (trackId) => {
        try {
            const hash = await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: MonadBeatABI.abi,
                functionName: 'downvote',
                args: [trackId],
            });
            return hash;
        } catch (error) {
            console.error("Error downvoting:", error);
            throw error;
        }
    };

    // Get Random Tracks Hook
    const useRandomTracks = (count = 10) => {
        return useReadContract({
            address: CONTRACT_ADDRESS,
            abi: MonadBeatABI.abi,
            functionName: 'getRandomTracks',
            args: [count],
        });
    };

    // Get Track Details Helper (to be used with useReadContract in component)
    const getTrackContractConfig = (trackId) => ({
        address: CONTRACT_ADDRESS,
        abi: MonadBeatABI.abi,
        functionName: 'getTrack',
        args: [trackId],
    });

    // Get Track Votes Helper
    const getVotesContractConfig = (trackId) => ({
        address: CONTRACT_ADDRESS,
        abi: MonadBeatABI.abi,
        functionName: 'getVotes',
        args: [trackId],
    });

    return {
        address,
        isConnected,
        isArtist,
        artistProfile,
        refetchIsArtist,
        refetchArtistProfile,
        registerArtist,
        mintTrack,
        upvote,
        downvote,
        useRandomTracks,
        CONTRACT_ADDRESS,
        getTrackContractConfig,
        getVotesContractConfig,
        ABI: MonadBeatABI.abi
    };
}
