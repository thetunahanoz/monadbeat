export default function Header() {
    return (
        <header className="h-20 flex items-center justify-between px-8 border-b border-[#283239]/30 bg-[#111518]/50 backdrop-blur-md z-30 shrink-0">
            <div className="flex items-center gap-4 lg:hidden">
                <span className="material-symbols-outlined">menu</span>
                <h2 className="font-bold text-lg">MonadBeat</h2>
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
                <button className="flex items-center gap-2 h-10 px-4 bg-[#1a2630] border border-primary/30 hover:border-primary/60 rounded-lg transition-all group">
                    <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">0x71C...3A9</span>
                </button>
                <div
                    className="size-10 rounded-full bg-cover bg-center border-2 border-[#283239]"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGtga_Ea_VqPMdPvz8zXBFVbuC5-rNS44phFFzx5ckOJgME-ILhifYl6ZlkmezzHQ6CTS11oECDCh_9_KMsIKoz4Fveu503AnjD9uT_iKQhzskhTw1JTjz0L3FeuajLJRW-dIpU2eeSS5ouIZgbx9pXsDwVZRjVZoS9I2oHeJA8wt7sHnDTvKP8eMzKgnRqMpwcR1xU75YJ0jvboRhlsiQ1-tliiHc3qFvTY12ifb3aADr9WTOO7MlvX4NbVS9NaRfOyRabL5cseU')" }}
                ></div>
            </div>
        </header>
    );
}
