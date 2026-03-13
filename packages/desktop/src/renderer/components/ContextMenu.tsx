import { useState, useCallback, type MouseEvent } from 'react';
import type { TaskStatus } from '@clawwork/shared';
import i18n from '../i18n';

export interface MenuItem {
  label: string;
  action: () => void;
  danger?: boolean;
}

interface MenuState {
  isOpen: boolean;
  taskId: string;
  taskStatus: TaskStatus;
}

const INITIAL_STATE: MenuState = {
  isOpen: false,
  taskId: '',
  taskStatus: 'active',
};

export function useTaskContextMenu(
  updateStatus: (id: string, status: TaskStatus) => void,
) {
  const [state, setState] = useState<MenuState>(INITIAL_STATE);

  const openMenu = useCallback(
    (e: MouseEvent, taskId: string, taskStatus: TaskStatus) => {
      e.preventDefault();
      setState({ isOpen: true, taskId, taskStatus });
    },
    [],
  );

  const closeMenu = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }));
  }, []);

  const items: MenuItem[] = [];

  if (state.taskStatus === 'active') {
    items.push({
      label: i18n.t('contextMenu.markCompleted'),
      action: () => updateStatus(state.taskId, 'completed'),
    });
    items.push({
      label: i18n.t('contextMenu.archive'),
      action: () => updateStatus(state.taskId, 'archived'),
      danger: true,
    });
  } else if (state.taskStatus === 'completed') {
    items.push({
      label: i18n.t('contextMenu.reactivate'),
      action: () => updateStatus(state.taskId, 'active'),
    });
    items.push({
      label: i18n.t('contextMenu.archive'),
      action: () => updateStatus(state.taskId, 'archived'),
      danger: true,
    });
  }

  return {
    items,
    taskId: state.taskId,
    taskStatus: state.taskStatus,
    isOpen: state.isOpen,
    openMenu,
    closeMenu,
  };
}
