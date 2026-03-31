import React, { useMemo } from 'react';
import AdSenseAd from './AdSenseAd';

interface FormattedDescriptionProps {
  description: string;
  className?: string;
}

/**
 * Formats opportunity description with:
 * - Bold and larger headers
 * - Justified text alignment
 * - In-article ads between paragraphs
 */
export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({ 
  description, 
  className = '' 
}) => {
  const formattedContent = useMemo(() => {
    if (!description) return null;

    // Check if description contains HTML tags
    const hasHtmlTags = /<[^>]+>/.test(description);

    if (hasHtmlTags) {
      return formatHtmlContent(description);
    }

    return formatPlainText(description);
  }, [description]);

  return (
    <div className={`formatted-description ${className}`}>
      {formattedContent}
    </div>
  );
};

// Common header patterns to detect section headers
const headerPatterns = [
  /^(📚|🎓|💰|📋|📝|✅|🔔|💼|🌍|📖|🏆|⚡|🔗|📌|💡|🎯|✨|💵|🏫|📅|🎁|📄|🌐|👥|🔹|🔸|•)/,
  /^(About|Eligibility|Requirements|Benefits|How to|Application|Deadline|Documents|Scholarship|Overview|Details|Important|Note|Summary|Conclusion|Introduction|Criteria|Coverage|Process|Contact|Duration|Award|Grant|Funding|Selection|Fields|Countries|Host|Level|Value)/i,
];

const isHeaderLine = (line: string): boolean => {
  return headerPatterns.some(pattern => pattern.test(line.trim()));
};

// Map Bootstrap classes to Tailwind equivalents
const bootstrapToTailwind = (element: Element): string => {
  const classList = Array.from(element.classList);
  const mapped: string[] = [];

  for (const cls of classList) {
    switch (cls) {
      // Alerts
      case 'alert': mapped.push('rounded-lg p-4 mb-4 border'); break;
      case 'alert-warning': mapped.push('bg-amber-50 border-amber-300 text-amber-900'); break;
      case 'alert-info': mapped.push('bg-blue-50 border-blue-300 text-blue-900'); break;
      case 'alert-success': mapped.push('bg-green-50 border-green-300 text-green-900'); break;
      case 'alert-danger': mapped.push('bg-red-50 border-red-300 text-red-900'); break;
      case 'alert-primary': mapped.push('bg-blue-50 border-blue-400 text-blue-900'); break;
      case 'alert-secondary': mapped.push('bg-gray-50 border-gray-300 text-gray-800'); break;
      // Buttons
      case 'btn': mapped.push('inline-flex items-center justify-center rounded-md font-medium px-6 py-3 transition-colors no-underline'); break;
      case 'btn-primary': mapped.push('bg-olive-600 text-white hover:bg-olive-700'); break;
      case 'btn-success': mapped.push('bg-green-600 text-white hover:bg-green-700'); break;
      case 'btn-danger': mapped.push('bg-red-600 text-white hover:bg-red-700'); break;
      case 'btn-warning': mapped.push('bg-amber-500 text-white hover:bg-amber-600'); break;
      case 'btn-info': mapped.push('bg-cyan-500 text-white hover:bg-cyan-600'); break;
      case 'btn-outline-primary': mapped.push('border-2 border-olive-600 text-olive-700 hover:bg-olive-50'); break;
      case 'btn-lg': mapped.push('text-lg px-8 py-4'); break;
      case 'btn-sm': mapped.push('text-sm px-3 py-1.5'); break;
      // Text
      case 'text-center': mapped.push('text-center'); break;
      case 'text-muted': mapped.push('text-gray-500'); break;
      case 'text-primary': mapped.push('text-olive-600'); break;
      case 'text-success': mapped.push('text-green-600'); break;
      case 'text-danger': mapped.push('text-red-600'); break;
      case 'text-warning': mapped.push('text-amber-600'); break;
      case 'fw-bold': case 'font-weight-bold': mapped.push('font-bold'); break;
      case 'lead': mapped.push('text-lg leading-relaxed text-gray-600'); break;
      // Spacing
      case 'mt-3': mapped.push('mt-4'); break;
      case 'mt-4': mapped.push('mt-6'); break;
      case 'mb-3': mapped.push('mb-4'); break;
      case 'mb-4': mapped.push('mb-6'); break;
      case 'my-3': mapped.push('my-4'); break;
      case 'my-4': mapped.push('my-6'); break;
      case 'p-3': mapped.push('p-4'); break;
      case 'p-4': mapped.push('p-6'); break;
      // Cards
      case 'card': mapped.push('rounded-lg border bg-white shadow-sm'); break;
      case 'card-body': mapped.push('p-6'); break;
      case 'card-title': mapped.push('text-xl font-bold mb-2'); break;
      case 'card-text': mapped.push('text-gray-700'); break;
      // Tables
      case 'table': mapped.push('w-full border-collapse'); break;
      case 'table-striped': mapped.push('[&_tr:nth-child(even)]:bg-gray-50'); break;
      case 'table-bordered': mapped.push('[&_td]:border [&_th]:border [&_td]:p-2 [&_th]:p-2'); break;
      // Badges
      case 'badge': mapped.push('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'); break;
      case 'bg-primary': mapped.push('bg-olive-600 text-white'); break;
      case 'bg-success': mapped.push('bg-green-600 text-white'); break;
      case 'bg-danger': mapped.push('bg-red-600 text-white'); break;
      case 'bg-warning': mapped.push('bg-amber-500 text-white'); break;
      // Images
      case 'img-fluid': mapped.push('max-w-full h-auto'); break;
      case 'rounded': mapped.push('rounded-lg'); break;
      // Layout
      case 'container': mapped.push('max-w-4xl mx-auto'); break;
      case 'row': mapped.push('flex flex-wrap -mx-2'); break;
      case 'col': mapped.push('flex-1 px-2'); break;
      case 'd-flex': mapped.push('flex'); break;
      case 'justify-content-center': mapped.push('justify-center'); break;
      case 'align-items-center': mapped.push('items-center'); break;
      // Borders
      case 'border': mapped.push('border'); break;
      case 'border-top': mapped.push('border-t'); break;
      case 'border-bottom': mapped.push('border-b'); break;
      // List
      case 'list-group': mapped.push('divide-y rounded-lg border'); break;
      case 'list-group-item': mapped.push('p-3 text-gray-700'); break;
      default: break;
    }
  }

  return mapped.join(' ');
};

