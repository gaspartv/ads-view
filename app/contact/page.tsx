import { ContactClient } from "./contact-client";

export const metadata = {
  title: "Contato - " + process.env.NEXT_PUBLIC_APP_NAME,
};

export default function ContactPage() {
  return <ContactClient />;
}
