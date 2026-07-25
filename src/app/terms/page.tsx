import { PageHeader } from "@/components/PageHeader";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Terms of Use",
  description: `Terms of use for ${site.legalName}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Use">
        <p className="mono mt-6 text-paper-faint">Last updated: July 23, 2026</p>
      </PageHeader>

      <div className="section-pad">
        <div className="container-page">
          <div className="prose-gs max-w-[68ch]">
            <p>
              By using {site.domain}, you agree to these terms. The site is provided by{" "}
              {site.legalName} for informational and business inquiry purposes.
            </p>
            <h2>Site content</h2>
            <p>
              Content on this site — including case studies, branding, and copy — is owned by{" "}
              {site.legalName} unless otherwise noted. You may not copy or reuse materials without
              permission.
            </p>
            <h2>No professional advice</h2>
            <p>
              Information published here is general in nature and does not constitute legal,
              financial, or professional advice.
            </p>
            <h2>Inquiries and projects</h2>
            <p>
              Submitting a contact form does not create a client relationship. Project engagements
              begin only under a separate written agreement.
            </p>
            <h2>Limitation of liability</h2>
            <p>
              The site is provided “as is.” To the fullest extent permitted by law, {site.legalName}{" "}
              is not liable for damages arising from use of the site.
            </p>
            <h2>Contact</h2>
            <p>
              Questions: <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
