export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  documents: string[];
  price?: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'pan-card',
    name: 'PAN Card',
    description: 'Apply for new PAN card or make corrections to existing PAN card. We handle the complete application process including form filling, document verification, and submission.',
    icon: 'CreditCard',
    documents: ['Aadhar Card', 'Passport Size Photo', 'Mobile Number (linked with Aadhar)', 'Date of Birth Proof'],
    price: '₹150',
  },
  {
    id: 'aadhar-update',
    name: 'Aadhar Update',
    description: 'Update your Aadhar card details including name, address, mobile number, date of birth, and photo. Online and offline update services available.',
    icon: 'Fingerprint',
    documents: ['Existing Aadhar Card', 'Address Proof', 'Mobile Number', 'Identity Proof'],
    price: '₹100',
  },
  {
    id: 'passport-apply',
    name: 'Passport Apply',
    description: 'Complete passport application assistance including online form filling, appointment booking, document preparation, and submission guidance.',
    icon: 'BookOpen',
    documents: ['Aadhar Card', 'PAN Card', 'Passport Size Photos (4 nos)', 'Address Proof', 'Date of Birth Certificate', '10th Certificate'],
    price: '₹500',
  },
  {
    id: 'government-forms',
    name: 'Government Forms',
    description: 'Assistance with various government forms including income certificate, caste certificate, domicile certificate, and other official documentation.',
    icon: 'FileText',
    documents: ['Aadhar Card', 'Ration Card', 'Self Declaration', 'Supporting Documents (varies)'],
    price: '₹100',
  },
  {
    id: 'online-exam-forms',
    name: 'Online Exam Forms',
    description: 'Fill and submit online examination forms for various competitive exams including UPSC, SSC, Railway, Banking, and state-level exams.',
    icon: 'GraduationCap',
    documents: ['Educational Certificates', 'Aadhar Card', 'Passport Photos', 'Mobile Number', 'Email ID'],
    price: '₹100',
  },
  {
    id: 'resume-creation',
    name: 'Resume Creation',
    description: 'Professional resume/CV creation and formatting services. Get a modern, ATS-friendly resume tailored to your industry and experience level.',
    icon: 'FileOutput',
    documents: ['Personal Details', 'Educational Details', 'Work Experience', 'Skills', 'Passport Photo'],
    price: '₹200',
  },
  {
    id: 'lamination-print',
    name: 'Lamination & Print',
    description: 'High-quality printing and lamination services. Color and black & white printing, document lamination, ID card printing, and binding services.',
    icon: 'Printer',
    documents: ['Original Documents for Copy', 'Digital files for Printing', 'ID Proof'],
    price: '₹20',
  },
  {
    id: 'photocopy',
    name: 'Photocopy',
    description: 'Quick and clear photocopy services for all document sizes. Color and black & white options available with same-day service.',
    icon: 'Copy',
    documents: ['Original Documents'],
    price: '₹2/page',
  },
  {
    id: 'job-applications',
    name: 'Job Applications',
    description: 'Complete assistance with online job application submission for government and private sector jobs. Form filling, document upload, and payment processing.',
    icon: 'Briefcase',
    documents: ['Resume/CV', 'Educational Certificates', 'Aadhar Card', 'Passport Photos', 'Experience Certificates'],
    price: '₹100',
  },
  {
    id: 'scholarship-forms',
    name: 'Scholarship Forms',
    description: 'Assistance with scholarship applications for students. Complete form filling and documentation for central and state government scholarship schemes.',
    icon: 'Award',
    documents: ['Student ID', 'Mark Sheets', 'Income Certificate', 'Aadhar Card', 'Bank Passbook', 'Passport Photo'],
    price: '₹80',
  },
];

export const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM',
];

export const CAFE_INFO = {
  name: 'JassuCafe',
  tagline: 'Your Trusted Digital Services Partner',
  owner: 'Ajay Shukla',
  experience: '12+ Years',
  mission: 'Empowering citizens with seamless access to digital government services, bridging the digital divide, and making technology accessible to everyone in our community.',
  address: 'KDT Plaza, UGF 44, Aliganj, Lucknow, Uttar Pradesh 226021',
  phone: '+91 89328 41664',
  email: 'jassucafe@gmail.com',
  workingHours: 'Monday - Saturday: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 4:00 PM',
  social: {
    whatsapp: 'https://wa.me/9198932841664',
    facebook: '#',
    instagram: '#',
  },
};
