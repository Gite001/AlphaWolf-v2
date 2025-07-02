'use client';

import { useState, useEffect } from 'react';

export default function PrivacyPage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString());
    }, []);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="text-4xl font-bold font-headline mb-4">Privacy Policy</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Last updated: {date}</p>
                
                <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Collecting and Using Your Personal Data</h2>
                <h3 className="text-xl font-bold font-headline mt-4 mb-2 text-foreground">Types of Data Collected</h3>
                <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to: Email address, First name and last name, Usage Data.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Use of Your Personal Data</h2>
                <p>The Company may use Personal Data for the following purposes: To provide and maintain our Service, including to monitor the usage of our Service. To manage Your Account: to manage Your registration as a user of the Service.</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Security of Your Personal Data</h2>
                <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, You can contact us by email.</p>
            </div>
        </div>
    );
}
