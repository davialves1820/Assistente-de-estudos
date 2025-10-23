import { Card } from "@/components/card";
import { Progress } from "@/components/progress";
import { TrendingUp, Calendar, Target, Flame } from "lucide-react";
import { useState } from "react";

interface ProgressChartProps {
  weeklyActivity: number[];
  totalStudyTime: number;
  streak: number;
}

export const ProgressChart = ({ weeklyActivity, totalStudyTime, streak }: ProgressChartProps) => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const maxActivity = Math.max(...weeklyActivity, 1);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const weeklyGoal = 20;
  const progressPercentage = Math.min((totalStudyTime / weeklyGoal) * 100, 100);

  return (
    <Card className="overflow-hidden p-6 shadow-soft">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="mb-1 text-xl font-bold">Atividade Semanal</h3>
          <p className="text-sm text-muted-foreground">Sua evolução nos últimos 7 dias</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-3 shadow-sm">
          <Flame className="h-5 w-5 text-orange-500" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">Sequência</span>
            <span className="text-lg font-bold text-orange-500">{streak} dias</span>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-7 gap-3">
        {weeklyActivity.map((activity, index) => {
          const height = Math.max((activity / maxActivity) * 100, 8);
          const isToday = index === 6; // Assumindo que o último dia é hoje
          const isHovered = hoveredDay === index;
          
          return (
            <div 
              key={index} 
              className="group relative flex flex-col items-center gap-3"
              onMouseEnter={() => setHoveredDay(index)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div className="relative h-32 w-full rounded-xl bg-gradient-to-b from-muted/30 to-muted/50 p-1.5 shadow-inner transition-all hover:shadow-md">
                <div
                  className={`w-full rounded-lg bg-gradient-to-t from-primary via-primary/80 to-primary/60 transition-all duration-500 ease-out ${
                    isToday ? 'animate-pulse shadow-[0_0_20px_rgba(var(--primary),0.5)]' : ''
                  } ${isHovered ? 'opacity-100' : 'opacity-90'}`}
                  style={{ 
                    height: `${height}%`, 
                    marginTop: `${100 - height}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
                {activity > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-lg bg-background/90 px-2 py-1 text-xs font-bold shadow-lg">
                      {activity}h
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className={`text-xs font-medium transition-colors ${
                  isToday ? 'text-primary' : 'text-muted-foreground'
                } ${isHovered ? 'text-foreground' : ''}`}>
                  {days[index]}
                </span>
                {isToday && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">Tempo Total</span>
              <span className="text-2xl font-bold text-primary">{totalStudyTime}h</span>
            </div>
          </div>

          <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <Target className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">Meta Semanal</span>
              <span className="text-2xl font-bold text-green-500">{weeklyGoal}h</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Progresso da Meta</span>
            </div>
            <span className="text-sm font-bold text-primary">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={progressPercentage} className="h-3" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{totalStudyTime}h estudadas</span>
              <span>{Math.max(0, weeklyGoal - totalStudyTime)}h restantes</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};