// Convert Bootstrap HTML to Tailwind-styled HTML
const convertBootstrapHtml = (element: Element): string => {
  const clone = element.cloneNode(true) as Element;
  
  const convertElement = (el: Element) => {
    if (el.classList && el.classList.length > 0) {
      const tailwindClasses = bootstrapToTailwind(el);
      if (tailwindClasses) {
        el.className = tailwindClasses;
      }
    }
    Array.from(el.children).forEach(child => convertElement(child));
  };
  
  convertElement(clone);
  return clone.outerHTML;
};

const formatHtmlContent = (htmlContent: string): React.ReactNode => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;
  
  const sections: React.ReactNode[] = [];
  let sectionCount = 0;
  const adInterval = 2; // Insert ad every 2 sections for better monetization

  const processElements = (elements: NodeListOf<ChildNode> | HTMLCollection) => {
    Array.from(elements).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          sections.push(
            <p key={`text-${sections.length}`} className="text-gray-700 leading-relaxed text-justify mb-4">
              {text}
            </p>
          );
          sectionCount++;
          maybeAddAd();
        }
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;
      
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      const innerHTML = element.innerHTML;
      const textContent = element.textContent || '';
      const hasBootstrapClass = Array.from(element.classList).some(cls => 
        ['alert', 'btn', 'card', 'badge', 'table', 'list-group', 'lead', 'container', 'row', 'col', 'd-flex'].some(bc => cls.startsWith(bc))
      );

      // Handle Bootstrap-styled elements
      if (hasBootstrapClass) {
        const convertedHtml = convertBootstrapHtml(element);
        sections.push(
          <div key={`bs-${sections.length}`} className="mb-4" dangerouslySetInnerHTML={{ __html: convertedHtml }} />
        );
        sectionCount++;
        maybeAddAd();
        return;
      }

      // Handle anchor tags with Bootstrap button classes
      if (tagName === 'a' && element.classList.contains('btn')) {
        const convertedHtml = convertBootstrapHtml(element);
        sections.push(
          <div key={`btn-${sections.length}`} className="mb-4" dangerouslySetInnerHTML={{ __html: convertedHtml }} />
        );
        sectionCount++;
        maybeAddAd();
        return;
      }

      switch (tagName) {
        case 'h1':
          sections.push(
            <h2 key={`h1-${sections.length}`} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </h2>
          );
          sectionCount++;
          maybeAddAd();
          break;
          
        case 'h2':
          sections.push(
            <h3 key={`h2-${sections.length}`} className="text-xl font-bold mt-7 mb-4 text-gray-900">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </h3>
          );
          sectionCount++;
          maybeAddAd();
          break;
          
        case 'h3':
          sections.push(
            <h4 key={`h3-${sections.length}`} className="text-lg font-bold mt-6 mb-3 text-gray-800">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </h4>
          );
          sectionCount++;
          maybeAddAd();
          break;
          
        case 'h4':
        case 'h5':
        case 'h6':
          sections.push(
            <h5 key={`h4-${sections.length}`} className="text-base font-bold mt-5 mb-2 text-gray-800">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </h5>
          );
          sectionCount++;
          maybeAddAd();
          break;
          
        case 'p':
          if (isHeaderLine(textContent)) {
            sections.push(
              <h4 key={`ph-${sections.length}`} className="text-lg font-bold mt-6 mb-3 text-gray-900">
                <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
              </h4>
            );
          } else {
            sections.push(
              <p key={`p-${sections.length}`} className="text-gray-700 leading-relaxed text-justify mb-4">
                <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
              </p>
            );
            sectionCount++;
            maybeAddAd();
          }
          break;
          
        case 'ul':
          sections.push(
            <ul key={`ul-${sections.length}`} className="list-disc list-inside space-y-2 ml-4 mb-4 text-gray-700 text-justify">
              {Array.from(element.querySelectorAll('li')).map((li, i) => (
                <li key={i} className="text-gray-700 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
                </li>
              ))}
            </ul>
          );
          sectionCount++;
          maybeAddAd();
          break;
          
        case 'ol':
          sections.push(
            <ol key={`ol-${sections.length}`} className="list-decimal list-inside space-y-2 ml-4 mb-4 text-gray-700 text-justify">
              {Array.from(element.querySelectorAll('li')).map((li, i) => (
                <li key={i} className="text-gray-700 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
                </li>
              ))}
            </ol>
          );
          sectionCount++;
          maybeAddAd();
          break;

        case 'table':
          sections.push(
            <div key={`table-${sections.length}`} className="overflow-x-auto mb-4">
              <table className="w-full border-collapse [&_td]:border [&_th]:border [&_td]:p-2 [&_th]:p-2 [&_th]:bg-gray-100 [&_th]:font-semibold">
                <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
              </table>
            </div>
          );
          sectionCount++;
          maybeAddAd();
          break;

        case 'img':
          const src = element.getAttribute('src');
          const alt = element.getAttribute('alt') || '';
          if (src) {
            sections.push(
              <div key={`img-${sections.length}`} className="my-4">
                <img src={src} alt={alt} className="max-w-full h-auto rounded-lg" loading="lazy" />
              </div>
            );
          }
          break;

        case 'a':
          sections.push(
            <p key={`a-${sections.length}`} className="mb-4">
              <a 
                href={element.getAttribute('href') || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md font-medium px-6 py-3 bg-olive-600 text-white hover:bg-olive-700 transition-colors no-underline"
                dangerouslySetInnerHTML={{ __html: innerHTML }}
              />
            </p>
          );
          break;

        case 'hr':
          sections.push(<hr key={`hr-${sections.length}`} className="my-6 border-gray-200" />);
          break;
          
        case 'br':
          break;
          
        case 'div':
        case 'section':
        case 'article':
          processElements(element.childNodes);
          break;
          
        case 'blockquote':
          sections.push(
            <blockquote key={`bq-${sections.length}`} className="border-l-4 border-olive-400 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r-lg">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </blockquote>
          );
          sectionCount++;
          maybeAddAd();
          break;

        case 'strong':
        case 'b':
        case 'em':
        case 'i':
        case 'span':
          sections.push(
            <p key={`inline-${sections.length}`} className="text-gray-700 leading-relaxed text-justify mb-4">
              <span dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
            </p>
          );
          sectionCount++;
          maybeAddAd();
          break;
          
        default:
          sections.push(
            <div key={`div-${sections.length}`} className="text-gray-700 leading-relaxed text-justify mb-4">
              <span dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
            </div>
          );
          sectionCount++;
          maybeAddAd();
      }
    });
  };

  const maybeAddAd = () => {
    if (sectionCount > 0 && sectionCount % adInterval === 0) {
      sections.push(
        <div key={`ad-${sections.length}`} className="my-6">
          <AdSenseAd variant="in-article" />
        </div>
      );
    }
  };

  processElements(body.childNodes);

  return <>{sections}</>;
};

