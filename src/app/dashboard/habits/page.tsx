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
    type Habit as ServerHabit,
} from '@/app/_actions/habitActions';

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
  const [isSubmitting, startTransition] = useTransition(); 

  const loadHabits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchUserHabits();
      if (result.error) {
        setError(result.error);
        setHabits([]);
      } else if (result.habits) {
        setHabits(result.habits.map(h => ({ id: h.id, name: h.name, sort_order: h.sort_order })));
      }
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred during fetch.");
        setHabits([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleAddHabit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedNewHabitName = newHabitName.trim();
    if (trimmedNewHabitName === '') return;

    const formData = new FormData(e.currentTarget);
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimisticSortOrder = habits.length > 0 ? Math.max(...habits.map(h => h.sort_order)) + 1 : 0;
    
    const optimisticHabit: ClientHabit = {
      id: tempId,
      name: trimmedNewHabitName,
      sort_order: optimisticSortOrder,
    };

    setHabits(prev => [...prev, optimisticHabit].sort((a,b) => a.sort_order - b.sort_order));
    setNewHabitName('');

    startTransition(async () => {
      const result = await addHabitAction(formData);
      if (result.error) {
        setError(`Failed to add habit: ${result.error}`);
        setHabits(prev => prev.filter(h => h.id !== tempId)); // Revert optimistic add
        setNewHabitName(trimmedNewHabitName); // Restore input
      } else if (result.habit) {
        // Replace optimistic habit with server-confirmed habit and re-sort
        setHabits(prev => 
          prev.map(h => h.id === tempId ? 
            { id: result.habit!.id, name: result.habit!.name, sort_order: result.habit!.sort_order } 
            : h
          ).sort((a,b) => a.sort_order - b.sort_order)
        );
        setError(null);
      } else {
         // Should not happen if action returns habit or error
         setError('Habit added, but no data returned. Refreshing list...');
         await loadHabits(); // Force refresh as a fallback
      }
    });
  };

  const handleStartEdit = (habit: ClientHabit) => {
    if (isSubmitting) return; // Prevent editing while another action is in progress
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
    const newNameTrimmed = editText.trim();

    // Optimistic update
    setHabits(prevHabits => prevHabits.map(h => 
        h.id === editingHabitId ? { ...h, name: newNameTrimmed } : h
    ));
    setEditingHabitId(null);
    setEditText('');

    startTransition(async () => {
      const result = await updateHabitAction(editingHabitId, newNameTrimmed);
      if (result.error) {
        setError(`Failed to update habit: ${result.error}`);
        // Revert optimistic update
        setHabits(prevHabits => prevHabits.map(h => 
            h.id === editingHabitId ? { ...h, name: originalName } : h
        ));
      } else if (result.habit) {
         setHabits(prev => 
            prev.map(h => h.id === result.habit!.id ? 
              { id: result.habit!.id, name: result.habit!.name, sort_order: result.habit!.sort_order } 
              : h
            ).sort((a,b) => a.sort_order - b.sort_order)
          );
         setError(null);
      }
    });
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    
    const originalHabits = [...habits];
    setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));

    startTransition(async () => {
      const result = await deleteHabitAction(habitId);
      if (result.error) {
        setError(`Failed to delete habit: ${result.error}`);
        setHabits(originalHabits);
      } else {
        setError(null);
        // No need to update habits state here, revalidation from server action will handle
        // Or if you want to be absolutely sure after delete without full re-fetch:
        // await loadHabits(); // This might be too aggressive if revalidatePath is reliable
      }
    });
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, habitId: string) => {
    if (isSubmitting) return;
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
    if (!draggedHabitId || draggedHabitId === dropTargetHabitId || isSubmitting) {
      setDraggedHabitId(null);
      setDragOverHabitId(null);
      return;
    }

    const currentHabits = [...habits];
    const draggedIndex = currentHabits.findIndex(h => h.id === draggedHabitId);
    const targetIndex = currentHabits.findIndex(h => h.id === dropTargetHabitId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrderedHabits = [...currentHabits];
    const [draggedItem] = newOrderedHabits.splice(draggedIndex, 1);
    newOrderedHabits.splice(targetIndex, 0, draggedItem);
    
    const habitsWithNewSortOrder = newOrderedHabits.map((h, index) => ({ ...h, sort_order: index }));
    setHabits(habitsWithNewSortOrder); // Optimistic UI update for order
    
    setDraggedHabitId(null);
    setDragOverHabitId(null);

    startTransition(async () => {
        // Prepare data for server action: only id and new sort_order
        const reorderPayload = habitsWithNewSortOrder.map(h => ({ id: h.id, sort_order: h.sort_order }));
        const result = await reorderHabitsAction(reorderPayload);
        if (result.error) {
            setError(`Failed to reorder habits: ${result.error}`);
            setHabits(currentHabits); // Revert optimistic reorder
        } else {
            setError(null);
            // Optionally, re-fetch to confirm server state if revalidatePath isn't enough
            // await loadHabits();
        }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
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
          name="newHabitName" 
          placeholder="Enter new habit name..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="flex-grow"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || newHabitName.trim() === ''}>
          {isSubmitting && !editingHabitId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />} 
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
              draggable={editingHabitId !== habit.id && !isSubmitting}
              onDragStart={(e) => handleDragStart(e, habit.id)}
              onDragOver={(e) => handleDragOver(e, habit.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, habit.id)}
              className={cn(
                "flex items-center justify-between p-3 border rounded-lg shadow-sm bg-card text-card-foreground min-h-[60px] group",
                (editingHabitId === habit.id || isSubmitting) ? "cursor-default" : "cursor-grab",
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
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isSubmitting) handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={handleSaveEdit} className="mr-1" disabled={isSubmitting || editText.trim() === '' || editText.trim() === habits.find(h=>h.id===editingHabitId)?.name }>
                    {isSubmitting && editingHabitId === habit.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span className="sr-only">Save</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={isSubmitting} className="text-muted-foreground hover:text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center flex-grow min-w-0"> {/* Added min-w-0 for better truncation if needed */}
                    {!isSubmitting && <GripVertical className="h-5 w-5 mr-2 text-muted-foreground group-hover:text-foreground transition-colors cursor-grab flex-shrink-0" />}
                    <span className="font-medium break-all mr-2 truncate">{habit.name}</span>
                  </div>
                  <div className="flex-shrink-0 space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleStartEdit(habit)} disabled={isSubmitting}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Habit</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteHabit(habit.id)} disabled={isSubmitting}>
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