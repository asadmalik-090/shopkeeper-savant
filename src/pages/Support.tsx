
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Phone, MapPin, ExternalLink, MessageSquare } from 'lucide-react';

const Support = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Get assistance and learn more about using MobileShop</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Contact Information
            </CardTitle>
            <CardDescription>Reach out to our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  For general inquiries and support:
                </p>
                <a href="mailto:support@elevorix.com" className="text-primary hover:underline">
                  support@elevorix.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Phone Support</h3>
                <p className="text-sm text-muted-foreground">
                  Available Monday-Friday, 9 AM - 5 PM:
                </p>
                <a href="tel:+123456789" className="text-primary hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Office Address</h3>
                <p className="text-sm text-muted-foreground">
                  Elevorix Solutions Headquarters:
                </p>
                <address className="not-italic">
                  123 Tech Lane<br />
                  Innovation District<br />
                  Business City, BC 12345
                </address>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Contact Support Team</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Support</DialogTitle>
                  <DialogDescription>
                    Submit your question or issue and our support team will get back to you as soon as possible.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
                    <input id="name" className="col-span-3 h-10 rounded-md border px-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-right text-sm font-medium">Email</label>
                    <input id="email" className="col-span-3 h-10 rounded-md border px-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="message" className="text-right text-sm font-medium">Message</label>
                    <textarea id="message" className="col-span-3 h-20 rounded-md border px-3 py-2" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Send Message</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Company Information
            </CardTitle>
            <CardDescription>About Elevorix Solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">About Us</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Elevorix Solutions is a leading provider of retail management systems for mobile phone shops and electronic stores. Our software solutions help businesses streamline operations, manage inventory, track sales, and improve customer service.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Our Mission</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We're dedicated to empowering small and medium-sized businesses with affordable, user-friendly technology solutions that help them compete and succeed in today's digital marketplace.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Company Details</h3>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>Founded: 2015</li>
                <li>Employees: 50+</li>
                <li>Headquarters: Business City, BC</li>
                <li>Registration: ELV12345678</li>
                <li>VAT ID: VAT987654321</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.open('https://www.elevorix.com', '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Our Website
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-medium mb-1">How do I add a new product to inventory?</h3>
            <p className="text-sm text-muted-foreground">
              Navigate to the Inventory section, click on "Add Product", fill in the product details, and click Save. The new product will be immediately available in your inventory.
            </p>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium mb-1">How do I process a sale?</h3>
            <p className="text-sm text-muted-foreground">
              Go to the Sales section, click "New Sale", select the customer (or add a new one), add products to the sale, apply any discounts, and complete the transaction.
            </p>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium mb-1">How do I add a new user to the system?</h3>
            <p className="text-sm text-muted-foreground">
              Only Admins can add new users. Go to Settings, select the "User Management" tab, click "Add User", and fill in their details including their access role.
            </p>
          </div>
          <div className="border-b pb-3">
            <h3 className="font-medium mb-1">What if I forget my password?</h3>
            <p className="text-sm text-muted-foreground">
              On the login screen, click "Forgot Password" and follow the instructions to reset your password via email.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">How do I generate reports?</h3>
            <p className="text-sm text-muted-foreground">
              Navigate to the Reports section, select the type of report you need, set the date range and other parameters, then click "Generate Report".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
