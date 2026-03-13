import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-muted/50 py-20 text-center">
                <div className="container px-4 md:px-6">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We&apos;d love to hear from you. Reach out with any questions or prayer
                        requests.
                    </p>
                </div>
            </div>

            <section className="py-20 bg-background">
                <div className="container px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                    Send us a message
                                </h2>
                                <p className="text-muted-foreground mt-2">
                                    Fill out the form below and we&apos;ll get back to you as soon as
                                    possible.
                                </p>
                            </div>
                            <ContactForm />
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                    Find us
                                </h2>
                                <p className="text-muted-foreground mt-2">
                                    Come visit us this Sunday. All are welcome.
                                </p>
                            </div>
                            <ContactMap />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
