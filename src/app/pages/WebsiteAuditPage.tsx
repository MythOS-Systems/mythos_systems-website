import { Navigation } from '../components/Navigation';
import { WebsiteAuditor } from '../components/WebsiteAuditor';

/**
 * Internal, unlinked audit tool. Reachable only by typing
 * mythosrebellion.com/website-audit directly (not in nav, not prerendered,
 * marked noindex). No email gate, so the team can run audits on prospects
 * and see the full report instantly.
 */
export function WebsiteAuditPage() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <Navigation />
      <div className="h-20" />
      <WebsiteAuditor gated={false} />
    </div>
  );
}
