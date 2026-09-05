"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-deep"
          >
            Contact
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-7xl"
          >
            Let&apos;s Talk Tunes.
          </motion.h1>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div variants={fadeInUp} className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-cyan-deep">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg uppercase text-foreground">
                  Visit Us
                </h3>
                <p className="text-silver-muted">
                  42 Automotive District
                  <br />
                  Bengaluru, Karnataka 560001
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-cyan-deep">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg uppercase text-foreground">
                  Phone
                </h3>
                <p className="text-silver-muted">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-cyan-deep">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg uppercase text-foreground">
                  Email
                </h3>
                <p className="text-silver-muted">hello@cartunez.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-border bg-raised p-6 md:p-8"
          >
            {submitted ? (
              <div className="py-12 text-center">
                <h2 className="font-display text-2xl uppercase text-foreground">
                  Message Sent
                </h2>
                <p className="mt-2 text-silver-muted">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Name
                    </Label>
                    <Input
                      id="name"
                      required
                      className="border-border bg-background text-foreground focus-visible:ring-cyan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="border-border bg-background text-foreground focus-visible:ring-cyan"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    required
                    className="border-border bg-background text-foreground focus-visible:ring-cyan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    required
                    className="border-border bg-background text-foreground focus-visible:ring-cyan"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2 bg-red text-white hover:bg-red-deep"
                >
                  Send Message <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
