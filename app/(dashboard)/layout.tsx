import Navbar from '@/components/Navbar'
import BottomNavbar from '@/components/BottomNavbar'
import { AuthProvider } from '@/context/AuthContext'
import ProfileRequired from './_components/ProfileRequired'

interface LayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <div className="sticky top-0 z-50 bg-white shadow">
                    <Navbar />
                </div>
                <div className="h-[calc(100vh-10rem)] overflow-y-hidden">
                    <ProfileRequired>
                        {children}
                    </ProfileRequired>
                </div>
                <div className="sticky bottom-0 z-50 bg-white shadow">
                    <BottomNavbar />
                </div>
            </div>
        </AuthProvider>
    )
}
