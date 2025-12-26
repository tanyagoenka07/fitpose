"use client"
import { sendContactEmail } from '@/actions/contactUs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ContactFormData, contactSchema } from '@/types/ContactSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, MessageSquare, Send, Users, Clock, HeartHandshake } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const ContactSection = () => {
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setLoading(true);
        setResponse(null);

        try {
            const res = await sendContactEmail(data);
            if (res.statusCode === 200) {
                setResponse(res.message || "Message sent successfully!");
                reset();
            } else {
                setResponse(res.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Frontend error:", error);
            setResponse("An unexpected error occurred. Please try again.");
        }

        setLoading(false);
    };

    return (
        <section className="bg-gradient-to-b from-white to-blue-50 py-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* Introduction Section */}
                <div className="text-center mb-16">
                    <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium inline-block mb-3">Get In Touch</span>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">We'd Love To Hear From You</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">Whether you have questions about AI Precision, need technical support, or want to explore partnership opportunities, our team is ready to help you reach your movement goals.</p>
                    
                    {/* Benefits Section */}
                    <div className="grid md:grid-cols-3 gap-8 mt-12 mb-16">
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="bg-blue-100 p-3 rounded-full mb-4">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Expert Support</h3>
                            <p className="text-gray-600 text-center">Our team of movement specialists and AI experts are ready to assist with your questions.</p>
                        </div>
                        
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="bg-blue-100 p-3 rounded-full mb-4">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast Response</h3>
                            <p className="text-gray-600 text-center">We're committed to responding to all inquiries within one business day.</p>
                        </div>
                        
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="bg-blue-100 p-3 rounded-full mb-4">
                                <HeartHandshake className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Solutions</h3>
                            <p className="text-gray-600 text-center">Every question gets a personalized response tailored to your specific needs.</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h3>
                        <p className="text-gray-600">Reach out directly using the form below</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Info Card */}
                        <Card className="bg-white border border-gray-200 shadow-md overflow-hidden">
                            <div className="bg-blue-500 h-2"></div>
                            <CardHeader>
                                <CardTitle className="text-gray-800">Reach Out</CardTitle>
                                <CardDescription>We're here to assist you!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                    <span>Support: <Link href="mailto:siddh907729@gmail.com" className="text-blue-500 hover:text-blue-600 font-medium" target="_blank">siddh907729@gmail.com</Link></span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <MessageSquare className="w-5 h-5 text-blue-500" />
                                    <span>Response within 1 business day</span>
                                </div>
                                
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        "Our dedicated support team includes certified fitness professionals and AI specialists who can help with both technical issues and movement advice."
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Form Card */}
                        <Card className="bg-white border border-gray-200 shadow-md overflow-hidden">
                            <div className="bg-blue-500 h-2"></div>
                            <CardHeader>
                                <CardTitle className="text-gray-800">Send Us a Message</CardTitle>
                                <CardDescription>Fill out the form below</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600 font-medium">Name (Optional)</label>
                                        <Input {...register("name")} placeholder="Your name" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600 font-medium">Email</label>
                                        <Input {...register("email")} placeholder="your.email@example.com" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600 font-medium">Subject</label>
                                        <Select onValueChange={(value) => setValue("subject", value as "Bug Report" | "Feature Request" | "General Inquiry", { shouldValidate: true })}>
                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Bug Report">Bug Report</SelectItem>
                                                <SelectItem value="Feature Request">Feature Request</SelectItem>
                                                <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600 font-medium">Message</label>
                                        <Textarea {...register("message")} placeholder="Your message" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]" />
                                        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
                                    </div>

                                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Send Message
                                    </Button>
                                </form>

                                {response && <Alert className="mt-4 bg-green-50 text-green-700 border-green-200">
                                    <AlertDescription>{response}</AlertDescription>
                                </Alert>}
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* FAQ Teaser */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-600">Have questions? Check out our <Link href="/faq" className="text-blue-500 hover:text-blue-600 font-medium">Frequently Asked Questions</Link> page.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactSection;