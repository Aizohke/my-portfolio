import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Cog } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Clerk handles the entire login UI and session.
// After login Clerk redirects to /admin automatically.
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 hero-grid">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-rust-500/5 to-transparent" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-dark-card border border-dark-border mb-4">
          <Cog size={24} className="text-rust-500 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <h1 className="font-display text-3xl tracking-widest text-white">ADMIN ACCESS</h1>
        <p className="text-sm text-steel-500 mt-1 font-mono">Isaac Mathenge — Portfolio CMS</p>
      </div>

      {/* Clerk SignIn component — handles everything */}
      <SignIn
        routing="hash"
        afterSignInUrl="/admin"
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'bg-dark-card border border-dark-border shadow-xl rounded-none',
            headerTitle: 'text-white font-heading',
            headerSubtitle: 'text-steel-400',
            formFieldLabel: 'text-steel-400 text-xs font-mono tracking-widest uppercase',
            formFieldInput: 'bg-dark-bg border border-dark-border text-white focus:border-rust-500 rounded-none',
            formButtonPrimary: 'bg-rust-500 hover:bg-rust-600 rounded-none tracking-widest font-mono',
            footerActionLink: 'text-rust-400 hover:text-rust-300',
            identityPreviewText: 'text-steel-300',
            identityPreviewEditButton: 'text-rust-400',
            alertText: 'text-red-400',
          },
        }}
      />
    </div>
  );
}
