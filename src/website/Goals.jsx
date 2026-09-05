import { FaGraduationCap, FaMedkit, FaHome, FaHandsHelping, FaArrowRight } from "react-icons/fa";

const goals = [
  {
    title: "Education",
    desc: "Providing quality education and learning resources to empower children through knowledge.",
    icon: <FaGraduationCap />,
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "Healthcare",
    desc: "Ensuring access to medical care, nutrition, and mental health support for overall well-being.",
    icon: <FaMedkit />,
    color: "from-rose-500 to-rose-600",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    title: "Safe Shelter",
    desc: "Creating a secure and nurturing environment where children can thrive and feel protected.",
    icon: <FaHome />,
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    title: "Emotional Support",
    desc: "Offering counseling and mentorship programs to help children build resilience and self-esteem.",
    icon: <FaHandsHelping />,
    color: "from-green-500 to-green-600",
    bgLight: "bg-green-50",
    textColor: "text-green-600",
  },
];

export default function GoalSection() {
  return (
    <section id="goals" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Our Mission
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Comprehensive Support for Orphans
          </h2>
          <p className="text-gray-600 text-lg">
            Our proactive approach focuses on addressing the multifaceted needs of orphans,
            ensuring they have every opportunity to succeed.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map((goal, index) => (
            <div
              key={goal.title}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 ${goal.bgLight} group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-5 transition-colors duration-500`}>
                  <span className={`text-2xl ${goal.textColor} group-hover:text-white transition-colors duration-500`}>
                    {goal.icon}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors duration-500">
                  {goal.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 group-hover:text-white/90 text-sm leading-relaxed mb-4 transition-colors duration-500">
                  {goal.desc}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-500">
                  <span>Learn more</span>
                  <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Decorative Number */}
              <div className="absolute top-4 right-4 text-6xl font-bold text-gray-50 group-hover:text-white/10 transition-colors duration-500 select-none">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-100">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">150+</div>
            <div className="text-gray-500 text-sm">Children Supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">95%</div>
            <div className="text-gray-500 text-sm">School Enrollment</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">500+</div>
            <div className="text-gray-500 text-sm">Global Donors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">4+</div>
            <div className="text-gray-500 text-sm">Years of Impact</div>
          </div>
        </div>
      </div>
    </section>
  );
}
