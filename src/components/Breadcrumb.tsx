import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  url: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-1 text-sm text-gray-600 mb-6 ${className}`}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={item.url} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            )}
            
            {item.isCurrentPage ? (
              <span 
                className="text-gray-900 font-medium"
                aria-current="page"
              >
                {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
                {item.name}
              </span>
            ) : (
              <Link
                to={item.url}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
                itemProp="item"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                <span itemProp="name">{item.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};