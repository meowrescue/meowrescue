
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, count, isSelected, onClick }) => {
  return (
    <Card 
      className={`cursor-pointer ${isSelected ? 'bg-slate-100' : ''}`} 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
