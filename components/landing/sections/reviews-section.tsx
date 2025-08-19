import { Star } from "lucide-react";

const ReviewsSection = () => {
  const reviews = [
    {
      name: "Alex Chen",
      role: "Senior Developer",
      rating: 5,
      text: "---",
    },
    {
      name: "Sarah Williams",
      role: "Tech Lead",
      rating: 5,
      text: "---",
    },
    {
      name: "Marcus Johnson",
      role: "Full Stack Dev",
      rating: 5,
      text: "---",
    },
    {
      name: "Emma Davis",
      role: "DevOps Engineer",
      rating: 5,
      text: "---",
    },
  ];

  return (
    <section id="reviews" className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Loved by Developers
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what the community is building with our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] transition-all"
            >
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-violet-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {review.text}
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-semibold text-white">{review.name}</p>
                <p className="text-sm text-gray-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
