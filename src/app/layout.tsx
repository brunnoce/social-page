import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-provider"
import CreatePostButton from "@/components/create-post-button";
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <CreatePostButton />
        </AuthProvider>
      </body>
    </html>
  )
}

