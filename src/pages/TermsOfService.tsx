
import React from 'react';
import Layout from '@/components/Layout';
import SectionHeading from '@/components/ui/SectionHeading';

const TermsOfService: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Terms of Service" 
          subtitle="Last Updated: April 2025"
          centered
        />
        
        <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
          <p className="bg-yellow-100 p-4 rounded text-yellow-800 mb-8">
            <strong>DISCLAIMER:</strong> This is a template terms of service document. You must have this document reviewed by a qualified attorney before using it on your website.
          </p>
          
          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using the Meow Rescue website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
          
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily view the materials on Meow Rescue's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>Attempt to decompile or reverse engineer any software contained on Meow Rescue's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          
          <h2>Disclaimer</h2>
          <p>
            The materials on Meow Rescue's website are provided on an 'as is' basis. Meow Rescue makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2>Limitations</h2>
          <p>
            In no event shall Meow Rescue or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Meow Rescue's website, even if Meow Rescue or a Meow Rescue authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
          
          <h2>Adoption Process</h2>
          <p>
            Our website provides information about cats available for adoption. By submitting an adoption application, you are not guaranteed approval. All adoption decisions are made at the sole discretion of Meow Rescue, and we reserve the right to deny any application without providing a reason.
          </p>
          
          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Florida and you irrevocably submit to the exclusive jurisdiction of the courts in that State.
          </p>
          
          <h2>Contact Information</h2>
          <p>
            For any questions regarding these Terms of Service, please contact us at: info@meowrescue.org or (727) 257-0037.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
