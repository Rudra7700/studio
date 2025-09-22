

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Droplets, Scan, Tractor } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo />
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Farmer Login</Link>
            </Button>
          </nav>
        </header>

        <main className="flex-grow">
          <section className="relative py-20 md:py-32 bg-card">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-primary/10"
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary tracking-tight">
                  EcoFighter's
                </h1>
                <p className="mt-4 text-lg md:text-xl text-foreground/80">
                  Revolutionizing Agriculture with Intelligent Precision Spraying.
                  Protect your crops, save resources, and boost your yield.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline text-primary">Core Features</h2>
                <p className="mt-2 text-muted-foreground">Everything you need for smart crop protection.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard
                  icon={<Scan className="w-8 h-8 text-primary" />}
                  title="Drone Scanning"
                  description="High-resolution crop imaging to monitor health and detect issues early."
                />
                <FeatureCard
                  icon={<Bot className="w-8 h-8 text-primary" />}
                  title="AI Disease Detection"
                  description="Advanced AI analysis to identify pests and diseases with high accuracy."
                />
                <FeatureCard
                  icon={<Droplets className="w-8 h-8 text-primary" />}
                  title="Precision Spraying"
                  description="Targeted pesticide application only where needed, reducing waste and environmental impact."
                />
                <FeatureCard
                  icon={<Tractor className="w-8 h-8 text-primary" />}
                  title="Smart Farming"
                  description="AI-powered insights and recommendations for optimal treatment and yield."
                />
              </div>
            </div>
          </section>
          
          <section className="bg-card py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                  <div className="lg:w-1/2">
                    <Image
                      src="https://picsum.photos/seed/agritech/600/400"
                      alt="A drone flying over a farm field"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-xl"
                      data-ai-hint="drone farm"
                    />
                  </div>
                  <div className="lg:w-1/2">
                    <h2 className="text-3xl font-bold font-headline text-primary">Take Control of Your Farm's Health</h2>
                    <p className="mt-4 text-muted-foreground text-lg">Our integrated dashboard gives you a bird's-eye view of your fields. Monitor drone operations, analyze crop health with AI, and schedule treatments with a few clicks.</p>
                    <ul className="mt-6 space-y-4">
                      <li className="flex items-start">
                        <Checkmark />
                        <span><strong>Real-time Telemetry:</strong> Keep an eye on your drone's status, battery, and location.</span>
                      </li>
                      <li className="flex items-start">
                        <Checkmark />
                        <span><strong>AI Assistant:</strong> Get instant advice in English or Hindi through voice or text.</span>
                      </li>
                      <li className="flex items-start">
                        <Checkmark />
                        <span><strong>Offline First:</strong> Key features work even with poor internet connectivity in rural areas.</span>
                      </li>
                    </ul>
                  </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-primary/90 text-primary-foreground py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; {new Date().getFullYear()} EcoFighter's. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center bg-background border-none shadow-none">
    <CardHeader>
      <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="mt-4 text-xl font-headline">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Checkmark = () => (
  <svg className="w-6 h-6 text-accent flex-shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
)
