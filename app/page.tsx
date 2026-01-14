import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link2, BarChart3, Shield, Zap, Globe, Clock } from 'lucide-react';

export const metadata = {
  title: 'Link Shortener - Shorten URLs with Ease',
  description: 'Create short, memorable links for your URLs. Track clicks, manage links, and share easily.',
};

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-border px-4 py-2 mb-8">
            <Link2 className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Transform Long URLs into Short, Powerful Links</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
            Shorten Links, <span className="text-primary">Amplify Results</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
            Create branded short links, track engagement, and manage all your URLs in one powerful platform.
            Perfect for marketers, businesses, and content creators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Quick Demo Input */}
          <div className="w-full max-w-2xl bg-card border border-border rounded-lg p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Paste your long URL here..."
                className="flex-1 h-12 text-base"
                disabled
              />
              <Button size="lg" className="sm:w-auto" disabled>
                Shorten URL
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Sign up to start shortening links and accessing analytics
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Manage Links
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you create, track, and optimize your shortened links
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Create shortened links instantly with our optimized infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate short links in milliseconds. No delays, no waiting. Just paste and go.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Track clicks, locations, and engagement metrics in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get detailed insights into who's clicking your links and when. Make data-driven decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Link2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Custom Short Links</CardTitle>
              <CardDescription>
                Create branded, memorable links that reflect your brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose custom slugs for your links to make them memorable and on-brand.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Enterprise-grade security with 99.9% uptime guarantee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your links are safe with us. Built on secure infrastructure with automatic backups.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Global CDN</CardTitle>
              <CardDescription>
                Fast redirects from anywhere in the world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our global network ensures your links load quickly, no matter where your audience is.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Link Management</CardTitle>
              <CardDescription>
                Organize, edit, and manage all your links in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Easy-to-use dashboard to view, edit, and organize all your shortened links efficiently.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="border-2 border-primary bg-primary/5">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                Join thousands of users who trust our platform for their link shortening needs.
                Create your account today and start shortening links in seconds.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2026 Link Shortener. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
