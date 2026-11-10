export type CourseLanguage = "th" | "en";

export const LANGUAGE_CONTACTS = {
  th: {
    intro: "รายละเอียดเพิ่มเติม สามารถติดต่อได้ที่",
    name: "คุณปรางทิพย์ เรืองพงษ์สาร",
    phoneLabel: "โทร.",
    phone: "081-340-0622",
    email: "pruangpongsarn@aacihealthcare.com",
    channel: "Line ID: prangthipk",
  },
  en: {
    intro: "For more information please contact",
    name: "Mr. Nirachit Rerngsangvatana",
    phoneLabel: "Mobile:",
    phone: "+66 85 2296651",
    email: "nirachit.rerngsangvatana@aacihealthcare.com",
    channel: "WhatsApp ID: +66 85 229 6651",
  },
} satisfies Record<CourseLanguage, { intro: string; name: string; phoneLabel: string; phone: string; email: string; channel: string }>;

export type FeaturedCourse = {
  slug: string;
  title: string;
  shortTitle: string;
  cardSubtitle: string;
  registrationUrl: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  startAt: string;
  availableLanguages: CourseLanguage[];
  schedule: Record<CourseLanguage, string>;
  detailSchedule?: Partial<Record<CourseLanguage, string>>;
  sessionDateSummary?: Partial<Record<CourseLanguage, string>>;
  sessionDates?: Partial<Record<CourseLanguage, { day: string; month: string }[]>>;
  fee: Record<CourseLanguage, string>;
  feeBreakdown?: Partial<Record<CourseLanguage, { label: string; value: string }[]>>;
  feeNote?: Record<CourseLanguage, string>;
  earlyBird: Record<CourseLanguage, string>;
  summary: Record<CourseLanguage, string>;
  description?: Record<CourseLanguage, string>;
  promotions?: Record<CourseLanguage, string[]>;
  promotionTable?: Partial<Record<CourseLanguage, { deadline: string; discount: string; individual: string; organisation: string }[]>>;
  topics?: Record<CourseLanguage, string[]>;
  courseOverview?: Partial<Record<CourseLanguage, string>>;
  applicantRequirements?: Partial<Record<CourseLanguage, {
    intro: string[];
    specialties: { title: string; items: string[] }[];
  }>>;
};

