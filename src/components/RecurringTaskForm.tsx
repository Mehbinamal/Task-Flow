
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Repeat } from 'lucide-react';
import { Task, RecurringPattern } from '@/types/task';

interface RecurringTaskFormProps {
  onSubmit: (task: any) => void;
  onCancel: () => void;
}

export const RecurringTaskForm = ({ onSubmit, onCancel }: RecurringTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Recurring pattern state
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [interval, setInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [endDate, setEndDate] = useState('');
  const [maxOccurrences, setMaxOccurrences] = useState<number | undefined>();

  const daysOfWeek = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const recurringPattern: RecurringPattern = {
      type: recurringType,
      interval,
      daysOfWeek: recurringType === 'weekly' ? selectedDays : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      maxOccurrences,
    };

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      tags,
      estimatedDuration,
      scheduledTime: scheduledTime || undefined,
      isRecurring: true,
      recurringPattern,
    };

    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 text-indigo-600 mb-4">
        <Repeat className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Create Recurring Task</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Gym workout, Spanish class"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this recurring task..."
          className="min-h-[60px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Recurrence</Label>
          <Select value={recurringType} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setRecurringType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Every</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
              min="1"
              max="52"
              className="w-20"
            />
            <span className="text-sm text-gray-600">
              {recurringType === 'daily' && (interval === 1 ? 'day' : 'days')}
              {recurringType === 'weekly' && (interval === 1 ? 'week' : 'weeks')}
              {recurringType === 'monthly' && (interval === 1 ? 'month' : 'months')}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 60)}
            min="5"
            max="480"
          />
        </div>
      </div>

      {recurringType === 'weekly' && (
        <div className="space-y-2">
          <Label>Days of the week</Label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <Button
                key={day.value}
                type="button"
                variant={selectedDays.includes(day.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDay(day.value)}
                className="w-12 h-8"
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Scheduled Time (Optional)</Label>
          <Input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Occurrences (Optional)</Label>
          <Input
            type="number"
            value={maxOccurrences || ''}
            onChange={(e) => setMaxOccurrences(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Leave empty for indefinite"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>End Date (Optional)</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-indigo-100 text-indigo-800">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-indigo-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          Create Recurring Task
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
