
import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import Journey from "../components/Journey";

export default function SeoPage({ page }) {
  if (!page) {
    return <p>Page not found.</p>;
  }

  const isBusFoodPage = page.category === "Bus Food";
  const isBusTicketsPage = page.url === "/bus/bangalore/";

  const h1Heading = page.h1 || page.name || page.title;

  // Pages that display a CTA near the top.
  const showTopCta = [
    "/food/bangalore/",
    "/food/home-chefs/bangalore/",
    "/bus-food/",
    "/bus-food/bangalore/",
    "/bus-food/ksrtc/",
    "/bus/bangalore/",
    "/bus/bangalore/booking/",
    "/bus/bangalore/booking",
    "/bus/bangalore-to-mysore/",
    "/bus/bangalore-to-chennai/",
    "/bus/bangalore-to-hyderabad/",
    "/bus/bangalore-to-mangalore/",
    "/bus/bangalore-to-goa/",
    "/places/bangalore/",
    "/recipes/bangalore/",
  ].includes(page.url);

  // Default CTA destinations.
  const defaultCtaUrl = isBusTicketsPage
    ? "/bus/bangalore/booking/"
    : isBusFoodPage
      ? "/bus-food/bangalore/"
      : "/food/homemade-food/bangalore/";

  // Default CTA labels.
  const defaultCtaText = isBusTicketsPage
    ? "Explore Bus Travel Options"
    : page.url === "/bus-food/ksrtc/"
      ? "Explore Bus Food Delivery"
      : isBusFoodPage
        ? "Explore Bus Food Bangalore"
        : "Order Food";

  // Support page-specific top CTA settings.
  const topCtaText =
    page.topCta?.text ||
    page.topCta?.buttonText ||
    page.cta?.buttonText ||
    defaultCtaText;

  const topCtaUrl =
    page.topCta?.url ||
    page.cta?.url ||
    defaultCtaUrl;

  // Normalize image data from a string or object.
  const normalizeImage = (image, fallbackAlt = "") => {
    if (!image) return null;

    if (typeof image === "string") {
      return {
        src: image,
        alt: fallbackAlt,
      };
    }

    if (typeof image === "object" && image.src) {
      return {
        src: image.src,
        alt: image.alt || fallbackAlt,
        caption: image.caption,
      };
    }

    return null;
  };

  // Render image galleries.
  const renderImages = (images, className = "seo-images") => {
    if (!Array.isArray(images) || images.length === 0) {
      return null;
    }

    const validImages = images
      .map((image) => normalizeImage(image))
      .filter(Boolean);

    if (validImages.length === 0) return null;

    return (
      <div className={className}>
        {validImages.map((image, index) => (
          <figure
            className="seo-image-card"
            key={`${image.src}-${index}`}
          >
            <img
              className="seo-gallery-image"
              src={image.src}
              alt={image.alt}
              loading="lazy"
              style={{
                display: "block",
                maxWidth: "100%",
                height: "auto",
              }}
            />

            {image.caption && (
              <figcaption>{image.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    );
  };

  // Normalize supported table formats.
  const normalizeTable = (table) => {
    if (!table) return null;

    // Object format:
    // { title, headers: [], rows: [] }
    if (!Array.isArray(table) && Array.isArray(table.rows)) {
      const rows = table.rows.map((row) => {
        if (Array.isArray(row)) return row;

        if (row && typeof row === "object") {
          return Object.values(row);
        }

        return [row ?? "—"];
      });

      const headers =
        Array.isArray(table.headers) && table.headers.length > 0
          ? table.headers
          : rows[0]?.map(
              (_, index) => `Column ${index + 1}`
            ) || [];

      return { title: table.title, headers, rows };
    }

    // Array format.
    if (Array.isArray(table) && table.length > 0) {
      const firstRow = table[0];

      if (!firstRow || typeof firstRow !== "object") {
        return null;
      }

      if (
        firstRow.details !== undefined ||
        firstRow.route !== undefined
      ) {
        const hasWhatToCheck = table.some(
          (row) => row.whatToCheck !== undefined
        );

        return {
          headers: hasWhatToCheck
            ? ["Bus Route", "Journey Details", "What to Check"]
            : ["Bus Route", "Journey Details"],
          rows: table.map((row) =>
            hasWhatToCheck
              ? [
                  row.category ?? row.route ?? "—",
                  row.details ?? "—",
                  row.whatToCheck ?? "—",
                ]
              : [
                  row.category ?? row.route ?? "—",
                  row.details ?? "—",
                ]
          ),
        };
      }

      if (firstRow.category !== undefined) {
        const hasWhatToCheck = table.some(
          (row) => row.whatToCheck !== undefined
        );

        return {
          headers: hasWhatToCheck
            ? ["Food Category", "Examples", "What to Check"]
            : ["Food Category", "Examples"],
          rows: table.map((row) =>
            hasWhatToCheck
              ? [
                  row.category ?? "—",
                  row.examples ?? "—",
                  row.whatToCheck ?? "—",
                ]
              : [
                  row.category ?? "—",
                  row.examples ?? "—",
                ]
          ),
        };
      }

      if (firstRow.food !== undefined) {
        const hasWhatToCheck = table.some(
          (row) => row.whatToCheck !== undefined
        );

        return {
          headers: hasWhatToCheck
            ? ["Food", "Best For", "What to Check"]
            : ["Food", "Best For"],
          rows: table.map((row) =>
            hasWhatToCheck
              ? [
                  row.food ?? "—",
                  row.bestFor ?? "—",
                  row.whatToCheck ?? "—",
                ]
              : [
                  row.food ?? "—",
                  row.bestFor ?? "—",
                ]
          ),
        };
      }

      const keys = Object.keys(firstRow);

      return {
        headers: keys.map((key) =>
          key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (letter) => letter.toUpperCase())
        ),
        rows: table.map((row) =>
          keys.map((key) => row[key] ?? "—")
        ),
      };
    }

    return null;
  };

  // Render a table.
  const renderTable = (table) => {
    const normalized = normalizeTable(table);

    if (!normalized || normalized.headers.length === 0) {
      return null;
    }

    return (
      <div className="seo-table-wrapper">
        <table className="seo-table">
          <thead>
            <tr>
              {normalized.headers.map((header, index) => (
                <th scope="col" key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {normalized.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {normalized.headers.map((_, cellIndex) => (
                  <td key={cellIndex}>
                    {row[cellIndex] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render a section or subsection image.
  const renderSectionImage = (image, alt, heading) => {
    const normalized = normalizeImage(
      image,
      alt || heading || ""
    );

    if (!normalized) return null;

    return (
      <figure className="seo-section-image">
        <img
          className="seo-gallery-image"
          src={normalized.src}
          alt={normalized.alt}
          loading="lazy"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "720px",
            height: "auto",
            margin: "20px 0",
            borderRadius: "8px",
          }}
        />

        {normalized.caption && (
          <figcaption>{normalized.caption}</figcaption>
        )}
      </figure>
    );
  };

  // Render a string or array of paragraphs.
  const renderParagraphs = (content, keyPrefix = "paragraph") => {
    if (!content) return null;

    const paragraphs = Array.isArray(content)
      ? content
      : [content];

    return paragraphs.map((paragraph, index) => (
      <p key={`${keyPrefix}-${index}`}>{paragraph}</p>
    ));
  };

  // Render FAQs.
  const renderFaqs = (faqs) => {
    if (!Array.isArray(faqs) || faqs.length === 0) {
      return null;
    }

    return faqs.map((faq, index) => (
      <div
        className="faq-item"
        key={faq.question || index}
      >
        <h3>{faq.question}</h3>
        <p>{faq.answer}</p>
      </div>
    ));
  };

  // Render reusable CTA data.
  const renderCta = (cta, fallbackUrl = defaultCtaUrl) => {
    if (!cta) return null;

    if (typeof cta === "string") {
      return (
        <div className="cta-section">
          <p>{cta}</p>
          <Link className="cta-button" to={fallbackUrl}>
            {cta}
          </Link>
        </div>
      );
    }

    return (
      <div className="cta-section">
        {cta.heading && <h2>{cta.heading}</h2>}
        {cta.text && <p>{cta.text}</p>}

        <Link
          className="cta-button"
          to={cta.url || fallbackUrl}
        >
          {cta.buttonText || cta.text || "Learn More"}
        </Link>
      </div>
    );
  };

  return (
    <>
      <SeoHead
        title={page.title}
        description={page.description}
        url={page.url}
      />

      {/* Breadcrumb navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {" / "}

        {page.category && (
          <>
            {page.category}
            {" / "}
          </>
        )}

        <span>{page.name || h1Heading}</span>
      </nav>

      {/* Hero section */}
      <section className="hero">
        <div className="hero-inner">
          <h1>{h1Heading}</h1>

          {page.intro && (
            <div className="seo-intro">
              {renderParagraphs(page.intro, "intro")}
            </div>
          )}

          {/* Top CTA */}
          {showTopCta && (
            <div className="top-cta">
              <Link
                className="cta-button top-cta-button"
                to={topCtaUrl}
              >
                {topCtaText}
              </Link>
            </div>
          )}
        </div>

        {isBusFoodPage && <Journey />}
      </section>

      {/* Main page content */}
      <section className="content">
        {renderParagraphs(page.paragraph, "page-paragraph")}

        {/* PAGE-LEVEL TABLE: appears after the introduction */}
        {page.table && (
          <section className="seo-section seo-table-section">
            {page.table.title && <h2>{page.table.title}</h2>}
            {renderTable(page.table)}
          </section>
        )}

        {page.sections?.map((section, index) => (
          <section
            className="seo-section"
            id={section.id || undefined}
            key={section.heading || index}
          >
            {section.heading && <h2>{section.heading}</h2>}

            {section.image &&
              renderSectionImage(
                section.image,
                section.imageAlt,
                section.heading
              )}

            {section.content &&
              renderParagraphs(
                section.content,
                `section-${index}-content`
              )}

            {section.paragraphs &&
              renderParagraphs(
                section.paragraphs,
                `section-${index}-paragraph`
              )}

            {/* Section CTA */}
            {section.cta && renderCta(section.cta, section.ctaUrl)}

            {section.text &&
              renderParagraphs(
                section.text,
                `section-${index}-text`
              )}

            {/* Generic section items */}
            {section.items?.map((item, itemIndex) => (
              <div
                key={item.heading || itemIndex}
                className="seo-item"
              >
                {item.heading && <h3>{item.heading}</h3>}

                {item.content && renderParagraphs(item.content)}
                {item.text && renderParagraphs(item.text)}
                {item.paragraphs &&
                  renderParagraphs(item.paragraphs)}

                {item.image &&
                  renderSectionImage(
                    item.image,
                    item.imageAlt,
                    item.heading
                  )}

                {item.bullets?.length > 0 && (
                  <ul className="features">
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {item.table && renderTable(item.table)}
              </div>
            ))}

            {/* Subsections */}
            {section.subsections?.map(
              (subsection, subsectionIndex) => (
                <div
                  className="seo-subsection"
                  key={subsection.heading || subsectionIndex}
                >
                  {subsection.heading && (
                    <h3>{subsection.heading}</h3>
                  )}

                  {subsection.image &&
                    renderSectionImage(
                      subsection.image,
                      subsection.imageAlt,
                      subsection.heading
                    )}

                  {subsection.content &&
                    renderParagraphs(subsection.content)}

                  {subsection.paragraphs &&
                    renderParagraphs(subsection.paragraphs)}

                  {subsection.text &&
                    renderParagraphs(subsection.text)}

                  {subsection.bullets?.length > 0 && (
                    <ul className="features">
                      {subsection.bullets.map(
                        (bullet, bulletIndex) => (
                          <li key={bulletIndex}>{bullet}</li>
                        )
                      )}
                    </ul>
                  )}

                  {subsection.table &&
                    renderTable(subsection.table)}

                  {subsection.items?.map(
                    (item, itemIndex) => (
                      <div
                        key={item.heading || itemIndex}
                        className="seo-item"
                      >
                        {item.heading && <h4>{item.heading}</h4>}

                        {item.content &&
                          renderParagraphs(item.content)}

                        {item.text &&
                          renderParagraphs(item.text)}

                        {item.table &&
                          renderTable(item.table)}
                      </div>
                    )
                  )}

                  {subsection.faqs &&
                    renderFaqs(subsection.faqs)}
                </div>
              )
            )}

            {section.bullets?.length > 0 && (
              <ul className="features">
                {section.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{bullet}</li>
                ))}
              </ul>
            )}

            {section.table && (
              <>
                {section.table.title && <h3>{section.table.title}</h3>}
                {renderTable(section.table)}
              </>
            )}

            {section.faqs?.length > 0 && (
              <div className="faq-list">
                {renderFaqs(section.faqs)}
              </div>
            )}

            {renderImages(section.images)}
          </section>
        ))}
      </section>

      {/* Page-level image gallery */}
      {page.images?.length > 0 && (
        <section className="content">
          {renderImages(
            page.images,
            "seo-images seo-page-image-gallery"
          )}
        </section>
      )}

      {/* Related internal links */}
      {page.relatedLinks?.length > 0 && (
        <section className="content">
          <h2>
            {page.internalLinksHeading || "Explore Related Pages"}
          </h2>

          <ul className="related">
            {page.relatedLinks.map((link, index) => (
              <li key={link.url || index}>
                <Link to={link.url}>
                  {link.text || link.label || link.name || link.url}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Page-level FAQs */}
      {page.faqs?.length > 0 && (
        <section className="content">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-list">
            {renderFaqs(page.faqs)}
          </div>
        </section>
      )}

      {/* Page-level CTA */}
      {page.cta && renderCta(page.cta)}
    </>
  );
}
