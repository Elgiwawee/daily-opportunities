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

const formatHtmlContent = (htmlContent: string): React.ReactNode => {
  // Create a temporary div to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;
  
  const sections: React.ReactNode[] = [];
  let sectionCount = 0;
  const adInterval = 3; // Insert ad every 3 sections/paragraphs

  const processElements = (elements: NodeListOf<ChildNode> | HTMLCollection) => {
    Array.from(elements).forEach((node, index) => {
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

      // Handle different element types
      switch (tagName) {
        case 'h1':
          sections.push(
            <h2 key={`h1-${sections.length}`} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </h2>
          );
          break;
          
        case 'h2':
          sections.push(
            <h3 key={`h2-${sections.length}`} className="text-xl font-bold mt-7 mb-4 text-gray-900">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </h3>
          );
          break;
          
        case 'h3':
          sections.push(
            <h4 key={`h3-${sections.length}`} className="text-lg font-bold mt-6 mb-3 text-gray-800">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </h4>
          );
          break;
          
        case 'h4':
        case 'h5':
        case 'h6':
          sections.push(
            <h5 key={`h4-${sections.length}`} className="text-base font-bold mt-5 mb-2 text-gray-800">
              <span dangerouslySetInnerHTML={{ __html: innerHTML }} />
            </h5>
          );
          break;
          
        case 'p':
          // Check if this paragraph looks like a header (starts with emoji or header keyword)
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
          
        case 'br':
          // Skip breaks
          break;
          
        case 'div':
        case 'section':
        case 'article':
          // Process children of container elements
          processElements(element.childNodes);
          break;
          
        default:
          // For other elements, wrap in a justified div
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
