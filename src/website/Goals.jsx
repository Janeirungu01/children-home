import { FaGraduationCap, FaMedkit, FaHome, FaHandsHelping } from "react-icons/fa";

const goals = [
  {
    title: "Education",
    desc: "Providing quality education and learning resources to empower children through knowledge.",
    icon: <FaGraduationCap size={40} className="text-primary" />,
  },
  {
    title: "Healthcare",
    desc: "Ensuring access to medical care, nutrition, and mental health support for overall well-being.",
    icon: <FaMedkit size={40} className="text-primary" />,
  },
  {
    title: "Safe Shelter",
    desc: "Creating a secure and nurturing environment where children can thrive and feel protected.",
    icon: <FaHome size={40} className="text-primary" />,
  },
  {
    title: "Emotional Support",
    desc: "Offering counseling and mentorship programs to help children build resilience and self-esteem.",
    icon: <FaHandsHelping size={40} className="text-primary" />,
  },
];

export default function GoalSection() {
  return (
    <section id="goal" className="py-4 bg-white">
      <div className="max-w-7xl mx-auto text-center px-4">
        <span className="text-primary uppercase font-medium text-2xl">Our Goal</span>
        <h2 className="text-secondary text-3xl md:text-4xl font-medium my-2">
          Comprehensive Support for Orphans
        </h2>
        <p className="text-text max-w-3xl mx-auto mb-10">
          Our proactive approach focuses on addressing the multifaceted needs of orphans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {goals.map((g) => (
            <div
              key={g.title}
              className="bg-gray-50 p-8 rounded-tr-3xl rounded-bl-3xl shadow-lg text-center"
            >
              <div className="flex justify-center mb-4">{g.icon}</div>
              <h3 className="text-secondary text-xl mb-2">{g.title}</h3>
              <p className="text-text text-sm">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
