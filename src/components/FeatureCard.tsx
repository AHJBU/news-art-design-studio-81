
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  buttonText,
  onClick,
  className,
}: FeatureCardProps) {
  return (
    <div className={cn("feature-card feature-card-light feature-card-dark", className)}>
      <div className="feature-icon">
        <Icon className="h-10 w-10 text-xdesign" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 flex-1">{description}</p>
      <Button 
        onClick={onClick} 
        className="xdesign-button mt-auto"
      >
        {buttonText}
      </Button>
    </div>
  );
}
