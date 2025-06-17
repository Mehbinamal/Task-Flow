
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const TaskForm = ({ task, onSubmit, onCancel, isEditing }: TaskFormProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(task?.estimatedDuration || 30);
  const [deadline, setDeadline] = useState(
    task?.deadline ? task.deadline.toISOString().slice(0, 16) : ''
  );

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      ...(isEditing ? task : {}),
      title: title.trim(),
      description: description.trim(),
      priority,
      tags,
      estimatedDuration,
      deadline: deadline ? new Date(deadline) : undefined,
    };

    onSubmit(taskData);
  };

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
            <SelectTrigger className="border-gray-300 focus:border-indigo-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${priorityColors.low}`} />
                  <span>Low Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${priorityColors.medium}`} />
                  <span>Medium Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${priorityColors.high}`} />
                  <span>High Priority</span>
                </div>
              </SelectItem>
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
          placeholder="Add more details about this task..."
          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Estimated Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 30)}
            min="5"
            max="480"
            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline (Optional)</Label>
          <Input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
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
            placeholder="Add a tag (Work, Study, Health...)"
            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
