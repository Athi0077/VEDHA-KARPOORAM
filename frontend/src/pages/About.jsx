const About = () => {
  return (
    <div className="py-20 animate-in fade-in duration-500 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-amber-950 mb-6">Our Story</h1>
          <div className="w-24 h-1 bg-amber-300 mx-auto rounded-full"></div>
        </div>
        
        <div className="prose prose-lg text-gray-600 mx-auto font-serif">
          <p className="lead text-xl text-amber-900 font-medium text-center mb-10">
            Vedha Karpooram was born out of a desire to bring pure, untainted devotion back to our daily rituals.
          </p>
          <div className="space-y-8">
            <p>
              For generations, lighting camphor has been an integral part of Indian traditions, symbolizing the burning away of ego and the spreading of light. However, as times changed, so did the purity of the camphor available to us.
            </p>
            <p>
              We noticed that many camphor products left behind a dark residue, produced unpleasant smoke, and lacked the divine fragrance that we remembered from our childhood. That's when we decided to create Vedha Karpooram.
            </p>
            <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100 my-12 text-center shadow-inner">
              <h3 className="text-2xl font-serif text-amber-900 mb-4">Our Promise</h3>
              <p className="text-gray-700 italic">
                "To provide 100% pure, soot-free, and aromatically superior camphor that elevates your spiritual connection and brings peace to your environment."
              </p>
            </div>
            <p>
              Today, Vedha Karpooram stands for uncompromising quality. Our camphor is meticulously sourced and refined to ensure that every flame burns bright, clean, and fills your space with a calming, spiritual aroma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
