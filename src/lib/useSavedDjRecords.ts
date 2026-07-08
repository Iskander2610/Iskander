import { useCallback, useEffect, useState } from 'react';
import { deleteDjRecord, loadDjRecords, saveDjRecord, type SavedDjRecord } from './djRecords';
import type { RecordedAction } from './recording';

export function useSavedDjRecords(username: string) {
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [recordMessage, setRecordMessage] = useState('');
  const [savedRecords, setSavedRecords] = useState<SavedDjRecord[]>([]);

  const refreshRecords = useCallback(async () => {
    if (!username) return;
    try {
      setSavedRecords(await loadDjRecords());
    } catch {
      setRecordMessage('Could not load records');
    }
  }, [username]);

  useEffect(() => {
    void refreshRecords();
  }, [refreshRecords]);

  const saveRecord = async (recording: RecordedAction[]) => {
    if (recording.length === 0 || !username) return;
    setIsSavingRecord(true);
    setRecordMessage('');
    try {
      await saveDjRecord(username, recording);
      await refreshRecords();
      setRecordMessage('Record saved');
    } catch {
      setRecordMessage('Could not save record');
    } finally {
      setIsSavingRecord(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDjRecord(id);
      await refreshRecords();
      setRecordMessage('Record deleted');
    } catch {
      setRecordMessage('Could not delete record');
    }
  };

  return {
    deleteRecord,
    isSavingRecord,
    recordMessage,
    refreshRecords,
    saveRecord,
    savedRecords,
  };
}
