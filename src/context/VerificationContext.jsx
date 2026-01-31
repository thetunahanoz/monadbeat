import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Inquiry } from 'persona-react';

const VerificationContext = createContext();

export function useVerification() {
    return useContext(VerificationContext);
}

const PERSONA_TEMPLATE_ID = import.meta.env.VITE_PERSONA_TEMPLATE_ID || "itmpl_sandbox_template_id";
const PERSONA_ENVIRONMENT = import.meta.env.VITE_PERSONA_ENVIRONMENT || "sandbox";

export function VerificationProvider({ children }) {
    const { address, isConnected } = useAccount();
    const [isVerified, setIsVerified] = useState(false);
    const [isPersonaOpen, setIsPersonaOpen] = useState(false);

    // Load verification status from localStorage
    useEffect(() => {
        if (isConnected && address) {
            const savedStatus = localStorage.getItem(`kyc_verified_${address}`);
            if (savedStatus === 'true') {
                setIsVerified(true);
            } else {
                setIsVerified(false);
            }
        } else {
            setIsVerified(false);
        }
    }, [address, isConnected]);

    const verify = () => {
        if (isConnected && address) {
            setIsVerified(true);
            localStorage.setItem(`kyc_verified_${address}`, 'true');
            setIsPersonaOpen(false);
        }
    };

    const startVerification = () => {
        setIsPersonaOpen(true);
    };

    const checkVerification = () => {
        if (!isVerified) {
            startVerification();
            return false;
        }
        return true;
    };

    return (
        <VerificationContext.Provider value={{ isVerified, startVerification, verify, checkVerification, isPersonaOpen, setIsPersonaOpen }}>
            {children}
            {isPersonaOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ width: '100%', height: '100%', maxHeight: '800px', maxWidth: '600px', backgroundColor: 'white' }}>
                        <Inquiry
                            templateId={PERSONA_TEMPLATE_ID}
                            environment={PERSONA_ENVIRONMENT}
                            onLoad={() => console.log('Persona loaded')}
                            onComplete={({ inquiryId, status, fields }) => {
                                console.log('Persona Complete:', inquiryId, status);
                                verify();
                            }}
                            onCancel={() => setIsPersonaOpen(false)}
                            onError={(error) => console.error('Persona Error:', error)}
                        />
                    </div>
                </div>
            )}
        </VerificationContext.Provider>
    );
}
