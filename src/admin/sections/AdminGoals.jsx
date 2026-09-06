import { useState } from "react";
import EditableSection from "../components/EditableSection";
import { FaGraduationCap, FaMedkit, FaHome, FaHandsHelping, FaArrowRight, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const defaultGoals = [
  {
    id: 1,
    title: "Education",
    desc: "Providing quality education and learning resources to empower children through knowledge.",
    icon: "graduation",
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Healthcare",
    desc: "Ensuring access to medical care, nutrition, and mental health support for overall well-being.",
    icon: "medkit",
    color: "from-rose-500 to-rose-600",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    id: 3,
    title: "Safe Shelter",
    desc: "Creating a secure and nurturing environment where children can thrive and feel protected.",
    icon: "home",
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    id: 4,
    title: "Emotional Support",
    desc: "Offering counseling and mentorship programs to help children build resilience and self-esteem.",
    icon: "hands",
    color: "from-green-500 to-green-600",
    bgLight: "bg-green-50",
    textColor: "text-green-600",
  },
];

const iconMap = {
  graduation: <FaGraduationCap />,
  medkit: <FaMedkit />,
  home: <FaHome />,
  hands: <FaHandsHelping />,
};

export default function AdminGoals({ isEditing, onEdit, onClose }) {
  const [goals, setGoals] = useState(defaultGoals);
  const [editingGoal, setEditingGoal] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to backend
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 500);
  };

  const updateGoal = (id, field, value) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const deleteGoal = (id) => {
    if (confirm("Delete this goal?")) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const addGoal = () => {
    const newId = Math.max(...goals.map(g => g.id)) + 1;
    setGoals([...goals, {
      id: newId,
      title: "New Goal",
      desc: "Description of this goal...",
      icon: "hands",
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    }]);
  };

  return (
    <EditableSection
      isEditing={isEditing}
      onEdit={onEdit}
      onClose={onClose}
      onSave={handleSave}
      title="Goals Section"
      saving={saving}
    >
      <section className="py-20 bg-white">
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
                key={goal.id}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-500"
              >
                {/* Edit Controls */}
                {isEditing && (
                  <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <button
                      onClick={() => setEditingGoal(editingGoal === goal.id ? null : goal.id)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${goal.bgLight} group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-5 transition-colors duration-500`}>
                    <span className={`text-2xl ${goal.textColor} group-hover:text-white transition-colors duration-500`}>
                      {iconMap[goal.icon] || <FaHandsHelping />}
                    </span>
                  </div>

                  {/* Editable Title */}
                  {isEditing && editingGoal === goal.id ? (
                    <input
                      type="text"
                      value={goal.title}
                      onChange={(e) => updateGoal(goal.id, "title", e.target.value)}
                      className="w-full text-xl font-bold text-gray-900 mb-3 bg-gray-100 border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors duration-500">
                      {goal.title}
                    </h3>
                  )}

                  {/* Editable Description */}
                  {isEditing && editingGoal === goal.id ? (
                    <textarea
                      value={goal.desc}
                      onChange={(e) => updateGoal(goal.id, "desc", e.target.value)}
                      rows={3}
                      className="w-full text-gray-600 text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1 mb-4"
                    />
                  ) : (
                    <p className="text-gray-600 group-hover:text-white/90 text-sm leading-relaxed mb-4 transition-colors duration-500">
                      {goal.desc}
                    </p>
                  )}

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

            {/* Add New Goal Button */}
            {isEditing && (
              <button
                onClick={addGoal}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <FaPlus className="w-8 h-8 text-gray-400" />
                <span className="text-gray-500 font-medium">Add Goal</span>
              </button>
            )}
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
    </EditableSection>
  );
}
