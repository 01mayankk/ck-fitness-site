// ⭐ HERO SECTION FOR CK FITNESS
// This is the first section with branding + CTA

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center text-center px-6 bg-[#0A0F1F]">
      <div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          CK FITNESS
        </h1>

        <p className="text-xl text-gray-300 mt-4">
          Transform Your Body. Transform Your Life.
        </p>

        <p className="text-lg text-[#00C2A8] mt-2">
          Opening on <strong>December 15, 2025</strong>
        </p>

        <button className="mt-8 px-8 py-3 bg-[#00C2A8] text-black font-bold rounded-lg hover:bg-[#00e6c8] transition">
          Pre-register Now
        </button>
      </div>
    </section>
  );
}
