import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export const uploadToPinata = async (file) => {
    if (!PINATA_JWT) {
        throw new Error("Pinata JWT is missing. Please add VITE_PINATA_JWT to your .env file.");
    }

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${PINATA_JWT}`
            }
        });
        return res.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw error;
    }
};
