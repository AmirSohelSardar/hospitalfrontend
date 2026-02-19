import { useState } from "react";

const Contact = () => {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xpwzyppl", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setStatus("SUCCESS");
        form.reset();
      } else {
        setStatus("ERROR");
      }
    } catch (error) {
      setStatus("ERROR");
    }
  };

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text__para">
          Got a technical issue? Want to send feedback about a beta feature?
          Let us know.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="form__label">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              required
              className="form__input mt-1"
            />
          </div>

          <div>
            <label htmlFor="subject" className="form__label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Let us know how we can help you"
              required
              className="form__input mt-1"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="message" className="form__label">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder="Leave a comment..."
              required
              className="form__input mt-1"
            />
          </div>

          <button type="submit" className="btn rounded sm:w-fit">
            Submit
          </button>
        </form>

        {/* Status Messages */}
        {status === "SUCCESS" && (
          <p className="mt-4 text-green-500 text-center font-medium">
            ✅ Message sent successfully!
          </p>
        )}
        {status === "ERROR" && (
          <p className="mt-4 text-red-500 text-center font-medium">
            ❌ Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
};

export default Contact;
