'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Profile } from '@/lib/database.types';

interface AdminUserSelectorProps {
  users: Profile[];
  selectedUser: Profile | null;
  onUserSelect: (user: Profile) => void;
}

export function AdminUserSelector({ users, selectedUser, onUserSelect }: AdminUserSelectorProps) {
  return (
    <Select 
      value={selectedUser?.id || ''} 
      onValueChange={(userId) => {
        const user = users.find(u => u.id === userId);
        if (user) onUserSelect(user);
      }}
    >
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.full_name} ({user.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}