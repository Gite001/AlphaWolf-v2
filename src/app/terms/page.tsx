'use client';

import { useState, useEffect } from 'react';

export default function TermsPage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString());
    }, []);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="text-4xl font-bold font-headline mb-4">Terms of Service</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Last updated: {date}</p>
                
                <p>Please read these terms and conditions carefully before using Our Service.</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Interpretation and Definitions</h2>
                <h3 className="text-xl font-bold font-headline mt-4 mb-2 text-foreground">Interpretation</h3>
                <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Acknowledgment</h2>
                <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
                <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Links to Other Websites</h2>
                <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p>
                <p>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">"AS IS" and "AS AVAILABLE" Disclaimer</h2>
                <p>The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service...</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Contact Us</h2>
                <p>If you have any questions about these Terms and Conditions, You can contact us by email.</p>
            </div>
        </div>
    );
}
