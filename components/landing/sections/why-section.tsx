import { Check, ArrowRight } from "lucide-react";

const WhySection = () => {
  const benefits = [
    { number: "10K+", label: "Active Projects" },
    { number: "50K+", label: "Contributors" },
    { number: "1M+", label: "Lines of Code" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black via-violet-950/10 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Studios Choose Us
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join the fastest growing open source community
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-2">
                {benefit.number}
              </div>
              <p className="text-gray-400">{benefit.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">
              Training is Art, Artists need Tools
            </h3>
            <p className="text-lg text-gray-400 leading-relaxed">
              Built for disciplined teams, this platform turns data into insight
              and effort into visual proof of dedication. We believe in
              empowering game studios with the right tools to build amazing
              things.
            </p>
            <ul className="space-y-3">
              {[
                "Advanced Analytics Dashboard",
                "Real-time Collaboration",
                "Automated CI/CD Integration",
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <button className="flex items-center space-x-2 text-violet-400 hover:text-violet-300 transition font-medium">
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-3xl p-8 border border-white/10">
              <div className="bg-black/50 rounded-2xl p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Performance</span>
                  <span className="text-green-400 text-sm">+23.5%</span>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-9/10 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
