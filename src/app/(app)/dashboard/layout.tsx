import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Ghost Note - Ghost area 51",
  description: "Welcome to the mystery adventure. Share your unique link with others.",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}