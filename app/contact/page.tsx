"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, MessageSquare, Phone, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface ContactMessageCreate {
  name: string;
  email: string;
  subject: string;
  message: string;
  telegram_username?: string | null;
  whatsapp_number?: string | null;
}

const validationSchema = {
  name: { required: true, minLength: 2 },
  email: { required: true, email: true },
  subject: { required: true, minLength: 5 },
  message: { required: true, minLength: 10 },
  whatsapp_number: {
    custom: (value: string) => {
      if (value && !/^0[0-9]{9}$/.test(value.replace(/\s/g, ''))) {
        return "Invalid WhatsApp number format (e.g., 0501234567)";
      }
      return null;
    },
  },
};

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormValidation(
    {
      name: "",
      email: "",
      subject: "",
      message: "",
      telegram_username: "",
      whatsapp_number: "",
    },
    validationSchema
  );

  const onSubmit = async (formValues: typeof values) => {
    setIsSubmitting(true);
    try {
      await api.post<any>("/contact/", formValues);
      const successResponse = await api.get<{ message: string }>("/contact/success");
      setSuccessMessage(successResponse.message);
      setSubmissionSuccess(true);
      resetForm(); // Correctly call resetForm
      toast({
        title: "Message Sent!",
        description: "Your message has been successfully sent. We will get back to you soon.",
      });
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="glass-card border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 fade-in-up text-center max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Thank You!</CardTitle>
            <CardDescription className="text-muted-foreground">{successMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
          <p className="text-muted-foreground">We'd love to hear from you! Send us a message.</p>
        </div>

        <Card className="glass-card border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 fade-in-up">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-foreground">Send a Message</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      value={values.name}
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                      onBlur={handleBlur}
                      className="pl-10"
                    />
                  </div>
                  {touched.name && errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="md:col-span-1">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@example.com"
                      value={values.email}
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                      onBlur={handleBlur}
                      className="pl-10"
                    />
                  </div>
                  {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subject</label>
                <div className="relative mt-1">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Subject of your message"
                    value={values.subject}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    onBlur={handleBlur}
                    className="pl-10"
                  />
                </div>
                {touched.subject && errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message..."
                  value={values.message}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  onBlur={handleBlur}
                  rows={5}
                  className="mt-1"
                />
                {touched.message && errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label htmlFor="telegram_username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Telegram Username (Optional)</label>
                  <div className="relative mt-1">
                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="telegram_username"
                      name="telegram_username"
                      type="text"
                      placeholder="@your_telegram_username"
                      value={values.telegram_username}
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                      onBlur={handleBlur}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label htmlFor="whatsapp_number" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">WhatsApp Number (Optional)</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      type="tel"
                      placeholder="e.g., 0501234567"
                      value={values.whatsapp_number}
                      onChange={(e) => handleChange(e.target.name, e.target.value)}
                      onBlur={handleBlur}
                      className="pl-10"
                    />
                  </div>
                  {touched.whatsapp_number && errors.whatsapp_number && <p className="text-red-500 text-xs mt-1">{errors.whatsapp_number}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center"><Send className="w-4 h-4 mr-2 animate-pulse" /> Sending...</span>
                ) : (
                  <span className="flex items-center"><Send className="w-4 h-4 mr-2" /> Send Message</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
