import React from 'react'
import LandingNav from '@/components/LandingNav'
import LandingFooter from '@/components/LandingFooter'

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-16">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Terms and Conditions
            </h1>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="prose prose-gray max-w-none space-y-10">
            <div className="text-gray-700 leading-relaxed">
              <p className="font-medium text-lg mb-4">Welcome to GrowUp Buddy!</p>
              <p>
                These Terms and Conditions ("Terms") outline the rules and regulations for the use of <span className="font-medium">ThriveMates Private Limited's</span> platform ("GrowUp Buddy"), including our website, mobile application, events, communities, and related services (collectively referred to as "the Service").
              </p>
              <p className="mt-4">
                By accessing and using GrowUp Buddy, you accept these Terms in full. Do not continue to use GrowUp Buddy if you do not agree to all the Terms and Conditions stated here.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Definitions
              </h2>
              <p className="text-gray-700 mb-4">In these Terms, the following terminology applies:</p>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li><span className="font-medium">"Client," "User," "You," and "Your"</span> refers to you — the individual, freelancer, agency, startup, or any legal entity accessing or using our Service.</li>
                <li><span className="font-medium">"Company," "Ourselves," "We," "Our," and "Us"</span> refers to ThriveMates Private Limited, the operator of GrowUp Buddy.</li>
                <li><span className="font-medium">"Service"</span> refers to all features of GrowUp Buddy, including communities ("Clubs"), direct messaging, events, service showcase, lead management, and networking functionalities.</li>
                <li><span className="font-medium">"Party," "Parties," or "Us"</span> refers to both the User and the Company.</li>
              </ul>
              <p className="text-gray-700 mt-4">
                All terms refer to the offer, acceptance, and consideration necessary to undertake the provision of our Services, subject to applicable laws, for the purpose of meeting the User's networking, collaboration, and service exchange needs.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Acceptance of Terms
              </h2>
              <ol className="space-y-2 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>By creating an account, accessing, or using GrowUp Buddy, you acknowledge that you have read, understood, and agreed to be bound by these Terms.</li>
                <li>If you are using our Service on behalf of an organization, you represent that you have the authority to bind that entity to these Terms.</li>
                <li>If you do not agree to these Terms, you must not access or use our Service.</li>
              </ol>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Eligibility
              </h2>
              <ol className="space-y-3 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>
                  <span className="font-medium">To use GrowUp Buddy, you must:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Be at least 13 years old (or higher in jurisdictions where local law requires).</li>
                    <li>Have the legal capacity to enter into a binding agreement.</li>
                    <li>Provide accurate and truthful registration details.</li>
                  </ul>
                </li>
                <li>We may suspend or terminate access if we reasonably believe you are underage, providing false information, or misusing the platform.</li>
              </ol>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Accounts and Registration
              </h2>
              <ol className="space-y-3 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>To access certain features, you may need to create an account with GrowUp Buddy.</li>
                <li>
                  <span className="font-medium">You are responsible for:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Maintaining confidentiality of your login credentials.</li>
                    <li>All activities that occur under your account.</li>
                    <li>Promptly notifying us of any unauthorized access.</li>
                  </ul>
                </li>
                <li>We reserve the right to suspend or terminate your account if we suspect misuse, fraud, or violation of these Terms.</li>
              </ol>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Cookies
              </h2>
              <p className="text-gray-700">
                We use cookies and similar technologies to enhance user experience, maintain login sessions, and analyze engagement. By accessing GrowUp Buddy, you consent to the use of cookies in accordance with our <a href="/privacy-policy" className="text-[#7052FF] hover:underline">Privacy Policy</a>.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. License
              </h2>
              <p className="text-gray-700 mb-4">
                Unless otherwise stated, ThriveMates Private Limited and/or its licensors own the intellectual property rights for all material on GrowUp Buddy. All rights are reserved.
              </p>
              <p className="text-gray-700 mb-4">
                You may access GrowUp Buddy for your own personal and professional use, subject to the restrictions set out in these Terms.
              </p>
              <p className="text-gray-700 mb-2 font-medium">You must not:</p>
              <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>Republish material from GrowUp Buddy without permission.</li>
                <li>Sell, rent, or sub-license material from GrowUp Buddy.</li>
                <li>Reproduce, duplicate, or copy material from GrowUp Buddy.</li>
                <li>Redistribute content from GrowUp Buddy unless expressly allowed.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. User Conduct
              </h2>
              <p className="text-gray-700 mb-4">By using GrowUp Buddy, you agree to:</p>
              <ol className="space-y-2.5 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li><span className="font-medium">Lawful Use</span> – You will not use the Service for any unlawful purpose or in violation of any applicable laws.</li>
                <li><span className="font-medium">Respectful Behavior</span> – You will not harass, abuse, or harm other users.</li>
                <li><span className="font-medium">No Misrepresentation</span> – You will not impersonate any person, organization, or misrepresent your affiliation.</li>
                <li><span className="font-medium">No Malicious Activity</span> – You will not upload viruses, malware, or engage in hacking, phishing, or other harmful activities.</li>
                <li><span className="font-medium">Fair Use of Messaging (DMs)</span> – Direct messaging must be used responsibly, only for professional collaboration, queries, or service exchange. Spam, repeated unsolicited messages, or harassment is strictly prohibited.</li>
              </ol>
              <p className="text-gray-700 mt-4">
                Violation of these rules may lead to temporary suspension or permanent termination of your account.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. User Content
              </h2>
              <ol className="space-y-3 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li><span className="font-medium">Ownership of Content</span> – You retain ownership of the content you create and share on GrowUp Buddy, including posts, comments, event participation, and service showcases.</li>
                <li><span className="font-medium">License to Company</span> – By posting on GrowUp Buddy, you grant ThriveMates Pvt. Ltd. a non-exclusive, royalty-free, worldwide license to use, display, reproduce, and distribute your content solely for operating and improving the Service.</li>
                <li><span className="font-medium">Responsibility for Content</span> – You are solely responsible for the content you post. Content must not be defamatory, obscene, hateful, infringing, fraudulent, or otherwise unlawful.</li>
                <li><span className="font-medium">Community Moderation</span> – We reserve the right to review, remove, or moderate content that violates these Terms, community guidelines, or applicable law.</li>
              </ol>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Clubs & Community Rules
              </h2>
              <p className="text-gray-700 mb-4">
                GrowUp Buddy offers pre-defined communities ("Clubs") such as Marketing Club, Finance Club, Tech/AI Club, Web3 Club, Meme Club, and others. By joining or contributing to a Club, you agree to:
              </p>
              <ol className="space-y-2 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>Respect fellow members and engage in professional, constructive discussions.</li>
                <li>Share accurate, non-misleading information when showcasing services.</li>
                <li>Avoid spam, irrelevant promotions, or scams.</li>
                <li>Not engage in hate speech, discrimination, or any form of harassment.</li>
                <li>Comply with moderator instructions and community guidelines.</li>
              </ol>
              <p className="text-gray-700 mt-4">
                Failure to follow community rules may result in warnings, removal from a Club, or suspension from the platform.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Events and Webinars
              </h2>
              <ol className="space-y-3 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>GrowUp Buddy hosts events, workshops, and webinars where experts and users engage in discussions.</li>
                <li>
                  <span className="font-medium">By registering for or attending events, you agree to:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Provide accurate registration details.</li>
                    <li>Not record, reproduce, or redistribute event content without permission.</li>
                    <li>Follow event conduct rules (no spam, no disruption, professional participation).</li>
                  </ul>
                </li>
                <li>We reserve the right to deny or revoke event participation for violations.</li>
                <li>Event-related content may be recorded and shared by GrowUp Buddy for educational and promotional purposes.</li>
              </ol>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. Hyperlinking to Our Content
              </h2>
              <ol className="space-y-3 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>
                  <span className="font-medium">The following organizations may link to GrowUp Buddy's website without prior written approval:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Government agencies</li>
                    <li>Search engines</li>
                    <li>News organizations</li>
                    <li>Online directory distributors linking in the same manner as other listed businesses</li>
                    <li>Accredited businesses (except those soliciting non-profits, fundraising, or commercial spam groups)</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Other organizations may link to our website only if approved by ThriveMates Pvt. Ltd. Approval depends on whether:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>The link is not deceptive or misleading.</li>
                    <li>The linking party has no negative history with us.</li>
                    <li>The link does not imply sponsorship or false endorsement.</li>
                    <li>The link fits within the context of general resource information.</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Approved organizations may hyperlink to GrowUp Buddy using:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Our corporate name ("GrowUp Buddy"),</li>
                    <li>The URL being linked to, or</li>
                    <li>Descriptions that make sense within the linking context.</li>
                  </ul>
                </li>
                <li>No use of ThriveMates Pvt. Ltd.'s logo or artwork is permitted for linking without a trademark license agreement.</li>
              </ol>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. iFrames
              </h2>
              <p className="text-gray-700">
                Without prior written approval, you may not create frames around our web pages or mobile screens that alter the visual presentation or appearance of GrowUp Buddy.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                13. Content Liability
              </h2>
              <ol className="space-y-2.5 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>We are not responsible for any content that appears on external websites linking to GrowUp Buddy.</li>
                <li>You agree to protect and defend us against all claims arising from content hosted on your site if you link to ours.</li>
                <li>
                  <span className="font-medium">No link(s) should appear on your website that:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>May be interpreted as libelous, obscene, or criminal,</li>
                    <li>Infringes, violates, or advocates the violation of third-party rights.</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                14. Your Privacy
              </h2>
              <p className="text-gray-700">
                Please refer to our <a href="/privacy-policy" className="text-[#7052FF] hover:underline">Privacy Policy</a> for details on how we collect, use, and protect your personal information. By using GrowUp Buddy, you consent to such collection and use.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                15. Reservation of Rights
              </h2>
              <ol className="space-y-2 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>We reserve the right to request removal of any or all links to our website at any time.</li>
                <li>By continuously linking to our website, you agree to comply with these Terms.</li>
                <li>We also reserve the right to amend these Terms and Conditions and our linking policy at any time without prior notice.</li>
                <li>Continued use of our platform after changes constitutes acceptance of the updated Terms.</li>
              </ol>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                16. Removal of Links from Our Website
              </h2>
              <ol className="space-y-2.5 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>If you find any link on our website that is offensive for any reason, you are free to contact us and inform us at any time.</li>
                <li>We will consider requests to remove links but are not obligated to respond directly.</li>
                <li>
                  <span className="font-medium">While we strive to keep information correct and up to date, we do not warrant:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Completeness or accuracy of information,</li>
                    <li>Availability of the website, or</li>
                    <li>That all materials remain current.</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* Section 17 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                17. Disclaimer
              </h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of GrowUp Buddy. Nothing in this disclaimer will:
              </p>
              <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>Limit or exclude our or your liability for death or personal injury;</li>
                <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>Limit any of our or your liabilities in any way not permitted under applicable law; or</li>
                <li>Exclude any of our or your liabilities that may not be excluded under law.</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Limitations and prohibitions of liability set in this Section (and elsewhere in these Terms) govern all liabilities arising under the disclaimer, including liabilities in contract, tort, or breach of statutory duty.
              </p>
              <p className="text-gray-700 mt-4">
                As long as the website and services are provided free of charge, GrowUp Buddy will not be liable for any loss or damage of any nature.
              </p>
            </section>

            {/* Section 18 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                18. Refund & Payment Policy
              </h2>
              <p className="text-gray-700 mb-4">
                Currently, GrowUp Buddy offers networking services, communities, and events, most of which are free.
              </p>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>If in future we introduce premium subscriptions, event tickets, or service exchange fees, payments will be non-refundable unless otherwise specified.</li>
                <li>Users are responsible for reviewing offerings before subscribing or participating in paid services.</li>
                <li>For queries regarding payments, users may contact us at <a href="mailto:support@growupbuddy.com" className="text-[#7052FF] hover:underline">support@growupbuddy.com</a>.</li>
              </ul>
            </section>

            {/* Section 19 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                19. Termination of Service
              </h2>
              <ol className="space-y-3 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>
                  <span className="font-medium">We reserve the right to suspend or terminate your account without notice if you:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Violate these Terms,</li>
                    <li>Engage in fraudulent, abusive, or unlawful activity,</li>
                    <li>Harm the reputation or functionality of the platform.</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Upon termination:</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Your right to use the platform ceases immediately,</li>
                    <li>Certain obligations (e.g., outstanding payments, intellectual property rights) survive termination.</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* Section 20 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                20. Governing Law & Jurisdiction
              </h2>
              <ol className="space-y-2 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li>These Terms are governed by the laws of India.</li>
                <li>Any disputes shall be subject to the exclusive jurisdiction of the courts in Bhopal, Madhya Pradesh, India, unless otherwise required by applicable law.</li>
              </ol>
            </section>

            {/* Section 21 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                21. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">For questions about these Terms and Conditions, please contact us:</p>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 space-y-2">
                <p className="text-gray-700"><span className="font-medium">Email:</span> <a href="mailto:support@growupbuddy.com" className="text-[#7052FF] hover:underline">support@growupbuddy.com</a></p>
                <p className="text-gray-700"><span className="font-medium">Registered Office:</span> ThriveMates Private Limited, Arjun Nagar, Thatipur, Jiwaji University, Gwalior, 474011, Madhya Pradesh</p>
              </div>
            </section>

          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  )
}

export default TermsAndConditionsPage