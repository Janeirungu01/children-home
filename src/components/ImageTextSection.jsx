import children9 from "../assets/children9.jpg";

export default function ImageTextSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl px-4 mx-auto bg-white rounded-tr-3xl flex flex-col md:flex-row overflow-hidden">
        <div
          className="md:w-1/2 h-64 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${children9})` }}

        ></div>

        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center text-center">
          <span className="text-primary uppercase font-medium">
            Make a Difference Today
          </span>
          <h2 className="text-secondary text-2xl md:text-3xl my-3">
            Support Orphans in Extreme Need
          </h2>
          <p className="text-text text-sm md:text-base">
            Brighter Together Foundation has been a beacon of hope for many underprivileged orphans. 
            Our commitment to providing a loving and supportive environment has transformed countless lives making a huge difference in our community.We believe that every child deserves a chance to thrive and we are dedicated to making that a reality through our ongoing programs and initiatives. Donate today and help us 
            continue our mission of restoring hope and building brighter futures for these deserving children.
          </p>
        </div>
      </div>
    </section>
  );
}
