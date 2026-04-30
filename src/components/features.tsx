"use client";

import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Code2, Palette, Zap, Globe } from "lucide-react";

const features = [
  {
    title: "Modern Stack",
    description: "Built with Next.js 15, TypeScript, and the latest React Server Components.",
    icon: <Code2 className="h-10 w-10 text-primary" />,
  },
  {
    title: "Premium Design",
    description: "Tailwind CSS and shadcn/ui components for a sleek, professional look.",
    icon: <Palette className="h-10 w-10 text-primary" />,
  },
  {
    title: "Lightning Fast",
    description: "Optimized for performance and speed right out of the box.",
    icon: <Zap className="h-10 w-10 text-primary" />,
  },
  {
    title: "Global Ready",
    description: "Easy localization and internationalization support.",
    icon: <Globe className="h-10 w-10 text-primary" />,
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to ship
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Powerful tools and elegant design patterns to accelerate your development workflow.
        </p>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full border-border/50 bg-card/50 transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
