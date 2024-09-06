import React, { useState } from 'react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-gray-100 rounded-lg dark:border-gray-700">
      <button
        className="flex items-center justify-between w-full p-8"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h1 className="font-semibold text-gray-700 dark:text-white">{question}</h1>
        <span className={`text-white bg-blue-500 rounded-full ${isOpen ? 'bg-blue-500' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div>
          <hr className="border-gray-200 dark:border-gray-700" />
          <p className="p-8 text-sm text-gray-500 dark:text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FaqSection = () => {
  const faqData = [
    {
      question: 'Bagaimana cara saya mendaftar untuk konsultasi?',
      answer: 'Anda dapat mendaftar untuk konsultasi dengan membuat akun di platform kami. Setelah itu, pilih psikolog yang tersedia dan jadwalkan konsultasi sesuai kenyamanan Anda.',
    },
    {
      question: 'Apakah biaya konsultasi ditanggung oleh asuransi kesehatan?',
      answer: 'Biaya konsultasi tidak ditanggung oleh asuransi kesehatan. Namun, kami menyediakan berbagai paket harga yang dapat Anda pilih sesuai kebutuhan Anda.',
    },
    {
      question: 'Apakah saya memerlukan surat rujukan?',
      answer: 'Tidak, Anda tidak memerlukan surat rujukan untuk menggunakan layanan konsultasi kami. Anda dapat langsung membuat janji dengan psikolog yang Anda pilih.',
    },
    {
      question: 'Apa jam buka layanan konsultasi?',
      answer: 'Layanan konsultasi kami tersedia 24/7. Anda dapat membuat janji kapan saja yang sesuai dengan jadwal Anda.',
    },
    {
      question: 'Apa yang dapat saya harapkan pada konsultasi pertama saya?',
      answer: 'Pada konsultasi pertama, psikolog akan memahami kebutuhan Anda, mengenali isu yang dihadapi, dan bersama-sama membuat rencana untuk mendukung kesehatan mental Anda.',
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container max-w-4xl px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 lg:text-3xl dark:text-white">Pertanyaan yang Sering Diajukan</h1>
        <div className="mt-12 space-y-8">
          {faqData.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;