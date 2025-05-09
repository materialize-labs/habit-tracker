// Page component for configuring user habits with backend integration.
'use client';

import { useState, useEffect, FormEvent, DragEvent, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, PlusCircle, Save, XCircle, GripVertical, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    fetchUserHabits,
    addHabitAction,
    updateHabitAction,
    deleteHabitAction,
    reorderHabitsAction,
    type Habit as ServerHabit, // Use type from actions
} from '@/app/_actions/habitActions'; // Adjust path if necessary

// Client-side Habit type can omit user_id and created_at for simplicity if not directly used in UI
interface ClientHabit {
  id: string;
  name: string;
  sort_order: number;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<ClientHabit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const [draggedHabitId, setDraggedHabitId] = useState<string | null>(null);
  const [dragOverHabitId, setDragOverHabitId] = useState<string | null>(null); 

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition(); // For server action loading states

  // Fetch habits on mount
  useEffect(() => {
    const loadHabits = async () => {
      setIsLoading(true);
      setError(null);
      const result = await fetchUserHabits();
      if (result.error) {
        setError(result.error);
        setHabits([]); // Clear habits on error
      } else if (result.habits) {
        // Map ServerHabit to ClientHabit if needed, or ensure types match
        setHabits(result.habits.map(h => ({ id: h.id, name: h.name, sort_order: h.sort_order })));
      }
      setIsLoading(false);
    };
    loadHabits();
  }, []);

  const handleAddHabit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newHabitName.trim() === '') return;

    const formData = new FormData(e.currentTarget);
    // Optimistically update UI or wait for revalidation
    const currentNewHabitName = newHabitName;
    setNewHabitName(''); // Clear input immediately

    startTransition(async () => {
      const result = await addHabitAction(formData);
      if (result.error) {
        setError(`Failed to add habit: ${result.error}`);
        setNewHabitName(currentNewHabitName); // Restore name on error
      } else {
        // Revalidation will refresh the list from server, or optimistically add:
        // if (result.habit) {
        //   setHabits(prev => [...prev, {id: result.habit!.id, name: result.habit!.name, sort_order: result.habit!.sort_order }].sort((a,b) => a.sort_order - b.sort_order));
        // }
        setError(null);
      }
    });
  };

  const handleStartEdit = (habit: ClientHabit) => {
    setEditingHabitId(habit.id);
    setEditText(habit.name);
  };

  const handleCancelEdit = () => {
    setEditingHabitId(null);
    setEditText('');
  };

  const handleSaveEdit = async () => {
    if (editText.trim() === '' || !editingHabitId) return;
    const originalHabit = habits.find(h => h.id === editingHabitId);
    if (!originalHabit) return;

    const originalName = originalHabit.name;
    // Optimistic update
    setHabits(habits.map(h => h.id === editingHabitId ? { ...h, name: editText.trim() } : h));
    setEditingHabitId(null);

    startTransition(async () => {
      const result = await updateHabitAction(editingHabitId, editText.trim());
      if (result.error) {
        setError(`Failed to update habit: ${result.error}`);
        // Revert optimistic update
        setHabits(habits.map(h => h.id === editingHabitId ? { ...h, name: originalName } : h));
      } else {
         setError(null);
      }
    });
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    
    const originalHabits = [...habits];
    // Optimistic update
    setHabits(habits.filter(h => h.id !== habitId));

    startTransition(async () => {
      const result = await deleteHabitAction(habitId);
      if (result.error) {
        setError(`Failed to delete habit: ${result.error}`);
        setHabits(originalHabits); // Revert optimistic update
      } else {
        setError(null);
      }
    });
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, habitId: string) => {
    setDraggedHabitId(habitId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, habitId: string) => {
    e.preventDefault(); 
    if (habitId !== draggedHabitId) {
        setDragOverHabitId(habitId);
    }
  };
  
  const handleDragLeave = () => {
    setDragOverHabitId(null);
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>, dropTargetHabitId: string) => {
    e.preventDefault();
    if (!draggedHabitId || draggedHabitId === dropTargetHabitId) {
      setDraggedHabitId(null);
      setDragOverHabitId(null);
      return;
    }

    const draggedIndex = habits.findIndex(h => h.id === draggedHabitId);
    const targetIndex = habits.findIndex(h => h.id === dropTargetHabitId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrderedHabits = [...habits];
    const [draggedItem] = newOrderedHabits.splice(draggedIndex, 1);
    newOrderedHabits.splice(targetIndex, 0, draggedItem);
    
    // Optimistic UI update
    setHabits(newOrderedHabits);
    const habitsWithNewSortOrder = newOrderedHabits.map((h, index) => ({ id: h.id, sort_order: index }));
    
    setDraggedHabitId(null);
    setDragOverHabitId(null);

    startTransition(async () => {
        const result = await reorderHabitsAction(habitsWithNewSortOrder);
        if (result.error) {
            setError(`Failed to reorder habits: ${result.error}`);
            // Potentially revert UI or re-fetch to get server state
            // For simplicity, current revalidation might handle it or show error
            const freshFetch = await fetchUserHabits();
            if(freshFetch.habits) setHabits(freshFetch.habits.map(h => ({ id: h.id, name: h.name, sort_order: h.sort_order })));
        }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2 text-muted-foreground">Loading habits...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configure Habits</h1>
        <p className="text-muted-foreground">
          Manage your list of trackable habits here.
        </p>
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">Error: {error}</p>}

      <form onSubmit={handleAddHabit} className="flex items-center gap-2 mb-6">
        <Input
          type="text"
          name="newHabitName" // Important for FormData
          placeholder="Enter new habit name..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="flex-grow"
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || newHabitName.trim() === ''}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />} 
          Add Habit
        </Button>
      </form>

      <div className="space-y-1">
        {habits.length === 0 && !isLoading ? (
          <div className="p-4 text-center border-2 border-dashed border-muted rounded-lg min-h-[100px] flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No habits configured yet. Add one above to get started.</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              draggable={editingHabitId !== habit.id && !isPending}
              onDragStart={(e) => editingHabitId !== habit.id && !isPending && handleDragStart(e, habit.id)}
              onDragOver={(e) => handleDragOver(e, habit.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, habit.id)}
              className={cn(
                "flex items-center justify-between p-3 border rounded-lg shadow-sm bg-card text-card-foreground min-h-[60px] group",
                (editingHabitId === habit.id || isPending) ? "cursor-default" : "cursor-grab",
                draggedHabitId === habit.id && "opacity-50",
                dragOverHabitId === habit.id && draggedHabitId !== habit.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              {editingHabitId === habit.id ? (
                <>
                  <Input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow mr-2 h-9"
                    autoFocus
                    disabled={isPending}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isPending) handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={handleSaveEdit} className="mr-1" disabled={isPending || editText.trim() === ''}>
                    {isPending && editingHabitId === habit.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span className="sr-only">Save</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={isPending} className="text-muted-foreground hover:text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center flex-grow">
                    {!isPending && <GripVertical className="h-5 w-5 mr-2 text-muted-foreground group-hover:text-foreground transition-colors cursor-grab" />}
                    <span className="font-medium break-all mr-2">{habit.name}</span>
                  </div>
                  <div className="flex-shrink-0 space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleStartEdit(habit)} disabled={isPending}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Habit</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteHabit(habit.id)} disabled={isPending}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Habit</span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 