const formatPlainText = (text: string): React.ReactNode => {
  // Split by newlines
  const lines = text.split(/\n/);
  const sections: React.ReactNode[] = [];
  let sectionCount = 0;
  const adInterval = 4; // Insert ad every 4 paragraphs
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join(' ').trim();
      if (content) {
        sections.push(
          <p key={`p-${sections.length}`} className="text-gray-700 leading-relaxed text-justify mb-4">
            {content}
          </p>
        );
        sectionCount++;
        
        // Maybe add ad after paragraph
        if (sectionCount > 0 && sectionCount % adInterval === 0) {
          sections.push(
            <div key={`ad-${sections.length}`} className="my-6">
              <AdSenseAd variant="in-article" />
            </div>
          );
        }
      }
      currentParagraph = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Empty line indicates paragraph break
    if (!trimmedLine) {
      flushParagraph();
      return;
    }

    // Check if this line is a header
    if (isHeaderLine(trimmedLine)) {
      // Flush any current paragraph first
      flushParagraph();
      
      // Add header with bold styling
      sections.push(
        <h4 key={`header-${sections.length}`} className="text-lg font-bold mt-6 mb-3 text-gray-900">
          {trimmedLine}
        </h4>
      );
    } else {
      // Add to current paragraph
      currentParagraph.push(trimmedLine);
    }
  });

  // Flush remaining paragraph
  flushParagraph();

  return <>{sections}</>;
};

export default FormattedDescription;
