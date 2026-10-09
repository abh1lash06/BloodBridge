import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Activity, Building2, ShieldCheck, ArrowRight, Clock, CheckCircle2, Users, Sparkles, } from 'lucide-react';
export function LandingPage() {
    const { isAuthenticated, user, getRoleDashboardPath } = useAuth();
    return (<div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Heart className="w-5 h-5 fill-white text-rose-600"/>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Blood<span className="text-rose-600">Bridge</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (<Link to={getRoleDashboardPath(user?.role)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white font-medium text-sm hover:bg-rose-700 transition-colors shadow-sm">
                Go to Dashboard
                <ArrowRight className="w-4 h-4"/>
              </Link>) : (<>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white font-medium text-sm hover:bg-rose-700 transition-colors shadow-sm">
                  Get Started
                  <ArrowRight className="w-4 h-4"/>
                </Link>
              </>)}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5"/>
              <span>Real-Time Emergency Blood Management Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight sm:leading-tight mb-6">
              Connecting <span className="text-rose-600">Life-Saving Donors</span> With Patients & Hospitals In Minutes
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              When critical seconds matter, BloodBridge bridges the urgent gap between patients needing blood, verified donors ready to donate, and hospitals managing real-time inventory and reservations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-600 text-white font-semibold text-base hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">
                Register as Patient or Donor
                <ArrowRight className="w-4 h-4"/>
              </Link>
              <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-base hover:bg-slate-200 transition-colors">
                Hospital / Admin Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real Workflow Architecture */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Emergency Coordination Workflow
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              An end-to-end coordinated system connecting request to verified donation and fulfillment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Created</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patient or doctor logs an emergency blood request with units, required date, and urgency level.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Donor Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eligible, verified donors in the region receive instant match alerts in their inbox to accept or reject.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Hospital Reservation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hospital staff monitor inventory, confirm donor intake, and reserve blood units directly for the patient.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Verified Fulfillment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Units are fulfilled and released. Patients receive real-time notifications with full verification integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Value Cards */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patients */}
            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-5 shadow-sm">
                  <Activity className="w-6 h-6"/>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">For Patients & Families</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Fast emergency request creation without bureaucratic delays. Track matches, view donor availability, and receive live updates.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0"/>
                    <span>Instant match discovery across all 8 blood groups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0"/>
                    <span>Live status tracking: Open, Matched, Fulfilled</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0"/>
                    <span>Automated notifications upon donor acceptance</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-200/60">
                <Link to="/register" className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1">
                  Register as Patient <ArrowRight className="w-3.5 h-3.5"/>
                </Link>
              </div>
            </div>

            {/* Donors */}
            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-sm">
                  <Heart className="w-6 h-6 fill-white"/>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">For Blood Donors</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Manage your donation availability with a single toggle. View urgent requests matching your blood type and accept directly.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0"/>
                    <span>Official medical verification badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0"/>
                    <span>One-click availability toggle control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0"/>
                    <span>Match inbox for pending requests</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-200/60">
                <Link to="/register" className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1">
                  Register as Donor <ArrowRight className="w-3.5 h-3.5"/>
                </Link>
              </div>
            </div>

            {/* Hospitals */}
            <div className="p-6 rounded-2xl bg-teal-50/50 border border-teal-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-5 shadow-sm">
                  <Building2 className="w-6 h-6"/>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">For Hospitals & Clinics</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Manage complete 8-group inventory, track available vs. reserved units, reserve blood for urgent cases, and fulfill requests.
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0"/>
                    <span>Real-time inventory levels for all 8 blood groups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0"/>
                    <span>Safe reservation locking & release mechanism</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0"/>
                    <span>Auditable fulfillment lifecycle tracking</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-teal-200/60">
                <Link to="/login" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
                  Hospital Portal Access <ArrowRight className="w-3.5 h-3.5"/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Reliability */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-rose-400 mb-2"/>
              <h4 className="font-semibold text-slate-100 mb-1">Admin Verified</h4>
              <p className="text-xs text-slate-400">
                Donors and hospital facilities are verified by administrators before critical operations.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-rose-400 mb-2"/>
              <h4 className="font-semibold text-slate-100 mb-1">Emergency Speed</h4>
              <p className="text-xs text-slate-400">
                Direct matching algorithm ensures near-instant notification delivery to eligible donors.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-rose-400 mb-2"/>
              <h4 className="font-semibold text-slate-100 mb-1">Privacy Focused</h4>
              <p className="text-xs text-slate-400">
                Donor and patient contact information is securely shielded until matches are accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              BB
            </div>
            <span className="font-semibold text-slate-800">BloodBridge Platform</span>
          </div>
          <p>© {new Date().getFullYear()} BloodBridge. Dedicated to saving lives through rapid blood management.</p>
        </div>
      </footer>
    </div>);
}
