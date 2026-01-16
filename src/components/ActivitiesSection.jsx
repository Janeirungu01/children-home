import children2 from "../assets/children2.jpg";
import children5 from "../assets/children5.jpg";
import children6 from "../assets/children6.jpg";
import children11 from "../assets/children11.jpg";

const activities = [
  {
    title: "Back to School Drive",
    location: "Community Center Hall",
    desc: "Providing school supplies and backpacks to children.",
    image: children2,
  },
  {
    title: "Health and Wellness Fair",
    location: "City Park Pavilion",
    desc: "Free health screenings and wellness workshops.",
    image: children6,
  },
  {
    title: "Annual Fundraising Gala",
    location: "Grand Ballroom",
    desc: "Raising funds for our programs.",
    image: children5,
  },
  {
    title: "Holiday Toy Giveaway",
    location: "Community Center Hall",
    desc: "Spreading holiday joy to children.",
    image: children11,
  },
];

export default function ActivitiesSection() {
  return (
    <section id="program" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center px-4">
        <span className="text-primary uppercase font-semibold">Our Latest News</span>
        <h2 className="text-secondary text-3xl md:text-4xl my-2">
          Recent Activities and Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {activities.map((a) => (
            <div
              key={a.title}
              className="bg-white rounded-tr-3xl rounded-bl-3xl shadow overflow-hidden"
            >
              <img
                src={a.image}
                alt={a.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-secondary text-lg mb-1">{a.title}</h3>
                <p className="text-sm text-text mb-1">Location: {a.location}</p>
                <p className="text-sm text-text">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
