import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { folderService } from '../../services/folderService';
import { useToast } from '../../context/ToastContext';

export default function CreateFolderModal({
  isOpen,
  onClose,
  groupId,
  onSuccess,
}) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { success } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Album name is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await folderService.addFolder(groupId, name.trim());
      success(`Album "${name}" created successfully!`);
      setName('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Album"
      description="Create a sub-folder to organize specific memories in this group"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Album Name"
          placeholder="e.g. Day 1 - Arrival & Beach"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          required
          autoFocus
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Album
          </Button>
        </div>
      </form>
    </Modal>
  );
}
