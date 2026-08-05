import { getCompanyInfo, getCompanyContact } from "../actions/company";
import { ContactClient } from "./contact-client";

export async function generateMetadata() {
  const response = await getCompanyInfo();
  const company = response?.success ? response.data : null;

  return {
    title: "Contato - " + company?.name,
  };
}

export default async function ContactPage() {
  const response = await getCompanyContact();
  const contactData = response?.success ? response.data : null;

  return <ContactClient contactData={contactData} />;
}
