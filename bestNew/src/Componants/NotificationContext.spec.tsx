import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { NotificationProvider, useNotification } from './NotificationContext';

function TestConsumer() {
  const { notify } = useNotification();
  return (
    <button
      onClick={() => notify('test message', 'success')}
      data-testid="notify-btn"
    >
      Notify
    </button>
  );
}

function BadComponent() {
  useNotification();
  return <div />;
}

describe('NotificationContext', () => {
  it('useNotification should throw if used outside NotificationProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<BadComponent />)).toThrow(
      'useNotification must be used within a NotificationProvider'
    );

    consoleSpy.mockRestore();
  });

  it('Provider should render children', () => {
    render(
      <NotificationProvider>
        <div data-testid="child">Hello</div>
      </NotificationProvider>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('Context should provide notify function', () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    );

    const btn = screen.getByTestId('notify-btn');
    expect(btn).toBeInTheDocument();
  });

  it('notify should add a notification without throwing', () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    );

    const btn = screen.getByTestId('notify-btn');

    act(() => {
      btn.click();
    });

    expect(screen.getByText('test message')).toBeInTheDocument();
  });
});
