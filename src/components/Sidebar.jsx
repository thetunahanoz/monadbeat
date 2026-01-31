import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    const getLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
            ? 'bg-primary/10 text-primary'
            : 'text-[#9dadb9] hover:text-white hover:bg-[#283239]/50'
        }`;

    return (
        <aside className="w-64 hidden lg:flex flex-col border-r border-[#283239]/50 bg-[#111518]/80 backdrop-blur-sm z-20">
            <div className="p-6 pb-2">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[20px]">equalizer</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">MonadBeat</h1>
                </div>
                <p className="text-[#9dadb9] text-xs font-medium mt-2 pl-1">Web3 Music Discovery</p>
            </div>
            <nav className="flex-1 flex flex-col gap-2 px-4 py-6">
                <NavLink to="/" className={getLinkClass}>
                    <span className="material-symbols-outlined filled">home</span>
                    <span className="font-medium text-sm">Feed</span>
                </NavLink>
        
                <NavLink to="/upload" className={getLinkClass}>
                    <span className="material-symbols-outlined">cloud_upload</span>
                    <span className="font-medium text-sm">Upload</span>
                </NavLink>
                <NavLink to="/profile" className={getLinkClass}>
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-medium text-sm">Profile</span>
                </NavLink>
            </nav>
            <div className="p-4 border-t border-[#283239]/50">
                <div className="bg-gradient-to-br from-[#1a2630] to-[#111518] rounded-xl p-4 border border-[#283239]">
                    <p className="text-xs text-[#9dadb9] mb-2">Your Balance</p>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">1,240 MON</span>
                        <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
