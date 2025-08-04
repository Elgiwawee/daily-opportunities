
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AdSenseAd from '../components/AdSenseAd';

const Explainer = () => {
  const [selectedTab, setSelectedTab] = useState("application");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseAd />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Scholarship Explainer</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about finding and applying for scholarships worldwide.
            </p>
          </motion.div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-10">
            <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
                <TabsTrigger value="application">Application Process</TabsTrigger>
                <TabsTrigger value="documents">Required Documents</TabsTrigger>
                <TabsTrigger value="tips">Winning Tips</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="application" className="mt-6 space-y-4">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-olive-800 mb-4">Scholarship Application Process</h2>
                  <p className="mb-4">
                    Applying for scholarships can seem overwhelming, but breaking it down into steps makes it manageable.
                    Below is a general guideline for the application process:
                  </p>
                  
                  <ol className="list-decimal pl-6 space-y-4">
                    <li>
                      <strong>Research Opportunities:</strong> Find scholarships that match your profile, academic background, and career goals.
                    </li>
                    <li>
                      <strong>Check Eligibility:</strong> Carefully review the eligibility criteria to ensure you qualify.
                    </li>
                    <li>
                      <strong>Prepare Documents:</strong> Gather all required documents like transcripts, recommendation letters, and identification.
                    </li>
                    <li>
                      <strong>Write Essays:</strong> Craft compelling personal statements and essays that highlight your achievements and aspirations.
                    </li>
                    <li>
                      <strong>Submit Applications:</strong> Complete and submit your applications before the deadlines.
                    </li>
                    <li>
                      <strong>Follow Up:</strong> Track your applications and respond promptly to any requests for additional information.
                    </li>
                  </ol>
                  
                  <div className="bg-blue-50 p-4 rounded-md mt-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Pro Tip:</h3>
                    <p className="text-blue-700">
                      Create a calendar with application deadlines and set reminders at least two weeks in advance to ensure you have enough time to complete all requirements.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-6 space-y-4">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-olive-800 mb-4">Required Documents</h2>
                  <p className="mb-4">
                    Most scholarship applications require the following documents. Having these prepared in advance will streamline your application process:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <strong>Academic Transcripts:</strong> Official records of your academic performance from your current or previous institutions.
                    </li>
                    <li>
                      <strong>Standardized Test Scores:</strong> Results from tests like SAT, ACT, GRE, GMAT, TOEFL, or IELTS, depending on the scholarship requirements.
                    </li>
                    <li>
                      <strong>Letters of Recommendation:</strong> Testimonials from teachers, professors, or employers who can vouch for your abilities and character.
                    </li>
                    <li>
                      <strong>Personal Statement/Essays:</strong> Written pieces that showcase your background, achievements, goals, and why you deserve the scholarship.
                    </li>
                    <li>
                      <strong>Resume/CV:</strong> A comprehensive document highlighting your education, work experience, skills, and achievements.
                    </li>
                    <li>
                      <strong>Proof of Identity:</strong> Passport, national ID, or birth certificate to verify your identity and citizenship.
                    </li>
                    <li>
                      <strong>Financial Documentation:</strong> For need-based scholarships, documents like tax returns or financial aid forms may be required.
                    </li>
                  </ul>
                  
                  <div className="bg-yellow-50 p-4 rounded-md mt-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Note:</h3>
                    <p className="text-yellow-700">
                      Always check if international documents need to be translated or certified. Many institutions require official translations or notarizations of documents not in English.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tips" className="mt-6 space-y-4">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-olive-800 mb-4">Winning Scholarship Tips</h2>
                  <p className="mb-4">
                    Competition for scholarships can be fierce. Here are some proven strategies to help your application stand out:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-olive-700 mb-2">Start Early</h3>
                      <p>
                        Begin your scholarship search and application process at least 6-12 months before you need the funding. This gives you ample time to prepare quality applications.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-olive-700 mb-2">Tell Your Unique Story</h3>
                      <p>
                        Use your essays to share personal experiences that shaped you. Authentic, compelling stories help scholarship committees remember you.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-olive-700 mb-2">Tailor Each Application</h3>
                      <p>
                        Customize your application materials for each scholarship. Address the specific values and priorities of the organization offering the award.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-olive-700 mb-2">Proofread Carefully</h3>
                      <p>
                        Errors in your application can create a negative impression. Have someone else review your materials before submission.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-olive-700 mb-2">Apply for Multiple Scholarships</h3>
                      <p>
                        Don't limit yourself to just a few high-profile scholarships. Apply to many, including smaller, less competitive ones that match your profile.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-olive-700 mb-2">Follow Instructions Exactly</h3>
                      <p>
                        Adhere to all guidelines regarding word counts, formatting, and submission requirements. Failing to follow instructions can disqualify your application.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md mt-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Success Strategy:</h3>
                    <p className="text-green-700">
                      Keep a scholarship application journal where you track requirements, deadlines, and submission status. This organization can be the difference between winning and missing out.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="faqs" className="mt-6">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-olive-800 mb-4">Frequently Asked Questions</h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="faq-1">
                      <AccordionTrigger className="text-left">When should I start applying for scholarships?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          It's best to start searching and applying for scholarships as early as possible, ideally 9-12 months before you need the funding. Many scholarships have application deadlines a full year before the start of the academic year they cover.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-2">
                      <AccordionTrigger className="text-left">Can international students apply for scholarships?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Yes, many scholarships are available to international students. However, eligibility varies by scholarship. Some are specifically designed for international students, while others may have citizenship or residency requirements. Always check the eligibility criteria carefully.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-3">
                      <AccordionTrigger className="text-left">How many scholarships should I apply for?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Apply for as many scholarships as you can reasonably handle while maintaining high-quality applications. Quality is more important than quantity, but ideally, you should aim for at least 10-15 scholarship applications to increase your chances of success.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-4">
                      <AccordionTrigger className="text-left">Do I need perfect grades to get a scholarship?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          While many academic scholarships prioritize high grades, not all scholarships require perfect academic records. There are scholarships based on leadership, community service, specific talents, financial need, and many other factors. Look for scholarships that match your unique strengths.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-5">
                      <AccordionTrigger className="text-left">Should I pay someone to find scholarships for me?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          You should be very cautious about paying for scholarship search services. Most legitimate scholarship information is freely available through university financial aid offices, online scholarship databases, and websites like Scholarship Region. If someone guarantees you'll receive a scholarship for a fee, it's likely a scam.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="faq-6">
                      <AccordionTrigger className="text-left">What if I don't hear back after applying?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Many scholarship providers only contact successful applicants. If you haven't heard back by the notification date listed in the application guidelines, you can send a polite email inquiry. However, be prepared that some scholarship committees receive thousands of applications and may not respond to individual inquiries.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <AdSenseAd />
        </div>
      </div>
    </div>
  );
};

export default Explainer;
