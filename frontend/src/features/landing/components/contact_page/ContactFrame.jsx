import Info from "./ContactInfo";
import Form from "./ContactForm";

function ContactFrame() {
  return (
    <section className="px-6 py-20">
      <div className="container grid gap-10 2xl:grid-cols-2">
        <Info />

        <Form />
      </div>
    </section>
  );
}

export default ContactFrame;
