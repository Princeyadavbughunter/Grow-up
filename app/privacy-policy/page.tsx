import React from 'react'
import LandingNav from '@/components/LandingNav'
import LandingFooter from '@/components/LandingFooter'

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-16">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="prose prose-gray max-w-none space-y-10">
            <div className="text-gray-700 leading-relaxed">
              <p>
                This Privacy Policy ("Policy") describes how <span className="font-medium">ThriveMates Private Limited</span> ("Company", "we", "us", or "our") collects, uses, discloses, and protects information about you ("User", "you", or "your") when you access and use GrowUp Buddy (the "Service"), including our website, mobile application, communication features, clubs, events, and related services.
              </p>
              <p className="mt-4">
                By accessing or using GrowUp Buddy, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our Service.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Interpretation and Scope
              </h2>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>This Policy applies to all users, whether they are individuals, freelancers, agencies, founders, or enterprises.</li>
                <li>It covers data collected directly from you, data collected automatically when you interact with the Service, and data obtained from third-party platforms if you choose to integrate them.</li>
                <li>This Policy should be read together with our Terms of Service.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Definitions
              </h2>
              <p className="text-gray-700 mb-4">For the purposes of this Policy:</p>
              <ul className="space-y-2.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li><span className="font-medium">Account</span> – A unique profile created for you to access and use GrowUp Buddy features.</li>
                <li><span className="font-medium">Affiliate</span> – Any entity under common ownership or control with ThriveMates Private Limited.</li>
                <li><span className="font-medium">Company / We / Us</span> – ThriveMates Private Limited, which owns and operates GrowUp Buddy.</li>
                <li><span className="font-medium">Cookies</span> – Small text files placed on your Device to track activity, preferences, and login sessions.</li>
                <li><span className="font-medium">Country</span> – India (the jurisdiction of incorporation).</li>
                <li><span className="font-medium">Device</span> – Any hardware capable of accessing the Service (mobile phone, tablet, laptop, desktop).</li>
                <li><span className="font-medium">Personal Data</span> – Any data that can identify an individual, such as name, email, phone number, or account details.</li>
                <li><span className="font-medium">Service</span> – The GrowUp Buddy platform, including website, mobile app, messaging, communities, and events.</li>
                <li><span className="font-medium">Service Provider</span> – Any third-party company or individual engaged by us to support the Service (hosting, analytics, payment, communications, etc.).</li>
                <li><span className="font-medium">Third-Party Social Media Service</span> – A social media or login provider through which a user may create or log in to their GrowUp Buddy account (e.g., Google, Facebook, LinkedIn, Twitter).</li>
                <li><span className="font-medium">Usage Data</span> – Technical or behavioral data collected automatically while you interact with the Service.</li>
                <li><span className="font-medium">User / You</span> – The person, company, or entity using GrowUp Buddy.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">We collect information to provide, improve, and secure our Service. The data collected may include:</p>
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">a) Personal Data You Provide Voluntarily</h3>
                  <p className="text-gray-700 mb-2">When you sign up, use features, or communicate with us, we may collect:</p>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Full name, email address, and phone number.</li>
                    <li>Profile details you choose to display (skills, services offered, clubs joined).</li>
                    <li>Payment and billing details for premium memberships, events, or escrow services.</li>
                    <li>Any files, images, or content you upload to the platform.</li>
                    <li>Your messages and communications within clubs, events, and direct messages.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">b) Usage Data (Automatically Collected)</h3>
                  <p className="text-gray-700 mb-2">When you interact with GrowUp Buddy, we automatically collect:</p>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Device details: type, operating system, unique device ID, browser type.</li>
                    <li>Log data: IP address, access times, pages viewed, time spent, crash reports.</li>
                    <li>Clickstream data: interactions with posts, services, or events.</li>
                    <li>App analytics: feature usage, frequency, and session duration.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">c) Community & Event Data</h3>
                  <p className="text-gray-700 mb-2">As a community-first platform, we also collect:</p>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Clubs you join and queries you post.</li>
                    <li>Events you attend, RSVP details, and participation activity.</li>
                    <li>Leads or service offers you showcase.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">d) Information from Third-Party Accounts</h3>
                  <p className="text-gray-700 mb-2">If you sign in or connect via Google, Facebook, Twitter, or LinkedIn, we may collect:</p>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Basic profile details (name, email, profile picture).</li>
                    <li>Contacts or connections (only with your consent).</li>
                    <li>Authentication tokens to verify your identity.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">e) Payment Data</h3>
                  <p className="text-gray-700 mb-2">If you purchase subscriptions, verified badges, or use escrow, we may collect:</p>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Transaction records, billing address, and limited payment details (processed through secure payment gateways).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Tracking Technologies and Cookies
              </h2>
              <p className="text-gray-700 mb-4">We use cookies, beacons, tags, and scripts to track usage and improve functionality. These may include:</p>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li><span className="font-medium">Essential Cookies</span> – Required for login, authentication, fraud prevention.</li>
                <li><span className="font-medium">Preference Cookies</span> – Store your chosen settings (language, theme, club filters).</li>
                <li><span className="font-medium">Analytics Cookies</span> – Monitor how users interact with the Service to improve UX.</li>
                <li><span className="font-medium">Advertising Cookies</span> – (if introduced later) help deliver relevant promotions.</li>
                <li><span className="font-medium">Flash Cookies & Web Beacons</span> – May be used to store preferences or measure engagement in emails/events.</li>
              </ul>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Your Choices:</h4>
                <ul className="space-y-1.5 text-sm text-gray-700 ml-4 list-disc marker:text-gray-400">
                  <li>You can configure your browser to refuse cookies, but some features of GrowUp Buddy may not function correctly.</li>
                  <li>You may opt-out of analytics or advertising cookies (if implemented) via cookie settings.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Data We Do Not Intentionally Collect
              </h2>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li><span className="font-medium">Children under 13:</span> GrowUp Buddy is not directed at children. We do not knowingly collect data from users under 13. If we discover such data, we will delete it immediately.</li>
                <li><span className="font-medium">Sensitive Data:</span> We do not request sensitive categories such as racial/ethnic origin, religious beliefs, political opinions, health data, or sexual orientation, unless required for specific services and provided with explicit consent.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. How We Use Your Personal Data
              </h2>
              <p className="text-gray-700 mb-4">We use the information collected for the following purposes:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">1. To Provide and Maintain Our Service</h3>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Create and manage your account.</li>
                    <li>Enable you to join clubs, post queries, attend events, and showcase services.</li>
                    <li>Provide secure messaging, lead management, and escrow functionality.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">2. To Improve and Personalize the Experience</h3>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Recommend relevant clubs, events, or members based on your activity.</li>
                    <li>Personalize feeds and notifications.</li>
                    <li>Optimize app performance and resolve bugs.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">3. To Communicate With You</h3>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Send service updates, event invitations, newsletters, and offers.</li>
                    <li>Respond to queries, feedback, or support requests.</li>
                    <li>Deliver transaction-related communications (payment confirmations, invoices).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">4. To Ensure Safety and Compliance</h3>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Detect and prevent fraud, scams, or misuse of the platform.</li>
                    <li>Moderate content and enforce community guidelines.</li>
                    <li>Comply with legal obligations and respond to lawful requests.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">5. For Business and Growth</h3>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Conduct data analysis, usage trends, and performance tracking.</li>
                    <li>Measure the effectiveness of marketing campaigns.</li>
                    <li>Develop new features, partnerships, and services.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">6. For Legal and Security Purposes</h3>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Enforce our Terms of Service.</li>
                    <li>Protect rights, property, and safety of users, the Company, and the public.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Retention of Your Personal Data
              </h2>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>We retain Personal Data only for as long as necessary to fulfill the purposes outlined in this Policy.</li>
                <li>Factors that determine retention include:
                  <ul className="mt-2 space-y-1.5 ml-5 list-circle marker:text-gray-400">
                    <li>The duration of your active account.</li>
                    <li>Legal and regulatory requirements (e.g., tax, financial recordkeeping).</li>
                    <li>Dispute resolution and enforcement of agreements.</li>
                  </ul>
                </li>
                <li>Usage Data (logs, analytics) may be retained for a shorter period, unless needed for security or improvement of the Service.</li>
                <li>Once data is no longer required, we either delete it securely or anonymize it for research/analytics.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Transfer of Your Personal Data
              </h2>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>Your data may be processed at the Company's operating offices and at any location where Service Providers are based.</li>
                <li>This means your information may be transferred and stored outside your state, province, or country, where data protection laws may differ from those of your jurisdiction.</li>
                <li>We take all necessary steps to ensure transfers are secure and in compliance with applicable laws.</li>
                <li>By using the Service, you consent to such transfers, provided adequate safeguards (encryption, contractual obligations, access controls) are in place.</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Disclosure of Your Personal Data
              </h2>
              <p className="text-gray-700 mb-4">We may disclose your information in the following circumstances:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">a) Business Transactions</h3>
                  <p className="text-gray-700">If the Company is involved in a merger, acquisition, financing, or sale of assets, your Personal Data may be transferred as part of the business assets. You will be notified before your information is subject to a different Privacy Policy.</p>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">b) Law Enforcement</h3>
                  <p className="text-gray-700">Under certain circumstances, we may be required to disclose your Personal Data if mandated by law or in response to valid legal requests from public authorities (e.g., court orders, government agencies).</p>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">c) Other Legal Requirements</h3>
                  <p className="text-gray-700 mb-2">We may disclose your information if we believe in good faith that such action is necessary to:</p>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Comply with a legal obligation.</li>
                    <li>Protect and defend the rights or property of the Company.</li>
                    <li>Prevent or investigate potential wrongdoing related to the Service.</li>
                    <li>Ensure the safety of users and the public.</li>
                    <li>Protect against legal liability.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">d) With Service Providers</h3>
                  <p className="text-gray-700 mb-2">We may share data with third-party providers to:</p>
                  <ul className="space-y-1.5 text-gray-700 ml-5 list-disc marker:text-gray-400">
                    <li>Host servers, manage databases, and provide cloud infrastructure.</li>
                    <li>Process payments and escrow transactions.</li>
                    <li>Analyze app usage and provide technical support.</li>
                    <li>Conduct marketing or communications (only with your consent).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">e) With Affiliates</h3>
                  <p className="text-gray-700">We may share information with our affiliates, subsidiaries, or parent company, provided they honor this Policy.</p>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">f) With Business Partners</h3>
                  <p className="text-gray-700">We may share limited data with partners who organize events, collaborations, or sponsorships on GrowUp Buddy.</p>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">g) With Other Users</h3>
                  <p className="text-gray-700">If you post publicly in clubs, events, or discussions, your name, profile, and activity may be visible to other members. Direct messages remain private but may be monitored for abuse if legally required.</p>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">h) With Your Consent</h3>
                  <p className="text-gray-700">We may share your information for any other purpose explicitly agreed upon by you.</p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Security of Your Personal Data
              </h2>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>We use industry-standard safeguards (encryption, secure servers, firewalls) to protect data.</li>
                <li>Access to Personal Data is restricted to authorized employees, contractors, and Service Providers bound by confidentiality obligations.</li>
                <li>While we strive to use commercially acceptable means, no method of transmission or storage is 100% secure. Therefore, we cannot guarantee absolute security.</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. Children's Privacy
              </h2>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>Our Services are not intended for children below the age of 13 years (or such higher age as may be applicable in your jurisdiction under relevant data protection laws). We do not knowingly collect personal information from individuals under this age.</li>
                <li>If you are under 13, you must not use our Services, submit personal information, or engage in any activities that involve the disclosure of personal data.</li>
                <li>Parents or guardians who become aware that their child has provided us with personal data should immediately contact us at <a href="mailto:support@growupbuddy.com" className="text-[#7052FF] hover:underline">support@growupbuddy.com</a>. We will take steps to delete such information without undue delay.</li>
                <li>In certain jurisdictions, parental consent is required for processing personal data of minors between ages 13–18. Where applicable, we may seek additional verification steps before enabling accounts for such users.</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. Links to Other Websites and Third-Party Services
              </h2>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>The Service may contain links to third-party websites, applications, or resources that are not owned or controlled by GrowUp Buddy. These include, but are not limited to, event partners, payment processors, advertising networks, and community collaborators.</li>
                <li>Please note that we are not responsible for the privacy practices or the content of such third-party websites or services. When you click on a third-party link, you will be subject to their privacy policy and terms of use.</li>
                <li>We strongly recommend that you read the privacy policies of any third-party websites or services you visit.</li>
                <li>The inclusion of third-party links on our platform does not imply endorsement, affiliation, or guarantee of safety. You acknowledge and agree that we shall not be held liable for any damages or losses arising from your use of or reliance on third-party websites, applications, or resources.</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                13. Your Rights and Controls
              </h2>
              <p className="text-gray-700 mb-4">Subject to applicable laws (including but not limited to the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and the Information Technology Act, 2000 with SPDI Rules in India), you may have the following rights:</p>
              
              <ol className="space-y-2 text-gray-700 ml-5 list-decimal marker:text-gray-900 marker:font-medium">
                <li><span className="font-medium">Right to Access</span> – Request a copy of the personal data we hold about you.</li>
                <li><span className="font-medium">Right to Rectification</span> – Request correction of any inaccurate or incomplete personal information.</li>
                <li><span className="font-medium">Right to Erasure</span> – Request deletion of your data where it is no longer necessary for the purposes for which it was collected, subject to legal or contractual obligations.</li>
                <li><span className="font-medium">Right to Restrict Processing</span> – Request restriction on the way your data is processed.</li>
                <li><span className="font-medium">Right to Data Portability</span> – Request transfer of your personal data to another service provider in a structured, commonly used, machine-readable format.</li>
                <li><span className="font-medium">Right to Object</span> – Object to processing of your personal data for marketing, profiling, or other purposes.</li>
                <li><span className="font-medium">Withdrawal of Consent</span> – Withdraw consent previously given at any time. Such withdrawal will not affect processing carried out before withdrawal.</li>
                <li><span className="font-medium">CCPA Rights (for California residents):</span>
                  <ul className="mt-2 space-y-1.5 ml-5 list-disc marker:text-gray-400">
                    <li>Right to know categories of personal data collected and disclosed.</li>
                    <li>Right to opt-out of the sale of personal data (we do not sell personal data).</li>
                    <li>Right to equal service regardless of exercising privacy rights.</li>
                  </ul>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Exercising Your Rights</h4>
                <ul className="space-y-1.5 text-sm text-gray-700 ml-4 list-disc marker:text-gray-400">
                  <li>To exercise any of these rights, please write to us at <a href="mailto:support@growupbuddy.com" className="text-[#7052FF] hover:underline">support@growupbuddy.com</a>.</li>
                  <li>We may request proof of identity before responding to such requests.</li>
                  <li>We will endeavor to respond within 30 days, or as required by law.</li>
                </ul>
              </div>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                14. Changes to this Privacy Policy
              </h2>
              <ul className="space-y-2 text-gray-700 ml-5 list-disc marker:text-gray-400">
                <li>We may update this Privacy Policy periodically to reflect changes in our practices, technologies, legal requirements, or other factors.</li>
                <li>Any material changes will be notified to you through:
                  <ul className="mt-2 space-y-1.5 ml-5 list-circle marker:text-gray-400">
                    <li>An update on this page,</li>
                    <li>An in-app notification, or</li>
                    <li>An email sent to your registered email address.</li>
                  </ul>
                </li>
                <li>The "Last Updated" date at the top of this page indicates when this Policy was last revised.</li>
                <li>Continued use of the Service after updates to this Privacy Policy constitutes acceptance of the revised terms.</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                15. Grievance Redressal and Complaints
              </h2>
              <p className="text-gray-700 mb-4">In accordance with the Information Technology Act, 2000 and the rules made there under, we have designated a Grievance Officer to address user complaints regarding information handling, breaches of security, or other concerns.</p>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 space-y-2">
                <p className="text-gray-700"><span className="font-medium">Email:</span> <a href="mailto:support@growupbuddy.com" className="text-[#7052FF] hover:underline">support@growupbuddy.com</a></p>
                <p className="text-gray-700"><span className="font-medium">Address:</span> Arjun Nagar, Thatipur, Jiwaji University, Gwalior, 474011, Madhya Pradesh</p>
                <p className="text-gray-700"><span className="font-medium">Response Timeline:</span> We will acknowledge complaints within 24 hours and seek to resolve them within 15 working days, or as otherwise mandated by applicable law.</p>
              </div>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                16. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">If you have questions, concerns, or requests relating to this Privacy Policy or the way we handle your data, please contact us using the following channels:</p>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 space-y-2">
                <p className="text-gray-700"><span className="font-medium">Email:</span> <a href="mailto:support@growupbuddy.com" className="text-[#7052FF] hover:underline">support@growupbuddy.com</a></p>
                <p className="text-gray-700"><span className="font-medium">Mailing Address:</span> ThriveMates Private Limited – Arjun Nagar, Thatipur, Jiwaji University, Gwalior, 474011, Madhya Pradesh</p>
                <p className="text-gray-700"><span className="font-medium">Website Form:</span> <a href="/support" className="text-[#7052FF] hover:underline">Contact Us</a></p>
              </div>
              
              <p className="text-gray-700 mt-4">We take user trust seriously and are committed to addressing your concerns promptly and transparently.</p>
            </section>

          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  )
}

export default PrivacyPolicyPage