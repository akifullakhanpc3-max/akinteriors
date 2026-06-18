'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getContactPage } from '@/lib/actions/cms-actions';

interface ContactInfoItem {
  icon: React.ElementType;
  label: string;
  value: string;
}

export default function ContactSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [contactInfo, setContactInfo] = useState<ContactInfoItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', budget: '', message: '' });

  useEffect(() => {
    getContactPage().then((res) => {
      if (res.success) {
        const d = res.data as Record<string, unknown>;
        const branches = (d?.branches as Array<Record<string, unknown>>) || [];
        const primary = branches.find((b) => b.isPrimary) || branches[0];
        if (primary) {
          const info: ContactInfoItem[] = [];
          if (primary.phone) info.push({ icon: Phone, label: 'Phone', value: primary.phone as string });
          if (primary.email) info.push({ icon: Mail, label: 'Email', value: primary.email as string });
          if (primary.address || primary.city) {
            const parts = [primary.address as string, primary.city as string, primary.state as string, primary.zip as string].filter(Boolean);
            info.push({ icon: MapPin, label: 'Address', value: parts.join(', ') });
          }
          if (primary.workingHours) info.push({ icon: Clock, label: 'Working Hours', value: primary.workingHours as string });
          if (info.length > 0) setContactInfo(info);
        }
      }
    }).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section ref={ref} id="contact" className="py-24 lg:py-32 bg-[#F9F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
            Let&apos;s Create Something{' '}
            <span className="text-[#C8A97E]">Beautiful</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Ready to transform your space? Reach out to us for a free consultation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-[#111827] mb-6">Send Us a Message</h3>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#111827] mb-2">Thank You!</h4>
                  <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} placeholder="+91 9X XXX XXX" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service</Label>
                      <Select value={formData.service} onValueChange={(val) => setFormData(prev => ({ ...prev, service: val }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential Interiors</SelectItem>
                          <SelectItem value="commercial">Commercial Interiors</SelectItem>
                          <SelectItem value="kitchen">Modular Kitchen</SelectItem>
                          <SelectItem value="renovation">Renovation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                    <Select value={formData.budget} onValueChange={(val) => setFormData(prev => ({ ...prev, budget: val }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">₹5L - ₹10L</SelectItem>
                        <SelectItem value="10-25">₹10L - ₹25L</SelectItem>
                        <SelectItem value="25-50">₹25L - ₹50L</SelectItem>
                        <SelectItem value="50+">₹50L+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                    <Textarea id="message" value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} placeholder="Tell us about your project..." required />
                  </div>
                  <Button type="submit" variant="gold" size="lg" className="w-full rounded-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {contactInfo.map((info) => (
              <div key={info.label} className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
                  <info.icon className="w-6 h-6 text-[#C8A97E]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{info.label}</h4>
                  <p className="text-[#111827] font-medium">{info.value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl overflow-hidden h-64 shadow-sm">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                <MapPin className="w-8 h-8 mr-2" />
                Google Maps
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


