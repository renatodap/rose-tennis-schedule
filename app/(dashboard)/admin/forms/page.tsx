/**
 * Admin forms page (placeholder)
 * Future implementation will allow managing team forms
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/constants';

export default function AdminFormsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.PRIMARY}20` }}
          >
            <FileText className="h-6 w-6" style={{ color: BRAND_COLORS.PRIMARY }} aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Form Management</CardTitle>
            <CardDescription>Coming Soon</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-gray-600">
            Form management features are under development.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
