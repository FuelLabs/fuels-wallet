import { Toaster, toast } from 'react-hot-toast';

export { toast };

/** Square, hairline toasts on the card surface. Status shows as the 8px square. */
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 3000,
        className: 'fuel_Toast',
        style: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid var(--fuel-line)',
          background: 'var(--fuel-card)',
          color: 'var(--fuel-element-high-em)',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          lineHeight: '18px',
          padding: '8px 12px',
          maxWidth: '320px',
        },
        success: {
          icon: <span className="fuel-square" />,
        },
        error: {
          icon: <span className="fuel-square" data-kind="danger" />,
          duration: 5000,
        },
        loading: {
          icon: <span className="fuel-square" data-kind="active" />,
        },
      }}
    />
  );
}
