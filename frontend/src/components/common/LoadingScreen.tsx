import { Spinner } from '@/components/ui/Spinner';

export function LoadingScreen({ message = 'Loading BloodBridge...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold shadow-md shadow-rose-200">
          BB
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Blood<span className="text-rose-600">Bridge</span>
        </span>
      </div>
      <Spinner size="lg" label={message} />
    </div>
  );
}
