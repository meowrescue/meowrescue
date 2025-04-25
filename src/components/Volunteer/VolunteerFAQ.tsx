
import React from 'react';
import SectionHeading from '@/components/ui/SectionHeading';

const faqs = [
  {
    question: "How much time do I need to commit?",
    answer: "We ask for a minimum commitment of 4 hours per month for at least six months. Many volunteers choose to give more time, but we understand that everyone has different availability.",
  },
  {
    question: "Do I need prior experience with cats?",
    answer: "While experience with cats is helpful, it's not required for all volunteer positions. We provide training for each role, and we can match you with tasks that suit your comfort level and experience.",
  },
  {
    question: "Can I volunteer if I have allergies to cats?",
    answer: "If you have mild allergies, there are still ways to help! We have roles that involve minimal direct contact with cats, such as administrative tasks, social media management, or fundraising.",
  },
  {
    question: "Is there a minimum age requirement?",
    answer: "Volunteers must be at least 18 years old to volunteer independently. Youth volunteers aged 14-17 can participate with a parent or guardian who is also a registered volunteer.",
  },
];

const VolunteerFAQ = () => {
  return (
    <div className="mt-20">
      <SectionHeading
        title="Frequently Asked Questions"
        subtitle="Common questions about volunteering"
      />
      
      <div className="space-y-6 mt-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h3>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerFAQ;
