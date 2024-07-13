export const metadata = {
  title: 'Ghost Note - Auth',
  description: 'Authenticate yourself, Ghost.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}