export const FEATURED_COURSES: FeaturedCourse[] = [
  {
    slug: "apac-surveyor-master-class-5",
    title: "Surveyor / Lead Surveyor APAC Master Class 5",
    shortTitle: "APAC Master Class 5",
    cardSubtitle: "Accreditation survey and team leadership across Asia Pacific",
    registrationUrl: "https://forms.gle/pAkMJCF4AnKQ4djM9",
    image: "/courses/apac-surveyor-lead-surveyor-master-class-5-cover-v3.png",
    imageWidth: 1254,
    imageHeight: 1254,
    startAt: "2026-12-08T19:00:00+07:00",
    availableLanguages: ["en"],
    schedule: {
      th: "ทุกวันอังคาร 8 ธันวาคม 2569 ถึง 26 มกราคม 2570 เวลา 19:00–22:00 น.",
      en: "Every Tuesday, 8 December 2026 to 26 January 2027, 7:00–10:00 PM Bangkok time",
    },
    fee: { th: "ค่าลงทะเบียน 1,500 ดอลลาร์สหรัฐ", en: "Registration fee USD 1,500" },
    earlyBird: {
      th: "สมัครภายใน 15 พฤศจิกายน 2569 รับส่วนลด 50%",
      en: "50% early bird discount through 15 November 2026",
    },
    summary: {
      th: "หลักสูตรออนไลน์สำหรับบุคลากรสุขภาพที่ต้องการพัฒนาความรู้ด้านการรับรองคุณภาพ การเยี่ยมสำรวจ และการนำทีมผู้เยี่ยมสำรวจในบริบทเอเชียแปซิฟิก",
      en: "Online professional training for healthcare professionals developing accreditation, survey methodology and survey team leadership skills across Asia Pacific.",
    },
    courseOverview: {
      en: "Develop the knowledge and skills required to conduct a survey of a healthcare organisation's system according to AACI International Accreditation Standards. Over four days you will gain the knowledge and skills required to undertake and lead a successful accreditation survey. You will acquire the skills to plan, conduct, report and follow up a survey that establishes conformity and enhances overall organisational performance. You will sit a 2-hour exam to test your knowledge and understanding.",
    },
    topics: {
      th: ["ความรู้เบื้องต้นเกี่ยวกับการรับรอง", "ความรู้เบื้องต้นเกี่ยวกับมาตรฐาน AACI", "หลักการเยี่ยมสำรวจ", "การเตรียมและเริ่มต้นการเยี่ยมสำรวจ", "กิจกรรมเยี่ยมสำรวจ ณ สถานที่ตั้ง", "การปิดการเยี่ยมสำรวจ", "การสอบปลายหลักสูตร"],
      en: ["Introduction to accreditation", "Introduction to AACI Standards", "Survey principles", "Preparation and launching of a survey", "On-site survey activities", "Closing the survey", "Final exam"],
    },
    applicantRequirements: {
      en: {
        intro: [
          "Applicants may be considered for Surveyor positions if they can demonstrate minimum educational qualifications, work experience and personal development activities that demonstrate the communication, technical, business and analytical skills necessary to conduct or manage surveys in healthcare settings.",
          "Applicants must submit documentation of relevant work experience in a healthcare setting. Specific requirements for each Surveyor specialty are listed below.",
        ],
        specialties: [
          {
            title: "Clinical Surveyor",
            items: [
              "Must be able to demonstrate qualifications as a licensed physician or registered nurse.",
              "Must be able to demonstrate at least ten years of clinical work experience in a healthcare setting as a physician or registered nurse, in accordance with local requirements and laws.",
            ],
          },
          {
            title: "Governance Surveyor",
            items: [
              "Must hold at least a tertiary degree in a relevant field, including health management, public health, nursing, occupational health and safety, risk management, pharmacy or quality management.",
              "Must have at least five years of work experience in an administrative, technical or clinical position in a healthcare setting or an ISQua accredited facility related to healthcare.",
            ],
          },
          {
            title: "Physical Environment Surveyor",
            items: [
              "Must hold at least one university degree in a relevant field, including occupational health and safety, mechanical engineering, biomedical engineering, physics, biophysics, biology or chemistry.",
              "Must demonstrate competence and specialised training in occupational health and safety management, including fire safety, in a healthcare setting.",
              "Must have professional experience in Facilities Management, including safety projects.",
              "Must have experience in risk assessment, quality control assessment or improvement, life safety codes, waste management, and medical devices or clinical engineering.",
              "Must have at least three years of work experience, including at least two years in a healthcare setting in a position related to facilities management, risk management, maintenance, safety or life safety management.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "surveyor-lead-surveyor-master-class-15",
    title: "Surveyor / Lead Surveyor Master Class 15",
    shortTitle: "Master Class 15",
    cardSubtitle: "Survey methodology and team leadership under AACI standards",
    registrationUrl: "https://forms.gle/1kMyJ66C9s2K2CBB6",
    image: "/courses/surveyor-lead-surveyor-master-class-15-cover.png",
    imageWidth: 1254,
    imageHeight: 1254,
    startAt: "2027-01-04T19:00:00+07:00",
    availableLanguages: ["th"],
    schedule: {
      th: "ทุกวันจันทร์ 4 มกราคม ถึง 1 มีนาคม 2570 เวลา 19:00–22:00 น. รวม 9 ครั้ง",
      en: "Every Monday, 4 January to 1 March 2027, 7:00–10:00 PM Bangkok time, 9 sessions",
    },
    fee: {
      th: "บุคคลธรรมดา 44,940 บาท · นิติบุคคล 43,680 บาท",
      en: "Individual THB 44,940 · Organisation THB 43,680",
    },
    earlyBird: {
      th: "ชำระภายใน 30 พฤศจิกายน 2569 รับส่วนลด 50%",
      en: "50% discount for payment by 30 November 2026",
    },
    summary: {
      th: "พัฒนาความรู้และทักษะที่จำเป็นสำหรับการเป็นผู้เยี่ยมสำรวจหรือหัวหน้าทีมผู้เยี่ยมสำรวจ ตามมาตรฐานการรับรองสากลของ AACI",
      en: "Develop the knowledge and skills required to become an AACI Surveyor or Survey Team Leader under international accreditation standards.",
    },
    applicantRequirements: {
      th: {
        intro: [
          "ผู้สมัครอาจได้รับการพิจารณาสำหรับตำแหน่งผู้เยี่ยมสำรวจ (Surveyor) หากสามารถแสดงให้เห็นถึงคุณสมบัติทางการศึกษาขั้นต่ำ ประสบการณ์การทำงาน และกิจกรรมพัฒนาตนเองอื่น ๆ ที่แสดงถึงทักษะด้านการสื่อสาร ด้านเทคนิค และด้านธุรกิจ รวมถึงทักษะการวิเคราะห์ที่จำเป็นต่อการดำเนินการหรือจัดการเยี่ยมสำรวจในสถานพยาบาลด้านการดูแลสุขภาพ",
          "ผู้สมัครต้องยื่นเอกสารประสบการณ์การทำงานที่เกี่ยวข้องในสถานพยาบาลด้านการดูแลสุขภาพตามข้อกำหนด",
          "ข้อกำหนดเฉพาะสำหรับผู้เยี่ยมสำรวจแต่ละสาขามีดังต่อไปนี้",
        ],
        specialties: [
          {
            title: "ผู้ตรวจประเมินด้านคลินิก (The Clinical Surveyor)",
            items: [
              "ต้องสามารถแสดงคุณสมบัติว่าเป็นแพทย์ที่ได้รับใบอนุญาตประกอบวิชาชีพ หรือเป็นพยาบาลวิชาชีพ (Registered Nurse)",
              "ต้องสามารถแสดงประสบการณ์ทำงานด้านคลินิกในสถานพยาบาลไม่น้อยกว่าสิบ (10) ปี ในฐานะแพทย์หรือพยาบาลวิชาชีพ โดยเป็นไปตามข้อกำหนดและกฎหมายท้องถิ่น",
            ],
          },
          {
            title: "ผู้ตรวจประเมินด้านธรรมาภิบาล (The Governance Surveyor)",
            items: [
              "มีวุฒิการศึกษาระดับอุดมศึกษาอย่างน้อยในสาขาที่เกี่ยวข้อง ได้แก่ การบริหารจัดการด้านสุขภาพ สาธารณสุข การพยาบาล อาชีวอนามัยและความปลอดภัย การบริหารความเสี่ยง เภสัชศาสตร์ และการบริหารคุณภาพ",
              "มีประสบการณ์การทำงานอย่างน้อยห้า (5) ปี ในตำแหน่งด้านการบริหาร ด้านเทคนิค หรือด้านคลินิก ในสถานพยาบาลหรือองค์กรรับรองมาตรฐานที่ได้รับการรับรองจาก ISQua ที่เกี่ยวข้องกับการดูแลสุขภาพ",
            ],
          },
          {
            title: "ผู้ตรวจประเมินด้านสิ่งแวดล้อมทางกายภาพ (The Physical Environment Surveyor)",
            items: [
              "มีวุฒิการศึกษาระดับอุดมศึกษาอย่างน้อยในสาขาที่เกี่ยวข้อง ได้แก่ อาชีวอนามัยและความปลอดภัย วิศวกรรมเครื่องกล หรือวิศวกรรมชีวการแพทย์ ฟิสิกส์หรือชีวฟิสิกส์ ชีววิทยา หรือเคมี",
              "สามารถแสดงให้เห็นถึงความสามารถและการฝึกอบรมเฉพาะทางในด้านการบริหารจัดการอาชีวอนามัยและความปลอดภัย รวมถึงความปลอดภัยจากอัคคีภัยในสถานพยาบาล",
              "มีประสบการณ์วิชาชีพด้านการบริหารจัดการสถานที่ (Facilities Management) รวมถึงโครงการด้านความปลอดภัย",
              "มีประสบการณ์ด้านการประเมินความเสี่ยง การประเมินหรือการปรับปรุงการควบคุมคุณภาพ มาตรฐานความปลอดภัยในชีวิต (Life Safety Code) การจัดการของเสีย และมีประสบการณ์เกี่ยวกับอุปกรณ์ทางการแพทย์หรือวิศวกรรมคลินิก",
              "มีประสบการณ์การทำงานอย่างน้อยสาม (3) ปี โดยอย่างน้อยสองปีต้องเป็นการทำงานในสถานพยาบาลในตำแหน่งที่เกี่ยวข้องกับการบริหารจัดการสถานที่ การบริหารความเสี่ยง งานบำรุงรักษา หรือการบริหารจัดการด้านความปลอดภัยและความปลอดภัยในชีวิต",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "iso-9001-2026-iso-7101-2023-lead-auditor-master-class-5",
    title: "AACI ISO 9001:2026 and ISO 7101:2023 Lead Auditor Master Class 5",
    shortTitle: "ISO Lead Auditor Master Class 5",
    cardSubtitle: "ISO quality management and healthcare organisation auditing",
    registrationUrl: "https://forms.gle/xXgcMCAQGVrMwYf56",
    image: "/courses/aaci-iso-lead-auditor-master-class-5-cover.png",
    imageWidth: 1254,
    imageHeight: 1254,
    startAt: "2026-12-09T19:00:00+07:00",
    availableLanguages: ["th"],
    schedule: {
      th: "ทุกวันพุธ 9 ธันวาคม 2569 ถึง 3 กุมภาพันธ์ 2570 เวลา 19:00–22:00 น. รวม 9 ครั้ง",
      en: "Every Wednesday, 9 December 2026 to 3 February 2027, 7:00–10:00 PM Bangkok time, 9 sessions",
    },
    detailSchedule: {
      th: "ทุกวันพุธ 9 ธันวาคม 2569 ถึง 3 กุมภาพันธ์ 2570 · รวม 9 ครั้ง",
    },
    sessionDateSummary: {
      th: "ทุกวันพุธ · ธันวาคม 2569 ถึง กุมภาพันธ์ 2570 · รวม 9 ครั้ง",
    },
    sessionDates: {
      th: [
        { day: "9", month: "ธ.ค." },
        { day: "16", month: "ธ.ค." },
        { day: "23", month: "ธ.ค." },
        { day: "30", month: "ธ.ค." },
        { day: "6", month: "ม.ค." },
        { day: "13", month: "ม.ค." },
        { day: "20", month: "ม.ค." },
        { day: "27", month: "ม.ค." },
        { day: "3", month: "ก.พ." },
      ],
    },
    fee: {
      th: "บุคคลธรรมดา 44,940 บาท · นิติบุคคล 43,680 บาท",
      en: "Individual THB 44,940 · Organisation THB 43,680",
    },
    feeBreakdown: {
      th: [
        { label: "บุคคลธรรมดา", value: "44,940 บาท" },
        { label: "นิติบุคคล", value: "43,680 บาท" },
      ],
    },
    feeNote: {
      th: "ราคารวมภาษีมูลค่าเพิ่มและภาษีหัก ณ ที่จ่ายแล้ว",
      en: "Prices include VAT and withholding tax.",
    },
    earlyBird: {
      th: "ชำระภายใน 15 พฤศจิกายน 2569 รับส่วนลด 30%",
      en: "Pay by 15 November 2026 for 30% off.",
    },
    promotions: {
      th: [
        "ชำระภายใน 15 พฤศจิกายน 2569 ลด 30% — บุคคลธรรมดา 31,458 บาท · นิติบุคคล 30,576 บาท",
      ],
      en: [
        "Pay by 15 November 2026 for 30% off — Individual THB 31,458 · Organisation THB 30,576",
      ],
    },
    promotionTable: {
      th: [
        { deadline: "15 พฤศจิกายน 2569", discount: "ลด 30%", individual: "31,458 บาท", organisation: "30,576 บาท" },
      ],
    },
    summary: {
      th: "พัฒนาความรู้และทักษะเพื่อเป็นผู้ตรวจประเมินหรือหัวหน้าทีมผู้ตรวจประเมินระบบองค์กรด้านสุขภาพ ตามมาตรฐาน ISO 9001:2026 และ ISO 7101:2023",
      en: "Develop the knowledge and skills to become an auditor or lead auditor for healthcare organisation management systems under ISO 9001:2026 and ISO 7101:2023.",
    },
    description: {
      th: "หลักสูตร Lead Auditor ของ AACI ซึ่งได้รับการรับรองจาก International Accreditation Forum หรือ IAF รองรับการอบรมและออกใบคุณวุฒิ Certificate of ISO Lead Auditor เพื่อเตรียมความพร้อมสำหรับการรับรองแบบ Dual Accreditation and Certification: AACI plus ISO ผู้เยี่ยมสำรวจหรือผู้ตรวจประเมินจึงสามารถตรวจประเมิน AACI และ ISO ได้ภายในการเยี่ยมสำรวจครั้งเดียว",
      en: "AACI Lead Auditor training, accredited by the International Accreditation Forum or IAF, supports the Certificate of ISO Lead Auditor and prepares participants for AACI plus ISO dual accreditation and certification, enabling AACI and ISO assessment within one survey visit.",
    },
    courseOverview: {
      th: "พัฒนาความรู้และทักษะที่จำเป็นในการดำเนินการตรวจประเมินระบบขององค์กรด้านการดูแลสุขภาพตามมาตรฐาน ISO ตลอดสี่วัน ท่านจะได้รับความรู้และทักษะที่จำเป็นในการดำเนินการและเป็นผู้นำการตรวจประเมินที่ประสบความสำเร็จ รวมถึงทักษะในการวางแผน ดำเนินการ จัดทำรายงาน และติดตามการตรวจประเมิน เพื่อกำหนดความสอดคล้องและเพิ่มประสิทธิภาพโดยรวมขององค์กร พร้อมการสอบ 2 ชั่วโมงเพื่อทดสอบความรู้และความเข้าใจ",
    },
    topics: {
      th: [
        "ข้อกำหนดและการประยุกต์ใช้ ISO 9001:2026",
        "ระบบการจัดการองค์กรสุขภาพตาม ISO 7101:2023",
        "หลักการและกระบวนการตรวจประเมิน",
        "การวางแผนและบริหารทีมผู้ตรวจประเมิน",
        "การรายงานผลและติดตามข้อบกพร่อง",
        "การตรวจประเมินแบบ AACI plus ISO",
      ],
      en: [
        "ISO 9001:2026 requirements and application",
        "Healthcare organisation management under ISO 7101:2023",
        "Audit principles and processes",
        "Audit planning and team leadership",
        "Audit reporting and follow up",
        "AACI plus ISO dual assessment",
      ],
    },
  },
];

export const UPCOMING_COURSES = [
  ["Clinical Excellence Certification for Oncology Services", "/services/courses/oncology-services", "Focused training in quality, safety and service standards for oncology care.", "/courses/clinical-excellence-oncology-cover.png"],
  ["Clinical Excellence Certification for Endoscopy Services", "/services/courses/endoscopy-services", "Strengthen clinical quality, patient safety and consistent practice across endoscopy services.", "/endoscopy-safety-huddle.png"],
  ["Clinical Excellence Certification for Maternity Services", "/services/courses/maternity-services", "Develop safer, evidence-informed systems for maternity care and service improvement.", "/healthcare-accreditation-team.png"],
  ["Tips, Techniques & Tools for Enterprise Risk Management", "/services/courses/risk-register", "Practical methods and tools for identifying, assessing and managing enterprise risk.", "/management-quality-review.png"],
  ["Clinical Excellence Certification for Acute Stroke Care", "/services/courses/acute-stroke-care", "Build reliable care pathways and quality systems for safe, timely acute stroke services.", "/acute-stroke-team.png"],
  ["Assessment Process and Survey Methodology for AACI International Standards Version 6.4 including IPS", "/services/courses/survey-readiness", "Understand AACI Version 6.4 requirements, IPS and the survey assessment methodology.", "/aaci-accreditation.webp"],
  ["AACI Enterprise Risk Management Training", "/services/courses/risk-register", "Build a structured approach to risk governance, controls and organisational resilience.", "/iso-7101-healthcare-governance.png"],
  ["AACI Survey-Readiness Training", "/services/courses/survey-readiness", "Prepare healthcare teams, evidence and systems for an effective AACI accreditation survey.", "/healthcare-accreditation-rounds.png"],
] as const;

export function getFeaturedCourse(slug: string) {
  return FEATURED_COURSES.find((course) => course.slug === slug);
}
