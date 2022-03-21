import { CustomWindowEvents, ComponentName } from '../constants';

interface depositEventHandlerProps {
  eventType: CustomWindowEvents;
  eventData?: string | object;
  setCustomHtml: (html: string | null) => void;
  depositStatus: any;
  setApiError: (
    error: { message: string; variant: 'danger' | 'warning' } | null,
  ) => void;
  setDepositLoading: (loading: boolean) => void;
  t: (symbol: string) => string;
  depositRequestId: number;
  bankId: number;
  locale?: string | null;
  setCurrentStep?: (step: number) => void;
  disableModal?: (name: ComponentName) => void;
  depositForm?: boolean;
}
export default depositEventHandlerProps;
