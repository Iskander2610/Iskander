export type RecordedAction =
  | {
      id: number;
      time: number;
      label: string;
      type: 'sound';
      index: number;
    }
  | {
      id: number;
      time: number;
      label: string;
      type: 'scratch';
      direction: 'forward' | 'backward';
    }
  | {
      id: number;
      time: number;
      label: string;
      type: 'spin';
      direction: 'up' | 'down';
    };

export type NewRecordedAction =
  | {
      label: string;
      type: 'sound';
      index: number;
    }
  | {
      label: string;
      type: 'scratch';
      direction: 'forward' | 'backward';
    }
  | {
      label: string;
      type: 'spin';
      direction: 'up' | 'down';
    };
