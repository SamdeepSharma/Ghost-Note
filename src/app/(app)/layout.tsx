import AlertWrapper from '@/components/AlertWrapper';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Ghost Note",
  description: "Get along on a mystery adventure.",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen transition-all duration-200">
      <Navbar />
      <AlertWrapper/>
      {children}
    </div>
  );
}