import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
    return (
        <header className="h-20 flex items-center justify-between px-8 border-b border-[#283239]/30 bg-[#111518]/50 backdrop-blur-md z-30 shrink-0">
            <div className="flex items-center gap-3 lg:hidden">
                <span className="material-symbols-outlined">menu</span>
                <img src="/logo.png" alt="MonadBeat" className="h-8 w-auto" />
            </div>
            <div className="hidden md:flex relative max-w-md w-full mx-auto opacity-80 hover:opacity-100 transition-opacity">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#9dadb9] text-[20px]">search</span>
                </div>
                <input
                    className="block w-full pl-10 pr-3 py-2 border border-[#283239] rounded-lg leading-5 bg-[#1a2630] text-gray-300 placeholder-[#9dadb9] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                    placeholder="Search tracks..."
                    type="text"
                />
            </div>
            <div className="flex items-center gap-4 ml-auto lg:ml-0">
                <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />

                <div
                    className="size-10 rounded-full bg-cover bg-center border-2 border-[#283239]"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGtga_Ea_VqPMdPvz8zXBFVbuC5-rNS44phFFzx5ckOJgME-ILhifYl6ZlkmezzHQ6CTS11oECDCh_9_KMsIKoz4Fveu503AnjD9uT_iKQhzskhTw1JTjz0L3FeuajLJRW-dIpU2eeSS5ouIZgbx9pXsDwVZRjVZoS9I2oHeJA8wt7sHnDTvKP8eMzKgnRqMpwcR1xU75YJ0jvboRhlsiQ1-tliiHc3qFvTY12ifb3aADr9WTOO7MlvX4NbVS9NaRfOyRabL5cseU')" }}
                ></div>
            </div>
        </header>
    );
}
