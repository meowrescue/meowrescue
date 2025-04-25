
import React from 'react';
import Layout from '@/components/Layout';
import SectionHeading from '@/components/ui/SectionHeading';

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Privacy Policy" 
          subtitle="Last Updated: April 2025"
          centered
        />
        
        <div className="max-w-4xl mx-auto mt-12 prose prose-lg">
          <p className="bg-yellow-100 p-4 rounded text-yellow-800 mb-8">
            <strong>DISCLAIMER:</strong> This is a template privacy policy. You must have this document reviewed by a qualified attorney before using it on your website.
          </p>
          
          <h2>Introduction</h2>
          <p>
            Meow Rescue ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our website, including information:
          </p>
          <ul>
            <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number, or any other identifier by which you may be contacted online or offline ("personal information");</li>
            <li>That is about you but individually does not identify you; and/or</li>
            <li>About your internet connection, the equipment you use to access our website, and usage details.</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>
            We use information that we collect about you or that you provide to us, including any personal information:
          </p>
          <ul>
            <li>To present our website and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To fulfill any other purpose for which you provide it.</li>
            <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.</li>
            <li>To notify you about changes to our website or any products or services we offer or provide though it.</li>
            <li>In any other way we may describe when you provide the information.</li>
            <li>For any other purpose with your consent.</li>
          </ul>
          
          <h2>Disclosure of Your Information</h2>
          <p>
            We may disclose aggregated information about our users, and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy:
          </p>
          <ul>
            <li>To contractors, service providers, and other third parties we use to support our business.</li>
            <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Meow Rescue's assets.</li>
            <li>To fulfill the purpose for which you provide it.</li>
            <li>For any other purpose disclosed by us when you provide the information.</li>
            <li>With your consent.</li>
          </ul>
          
          <h2>Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
          </p>
          
          <h2>Contact Information</h2>
          <p>
            To ask questions or comment about this privacy policy and our privacy practices, contact us at: info@meowrescue.org or (727) 257-0037.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
