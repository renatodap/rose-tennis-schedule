import { Card, CardContent } from '@/components/ui/card';

export function PracticeDateCardSkeleton() {
  return (
    <Card variant="outlined">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-[60px] h-[72px] bg-neutral-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-neutral-200 rounded" />
              <div className="h-4 w-32 bg-neutral-200 rounded" />
              <div className="h-4 w-24 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-neutral-200 rounded" />
            <div className="h-10 w-20 bg-neutral-200 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
