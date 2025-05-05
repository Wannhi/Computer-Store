import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Button } from '../components/ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed py-12 ${className}`}>
      {icon && <div className="mb-3 text-gray-400">{icon}</div>}
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {action && (
        <Button variant="ghost" className="mt-3" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
