import HeroPages from "../components/HeroPages";
import ContactFrame from "../components/contact_page/ContactFrame";
import ContactMap from "../components/contact_page/ContactMap";

export default function ContactPage() {
  return (
      <main>
      <HeroPages page="Contact" />

      <ContactFrame />

      <ContactMap />
    </main>
  );
}
