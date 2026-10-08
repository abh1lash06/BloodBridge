import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  ClipboardCheck,
} from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

export function AdminDashboard() {
  return (
    <PageContainer
      title="System Administration"
      description="Manage BloodBridge verification actions for donor and hospital profiles."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-indigo-100">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Donor Verification
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Verify a donor profile using its donor
              profile ID. Verification enables the
              donor to participate in BloodBridge
              matching workflows.
            </p>

            <Link
              to="/admin/donors"
              className="inline-block mt-5"
            >
              <Button
                variant="primary"
                size="sm"
                rightIcon={
                  <ArrowRight className="w-4 h-4" />
                }
              >
                Verify Donor
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="bg-teal-50/50 border-b border-teal-100">
            <CardTitle className="flex items-center gap-2 text-teal-900">
              <Building2 className="w-5 h-5 text-teal-600" />
              Hospital Verification
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              Verify or revoke verification for a
              hospital profile using its hospital
              profile ID.
            </p>

            <Link
              to="/admin/hospitals"
              className="inline-block mt-5"
            >
              <Button
                variant="primary"
                size="sm"
                rightIcon={
                  <ArrowRight className="w-4 h-4" />
                }
              >
                Manage Hospital
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Backend Verification Controls
              </h3>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                The current Spring Boot backend exposes
                verification actions directly, but does
                not expose admin listing or statistics
                endpoints. This dashboard therefore
                only presents actions supported by the
                current API contract.
              </p>

              <div className="flex items-center gap-2 mt-4 text-xs text-slate-600">
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                Verification actions use the authenticated
                ADMIN role.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}