import Card from '../card/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  highlightColor?: string;
}

function StatsCard({ title, value, subtitle, highlightColor }: StatsCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p
        className={`text-2xl font-bold ${
          highlightColor ? highlightColor : 'text-gray-800'
        }`}
      >
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </Card>
  );
}

export default StatsCard;
