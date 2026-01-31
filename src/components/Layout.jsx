import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
    return (
        <div className="flex h-screen w-full bg-monad-gradient">
            <Sidebar />
            <main className="flex-1 flex flex-col relative h-full">
                <Header />
                <div className="flex-1 flex overflow-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
