import { useState } from "react";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { Card } from "@/components/card";
import { Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";

interface ScheduleItem {
  day: string;
  dayIndex: number;
  hours: number;
  description: string;
}

interface DailyScheduleChecklistProps {
  planId: number;
  content: string;
  onActivityUpdate: () => void;
}

export const DailyScheduleChecklist = ({ planId, content, onActivityUpdate }: DailyScheduleChecklistProps) => {
  const { fetchApi } = useApi();
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse o conteúdo para extrair o cronograma
  const parseSchedule = (content: string): ScheduleItem[] => {
    const items: ScheduleItem[] = [];
    const dayMap: { [key: string]: number } = {
      'domingo': 0, 'dom': 0,
      'segunda': 1, 'seg': 1, 'segunda-feira': 1,
      'terça': 2, 'ter': 2, 'terça-feira': 2, 'terca': 2,
      'quarta': 3, 'qua': 3, 'quarta-feira': 3,
      'quinta': 4, 'qui': 4, 'quinta-feira': 4,
      'sexta': 5, 'sex': 5, 'sexta-feira': 5,
      'sábado': 6, 'sab': 6, 'sabado': 6
    };

    const lines = content.split('\n');
    
    for (const line of lines) {
      // Procura por padrões como "Segunda: 2h de matemática" ou "- Segunda-feira: 3 horas..."
      const match = line.match(/(?:^|\-\s*)(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo|seg|ter|qua|qui|sex|sab|dom)(?:-feira)?[:\s]+(\d+(?:\.\d+)?)\s*(?:h|horas?)/i);
      
      if (match) {
        const dayName = match[1].toLowerCase();
        const hours = parseFloat(match[2]);
        const dayIndex = dayMap[dayName];
        
        if (dayIndex !== undefined) {
          // Extrai a descrição após o número de horas
          const descMatch = line.match(/(?:\d+(?:\.\d+)?)\s*(?:h|horas?)\s*(?:de\s*)?(.+)$/i);
          const description = descMatch ? descMatch[1].trim() : line.trim();
          
          items.push({
            day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
            dayIndex,
            hours,
            description: description.replace(/^[-\s]+/, '')
          });
        }
      }
    }
    
    return items;
  };

  const scheduleItems = parseSchedule(content);

  const handleToggleItem = async (item: ScheduleItem) => {
    const itemKey = `${item.dayIndex}-${item.hours}`;
    const isCompleting = !completedItems.has(itemKey);
    
    try {
      setIsSubmitting(true);
      
      if (isCompleting) {
        // Registra a atividade no backend
        await fetchApi("/activity/daily", {
          method: "POST",
          body: JSON.stringify({
            planId,
            dayIndex: item.dayIndex,
            hours: item.hours,
            description: item.description
          })
        });
        
        setCompletedItems(prev => new Set([...prev, itemKey]));
        toast.success(`${item.hours}h adicionadas para ${item.day}!`);
      } else {
        // Remove a atividade
        await fetchApi(`/activity/daily/${planId}/${item.dayIndex}`, {
          method: "DELETE"
        });
        
        setCompletedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemKey);
          return newSet;
        });
        toast.info("Atividade removida");
      }
      
      onActivityUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar atividade");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (scheduleItems.length === 0) {
    return null;
  }

  const totalHours = scheduleItems.reduce((sum, item) => sum + item.hours, 0);
  const completedHours = scheduleItems
    .filter(item => completedItems.has(`${item.dayIndex}-${item.hours}`))
    .reduce((sum, item) => sum + item.hours, 0);

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Cronograma Semanal
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-primary">{completedHours}h</span>
          <span className="text-muted-foreground">/ {totalHours}h</span>
        </div>
      </div>

      <div className="space-y-3">
        {scheduleItems.map((item, idx) => {
          const itemKey = `${item.dayIndex}-${item.hours}`;
          const isCompleted = completedItems.has(itemKey);
          
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-lg transition-all ${
                isCompleted 
                  ? 'bg-success/10 border-success/30' 
                  : 'bg-background/50 border-border/50 hover:bg-background/80'
              } border`}
            >
              <Checkbox
                id={`item-${idx}`}
                checked={isCompleted}
                onCheckedChange={() => handleToggleItem(item)}
                disabled={isSubmitting}
                className="mt-1"
              />
              <label
                htmlFor={`item-${idx}`}
                className={`flex-1 cursor-pointer ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
              >
                <div className="font-semibold text-foreground">
                  {item.day} - {item.hours}h
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {scheduleItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold">
              {Math.round((completedHours / totalHours) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
              style={{ width: `${(completedHours / totalHours) * 100}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};