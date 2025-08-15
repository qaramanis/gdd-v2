import { Code, GitBranch, Cpu } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "AI Assistant",
      description:
        "AI-powered insights for quality and potential improvements.",
    },
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "Seamless Collaboration",
      description:
        "Connect with team members and manage documents effortlessly.",
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Performance Metrics",
      description:
        "Track your game's growth and impact with detailed analytics.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Features That Matter
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for developers who want to make a difference in open source
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-white/[0.02] border border-white/10 hover:border-white/30 rounded-2xl p-8 hover:bg-white/[0.05] transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
