import { PageHeader } from "@/components/PageHeader";
import { createMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${site.legalName}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy">
        <p className="mono mt-6 text-paper-faint">Last updated: July 23, 2026</p>
      </PageHeader>

      <div className="section-pad">
        <div className="container-page">
          <div className="prose-gs max-w-[68ch]">
            <p>
              {site.legalName} (“Greigh Studios,” “we,” “us”) operates {site.domain}. This policy
              explains what information we collect and how we use it.
            </p>
            <h2>Information we collect</h2>
            <p>
              When you use the contact form, we collect the name, email address, project type, and
              message you submit. We may also collect basic technical logs (such as IP address and
              user agent) needed to operate and secure the site.
            </p>
            <h2>How we use information</h2>
            <p>
              We use contact submissions to respond to inquiries and evaluate potential projects. We
              do not sell personal information.
            </p>
            <h2>Email delivery</h2>
            <p>
              Contact form messages are delivered to the studio over our own mail server. We don’t
              share the contents with third-party email marketing services.
            </p>
            <h2>Cookies</h2>
            <p>
              This marketing site does not use advertising cookies. Essential technical cookies or
              local storage may be used by the hosting platform for security and performance.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about this policy: <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
